'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MODEL_PATH = '/models/somali-cat.glb'

type CatState = 'Idle' | 'Walk' | 'Sit' | 'SitDown' | 'StandUp'

interface AutonomousCatProps {
  bounds?: number
}

export default function AutonomousCat({ bounds = 2.5 }: AutonomousCatProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL_PATH)
  const { actions } = useAnimations(animations, group)

  const [state, setState] = useState<CatState>('Idle')
  const targetRef = useRef(new THREE.Vector3(0, 0, 0))
  const speedRef = useRef(0.8)

  // 随机目标点（避开边缘）
  const getRandomTarget = useCallback(() => {
    return new THREE.Vector3(
      (Math.random() - 0.5) * bounds * 1.6,
      0,
      (Math.random() - 0.5) * bounds * 1.6
    )
  }, [bounds])

  // 播放动画
  const playAnimation = useCallback((name: CatState) => {
    if (!actions) return
    // 淡出所有动画
    Object.values(actions).forEach((action) => {
      if (action) action.fadeOut(0.3)
    })
    const target = actions[name]
    if (target) {
      target.reset().fadeIn(0.3).play()
    }
  }, [actions])

  // 每帧更新
  useFrame((_, delta) => {
    if (!group.current) return

    if (state === 'Walk') {
      const pos = group.current.position
      const target = targetRef.current
      const distance = pos.distanceTo(target)

      if (distance > 0.15) {
        // 朝向目标
        const direction = new THREE.Vector3().subVectors(target, pos).normalize()
        const angle = Math.atan2(direction.x, direction.z)
        // 平滑转向
        group.current.rotation.y += (angle - group.current.rotation.y) * 0.1
        // 移动
        pos.x += direction.x * speedRef.current * delta
        pos.z += direction.z * speedRef.current * delta
      } else {
        // 到达目标
        setState('Idle')
      }
    }
  })

  // 状态机定时器
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    switch (state) {
      case 'Idle':
        playAnimation('Idle')
        timer = setTimeout(() => {
          if (Math.random() > 0.3) {
            targetRef.current = getRandomTarget()
            speedRef.current = 0.5 + Math.random() * 0.5
            setState('Walk')
          } else {
            setState('SitDown')
          }
        }, 2000 + Math.random() * 4000)
        break

      case 'Walk':
        playAnimation('Walk')
        break

      case 'SitDown':
        playAnimation('SitDown')
        timer = setTimeout(() => {
          setState('Sit')
        }, 600) // 等坐下动画播完
        break

      case 'Sit':
        playAnimation('Sit')
        timer = setTimeout(() => {
          setState('StandUp')
        }, 3000 + Math.random() * 4000)
        break

      case 'StandUp':
        playAnimation('StandUp')
        timer = setTimeout(() => {
          setState('Idle')
        }, 600) // 等站起来动画播完
        break
    }

    return () => clearTimeout(timer)
  }, [state, playAnimation, getRandomTarget])

  return (
    <group ref={group} position={[0, 0, 0]} scale={0.6}>
      <primitive object={scene} />
    </group>
  )
}
