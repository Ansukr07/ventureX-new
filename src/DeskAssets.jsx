import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import assetBinderClip from './assets/assets/SVG/Asset 1.svg'
import assetEarphones from './assets/assets/SVG/Asset 2.svg'
import assetGlasses from './assets/assets/SVG/Asset 3.svg'
import assetPaperclip from './assets/assets/SVG/Asset 4.svg'
import assetCrumpledPaper from './assets/assets/SVG/Asset 5.svg'
import assetStickyNote from './assets/assets/SVG/Asset 6.svg'
import assetScissors from './assets/assets/SVG/Asset 7.svg'
import './DeskAssets.css'

const ASSETS = [
  {
    id: 'scissors',
    className: 'desk-item-scissors',
    src: assetScissors,
    alt: 'Scissors',
    baseRotate: -28,
    physics: {
      radius: 380,
      maxPush: 32,
      maxTorque: 14,
      tilt3D: 12,
      scaleLift: 0.04,
      lerp: 0.07,
      globalParallaxX: 14,
      globalParallaxY: 10,
      scrollY: 0.28,
      rotScroll: 0.02
    },
    entrance: { fromX: -90, fromY: -120, fromRotate: -52, delay: 0.05, duration: 1.15 }
  },
  {
    id: 'sticky',
    className: 'desk-item-sticky',
    src: assetStickyNote,
    alt: 'Sticky Note',
    baseRotate: -7,
    physics: {
      radius: 340,
      maxPush: 24,
      maxTorque: 10,
      tilt3D: 15,
      scaleLift: 0.05,
      lerp: 0.08,
      globalParallaxX: 9,
      globalParallaxY: 7,
      scrollY: -0.52,
      rotScroll: -0.015,
      fadeWithScroll: true
    },
    entrance: { fromX: -25, fromY: -95, fromRotate: 12, delay: 0.12, duration: 1.05 }
  },
  {
    id: 'paperclip-sticky',
    className: 'desk-item-paperclip-sticky',
    src: assetPaperclip,
    alt: 'Paperclip on Sticky Note',
    baseRotate: 24,
    physics: {
      radius: 300,
      maxPush: 28,
      maxTorque: 18,
      tilt3D: 10,
      scaleLift: 0.04,
      lerp: 0.09,
      globalParallaxX: 9,
      globalParallaxY: 7,
      scrollY: -0.52,
      rotScroll: -0.015,
      fadeWithScroll: true
    },
    entrance: { fromX: -15, fromY: -105, fromRotate: 45, delay: 0.18, duration: 1.0 }
  },
  {
    id: 'glasses',
    className: 'desk-item-glasses',
    src: assetGlasses,
    alt: 'Reading Glasses',
    baseRotate: 18,
    physics: {
      radius: 420,
      maxPush: 36,
      maxTorque: 12,
      tilt3D: 16,
      scaleLift: 0.05,
      lerp: 0.075,
      globalParallaxX: 20,
      globalParallaxY: 15,
      scrollY: 0.36,
      rotScroll: -0.02
    },
    entrance: { fromX: -130, fromY: 40, fromRotate: 5, delay: 0.22, duration: 1.2 }
  },
  {
    id: 'binder',
    className: 'desk-item-binder',
    src: assetBinderClip,
    alt: 'Binder Clip',
    baseRotate: 36,
    physics: {
      radius: 360,
      maxPush: 34,
      maxTorque: 18,
      tilt3D: 14,
      scaleLift: 0.05,
      lerp: 0.08,
      globalParallaxX: 16,
      globalParallaxY: 12,
      scrollY: 0.42,
      rotScroll: 0.025
    },
    entrance: { fromX: 85, fromY: -100, fromRotate: 65, delay: 0.1, duration: 1.15 }
  },
  {
    id: 'earphones',
    className: 'desk-item-earphones',
    src: assetEarphones,
    alt: 'Earphones',
    baseRotate: -12,
    physics: {
      radius: 400,
      maxPush: 28,
      maxTorque: 10,
      tilt3D: 10,
      scaleLift: 0.03,
      lerp: 0.065,
      globalParallaxX: 15,
      globalParallaxY: 12,
      scrollY: 0.24,
      rotScroll: 0.01
    },
    entrance: { fromX: 125, fromY: 20, fromRotate: -25, delay: 0.28, duration: 1.25 }
  },
  {
    id: 'paper-top',
    className: 'desk-item-paper-top',
    src: assetCrumpledPaper,
    alt: 'Crumpled Paper Ball',
    baseRotate: 42,
    physics: {
      radius: 360,
      maxPush: 44,
      maxTorque: 32,
      tilt3D: 18,
      scaleLift: 0.07,
      lerp: 0.095,
      globalParallaxX: 22,
      globalParallaxY: 17,
      scrollY: 0.18,
      rotScroll: 0.03
    },
    entrance: { fromX: 25, fromY: -110, fromRotate: 0, delay: 0.16, duration: 1.1 }
  },
  {
    id: 'paper-lowerleft',
    className: 'desk-item-paper-lowerleft',
    src: assetCrumpledPaper,
    alt: 'Crumpled Paper Ball',
    baseRotate: -32,
    physics: {
      radius: 380,
      maxPush: 46,
      maxTorque: 34,
      tilt3D: 18,
      scaleLift: 0.07,
      lerp: 0.09,
      globalParallaxX: 24,
      globalParallaxY: 19,
      scrollY: -0.15,
      rotScroll: -0.02
    },
    entrance: { fromX: -75, fromY: 90, fromRotate: -65, delay: 0.32, duration: 1.2 }
  },
  {
    id: 'paperclip-right',
    className: 'desk-item-paperclip-right',
    src: assetPaperclip,
    alt: 'Paperclip',
    baseRotate: -68,
    physics: {
      radius: 310,
      maxPush: 32,
      maxTorque: 24,
      tilt3D: 12,
      scaleLift: 0.04,
      lerp: 0.085,
      globalParallaxX: 11,
      globalParallaxY: 9,
      scrollY: 0.15,
      rotScroll: -0.01
    },
    entrance: { fromX: 55, fromY: 45, fromRotate: -90, delay: 0.36, duration: 0.95 }
  },
  {
    id: 'paper-bottomright',
    className: 'desk-item-paper-bottomright',
    src: assetCrumpledPaper,
    alt: 'Crumpled Paper Ball',
    baseRotate: 82,
    physics: {
      radius: 390,
      maxPush: 48,
      maxTorque: 36,
      tilt3D: 18,
      scaleLift: 0.07,
      lerp: 0.095,
      globalParallaxX: 24,
      globalParallaxY: 19,
      scrollY: -0.18,
      rotScroll: 0.02
    },
    entrance: { fromX: 85, fromY: 85, fromRotate: 120, delay: 0.42, duration: 1.2 }
  }
]

