'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

type AnimationName = 'Idle' | 'Walk' | 'Sit' | 'SitDown' | 'StandUp'

interface CatModel3DProps {
  animation?: AnimationName
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  enableDrag?: boolean
  autoRotate?: boolean
  className?: string
  style?: React.CSSProperties
}

const MODEL_PATH = '/models/somali-cat.glb'

function CatMesh({
  animation = 'Idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  autoRotate = false,
}: {
  animation?: AnimationName
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  autoRotate?: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL_PATH)
  const { actions } = useAnimations(animations, group)

  // 切换动画
  const prevAnimation = useRef<AnimationName>(animation)
  if (prevAnimation.current !== animation) {
    prevAnimation.current = animation
  }

  // 每次 animation 变化时切换
  const actionRef = useRef<THREE.AnimationAction | null>(null)
  if (actions && actions[animation] !== actionRef.current) {
    actionRef.current?.fadeOut(0.3)
    actionRef.current = actions[animation] || null
    if (actionRef.current) {
      actionRef.current.reset().fadeIn(0.3).play()
    }
  }

  // 自动旋转
  useFrame((_, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#C8956C" />
    </mesh>
  )
}

export default function CatModel3D({
  animation = 'Idle',
  position = [0, -0.5, 0],
  rotation = [0, 0, 0],
  scale = 1,
  enableDrag = false,
  autoRotate = false,
  className,
  style,
}: CatModel3DProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        camera={{ position: [0, 1, 3], fov: 35 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={0.8} />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />
        <Suspense fallback={<Loader />}>
          <CatMesh
            animation={animation}
            position={position}
            rotation={rotation}
            scale={scale}
            autoRotate={autoRotate}
          />
        </Suspense>
        {enableDrag && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        )}
      </Canvas>
    </div>
  )
}

// 预加载模型
useGLTF.preload(MODEL_PATH)
