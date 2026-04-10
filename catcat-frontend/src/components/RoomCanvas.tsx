'use client'

import { useState, Suspense, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { Trash2 } from 'lucide-react'
import { type Room, type Furniture } from '@/lib/api'
import dynamic from 'next/dynamic'

const AutonomousCat = dynamic(() => import('@/components/AutonomousCat'), { ssr: false })

// 网格坐标转 3D 坐标
function gridTo3D(gridX: number, gridY: number): [number, number, number] {
  const x = (gridX - 3) * 1.0
  const z = (gridY - 3) * 1.0
  return [x, 0.4, z]
}

// 3D 坐标转网格坐标
function toGridCoord(worldX: number, worldZ: number): { x: number; y: number } {
  const gx = Math.round(worldX / 1.0 + 3)
  const gy = Math.round(worldZ / 1.0 + 3)
  return {
    x: Math.max(0, Math.min(6, gx)),
    y: Math.max(0, Math.min(6, gy)),
  }
}

// 地板
function Floor({ onClickCell }: { onClickCell: (x: number, y: number) => void }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        const point = e.point
        const grid = toGridCoord(point.x, point.z)
        onClickCell(grid.x, grid.y)
      }}
    >
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#F5EDE3" />
    </mesh>
  )
}

// 地板网格线
function FloorGrid() {
  const lines: JSX.Element[] = []
  for (let i = 0; i <= 6; i++) {
    const pos = i - 3
    lines.push(
      <lineSegments key={`h-${i}`}>
        <edgesGeometry
          args={[new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-3.5, 0.01, pos - 0.5),
            new THREE.Vector3(3.5, 0.01, pos - 0.5),
          ])]}
        />
        <lineBasicMaterial color="#E0D5C8" transparent opacity={0.5} />
      </lineSegments>
    )
    lines.push(
      <lineSegments key={`v-${i}`}>
        <edgesGeometry
          args={[new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(pos - 0.5, 0.01, -3.5),
            new THREE.Vector3(pos - 0.5, 0.01, 3.5),
          ])]}
        />
        <lineBasicMaterial color="#E0D5C8" transparent opacity={0.5} />
      </lineSegments>
    )
  }
  return <group>{lines}</group>
}

// 墙壁
function Walls() {
  return (
    <group>
      <mesh position={[0, 1.5, -3.5]} receiveShadow>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial color="#F0E8DE" />
      </mesh>
      <mesh position={[-3.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial color="#EDE5DA" />
      </mesh>
    </group>
  )
}

// 家具
function FurnitureItem({
  item,
  onRemove,
}: {
  item: Room['furniture'][0]
  onRemove: (id: number) => void
}) {
  const [hovered, setHovered] = useState(false)
  const position = gridTo3D(item.positionX, item.positionY)

  return (
    <Html
      position={position}
      center
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="furniture-item-3d"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          if (hovered) onRemove(item.id)
        }}
      >
        <span style={{ fontSize: '2.5rem' }}>{item.emoji}</span>
        {hovered && (
          <div className="furniture-remove-btn">
            <Trash2 size={14} color="white" />
          </div>
        )}
        <div style={{
          fontSize: '0.625rem',
          color: '#888',
          textAlign: 'center',
          marginTop: '-4px',
        }}>
          {item.name}
        </div>
      </div>
    </Html>
  )
}

// 3D 场景内容
function RoomScene({
  room,
  selectedFurniture,
  onPlaceFurniture,
  onRemoveFurniture,
}: {
  room: Room
  selectedFurniture: Furniture | null
  onPlaceFurniture: (furniture: Furniture, x: number, y: number) => void
  onRemoveFurniture: (id: number) => void
}) {
  const occupiedCells = new Set(
    room.furniture.map(f => `${f.positionX},${f.positionY}`)
  )

  const handleFloorClick = useCallback((gridX: number, gridY: number) => {
    if (!selectedFurniture) return
    if (occupiedCells.has(`${gridX},${gridY}`)) return
    onPlaceFurniture(selectedFurniture, gridX, gridY)
  }, [selectedFurniture, occupiedCells, onPlaceFurniture])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        castShadow
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.3} />

      <Floor onClickCell={handleFloorClick} />
      <FloorGrid />
      <Walls />

      {room.furniture.map(item => (
        <FurnitureItem key={item.id} item={item} onRemove={onRemoveFurniture} />
      ))}

      <AutonomousCat bounds={2.5} />

      <OrbitControls
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
        minDistance={5}
        maxDistance={12}
        target={[0, 0, 0]}
      />
    </>
  )
}

interface RoomCanvasProps {
  room: Room
  selectedFurniture: Furniture | null
  onPlaceFurniture: (furniture: Furniture, x: number, y: number) => void
  onRemoveFurniture: (id: number) => void
}

export default function RoomCanvas({
  room,
  selectedFurniture,
  onPlaceFurniture,
  onRemoveFurniture,
}: RoomCanvasProps) {
  return (
    <Canvas
      camera={{ position: [6, 5, 6], fov: 40 }}
      shadows
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <RoomScene
          room={room}
          selectedFurniture={selectedFurniture}
          onPlaceFurniture={onPlaceFurniture}
          onRemoveFurniture={onRemoveFurniture}
        />
      </Suspense>
    </Canvas>
  )
}