export function DeskAssets({ isEntering = false, isLeaving = false }) {
  const containerRef = useRef(null)
  const itemOuterRefs = useRef({})
  const itemInnerRefs = useRef({})
  const centersRef = useRef({})
  const statesRef = useRef({})
  const mousePosRef = useRef({ x: null, y: null })
  const mouseVelRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef(null)

  // Initialize individual physics states for each asset
  if (Object.keys(statesRef.current).length === 0) {
    ASSETS.forEach(asset => {
      statesRef.current[asset.id] = {
        x: 0,
        y: 0,
        rot: 0,
        rotX: 0,
        rotY: 0,
        scale: 1
      }
    })
  }

  // Measure and cache resting centers of each desk asset
  const updateCenters = () => {
    ASSETS.forEach(asset => {
      const el = itemOuterRefs.current[asset.id]
      if (el) {
        const rect = el.getBoundingClientRect()
        centersRef.current[asset.id] = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        }
      }
    })
  }

  // 1. Initial Entrance & Re-entering animation (GSAP)
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    ASSETS.forEach(asset => {
      const el = itemOuterRefs.current[asset.id]
      if (!el) return

      const { fromX, fromY, fromRotate, delay, duration } = asset.entrance
      gsap.fromTo(
        el,
        {
          x: fromX,
          y: fromY,
          rotation: asset.baseRotate + fromRotate,
          opacity: 0,
          scale: 0.88
        },
        {
          x: 0,
          y: 0,
          rotation: asset.baseRotate,
          opacity: 1,
          scale: 1,
          duration,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
          onComplete: () => {
            updateCenters()
          }
        }
      )
    })

    const timer = setTimeout(updateCenters, 300)
    return () => clearTimeout(timer)
  }, [isEntering])

  // 2. Handle Case opening exit transition
  useEffect(() => {
    if (isLeaving) {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (isReduced) return

      const elements = Object.values(itemOuterRefs.current).filter(Boolean)
      gsap.to(elements, {
        opacity: 0,
        y: 40,
        scale: 0.94,
        duration: 0.45,
        stagger: 0.03,
        ease: 'power2.in'
      })
    }
  }, [isLeaving])

  // 3. Continuous 60fps/120fps Individual Cursor Physics Loop
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    updateCenters()

    let lastX = null
    let lastY = null

    const handlePointerMove = e => {
      if (e.pointerType === 'touch') return
      if (lastX !== null && lastY !== null) {
        // Compute cursor swipe velocity (clamped)
        const vx = Math.max(-50, Math.min(50, e.clientX - lastX))
        const vy = Math.max(-50, Math.min(50, e.clientY - lastY))
        mouseVelRef.current.x = vx
        mouseVelRef.current.y = vy
      }
      lastX = e.clientX
      lastY = e.clientY
      mousePosRef.current = { x: e.clientX, y: e.clientY }
    }

    const handlePointerLeave = () => {
      mousePosRef.current = { x: null, y: null }
      mouseVelRef.current = { x: 0, y: 0 }
      lastX = null
      lastY = null
    }

    const handleResize = () => {
      updateCenters()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    const startTime = performance.now()

    const tick = () => {
      const now = performance.now()
      const elapsed = (now - startTime) * 0.001
      const scrollY = window.scrollY || 0
      const mouse = mousePosRef.current
      const vel = mouseVelRef.current

      // Gradually decay cursor swipe impulse
      vel.x *= 0.88
      vel.y *= 0.88

      const halfW = window.innerWidth / 2
      const halfH = window.innerHeight / 2
      const hasMouse = mouse.x !== null && mouse.y !== null

      const globalNormX = hasMouse ? (mouse.x - halfW) / halfW : 0
      const globalNormY = hasMouse ? (mouse.y - halfH) / halfH : 0

      ASSETS.forEach((asset, idx) => {
        const inner = itemInnerRefs.current[asset.id]
        if (!inner) return

        const physics = asset.physics
        const cur = statesRef.current[asset.id]
        const center = centersRef.current[asset.id]

        let pushX = 0
        let pushY = 0
        let rotPush = 0
        let tiltX = 0
        let tiltY = 0
        let liftScale = 1

        // Individual cursor vector calculation relative to THIS asset
        if (hasMouse && center) {
          const dx = mouse.x - center.x
          const dy = mouse.y - center.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < physics.radius) {
            // Smooth proximity falloff (cubic smoothstep)
            const t = 1 - dist / physics.radius
            const strength = t * t * (3 - 2 * t)

            // Directional physical repulsion away from cursor
            const invDist = 1 / (dist || 1)
            const nx = dx * invDist
            const ny = dy * invDist

            pushX = -nx * physics.maxPush * strength
            pushY = -ny * physics.maxPush * strength

            // Cursor sweep wind/impulse transfer
            pushX += vel.x * 0.25 * strength
            pushY += vel.y * 0.25 * strength

            // Rotational torque: spins dynamically based on cursor direction & swipe
            rotPush = (dx / physics.radius) * physics.maxTorque * strength + (vel.x * 0.12 - vel.y * 0.12) * strength

            // 3D perspective tilt towards/away from cursor
            tiltX = -(dy / physics.radius) * physics.tilt3D * strength
            tiltY = (dx / physics.radius) * physics.tilt3D * strength

            // Subtle tactile physical lift
            liftScale = 1 + physics.scaleLift * strength
          }
        }

        // Global ambient depth parallax
        const globX = globalNormX * physics.globalParallaxX
        const globY = globalNormY * physics.globalParallaxY

        // Scroll parallax
        const scrY = scrollY * physics.scrollY
        const scrRot = scrollY * (physics.rotScroll || 0)

        // Subtle ambient organic float
        const breatheY = Math.sin(elapsed * 1.1 + idx * 0.9) * 2.2
        const breatheRot = Math.cos(elapsed * 0.8 + idx * 0.7) * 0.5

        // Combined individual targets
        const targetX = pushX + globX
        const targetY = pushY + globY + scrY + breatheY
        const targetRot = rotPush + scrRot + breatheRot
        const targetRotX = tiltX
        const targetRotY = tiltY
        const targetScale = liftScale

        // Independent physics interpolation (lerp) per asset
        const k = physics.lerp
        cur.x += (targetX - cur.x) * k
        cur.y += (targetY - cur.y) * k
        cur.rot += (targetRot - cur.rot) * k
        cur.rotX += (targetRotX - cur.rotX) * k
        cur.rotY += (targetRotY - cur.rotY) * k
        cur.scale += (targetScale - cur.scale) * k

        inner.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0) rotateX(${cur.rotX.toFixed(2)}deg) rotateY(${cur.rotY.toFixed(2)}deg) rotateZ(${cur.rot.toFixed(2)}deg) scale(${cur.scale.toFixed(3)})`

        if (physics.fadeWithScroll) {
          const fade = Math.max(0, 1 - scrollY / 320)
          inner.style.opacity = fade.toFixed(2)
        }
      })

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className="desk-assets-container" aria-hidden="true">
      {ASSETS.map(asset => (
        <div
          key={asset.id}
          className={`desk-item ${asset.className}`}
          ref={el => { itemOuterRefs.current[asset.id] = el }}
          style={{ transform: `rotate(${asset.baseRotate}deg)` }}
        >
          <div
            className="desk-item-inner"
            ref={el => { itemInnerRefs.current[asset.id] = el }}
          >
            <img src={asset.src} alt={asset.alt} draggable="false" />
          </div>
        </div>
      ))}
    </div>
  )
}
