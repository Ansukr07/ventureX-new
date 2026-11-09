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
      scrollY: 0.15,
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
      scrollY: 0.16,
      rotScroll: 0.02
    },
    entrance: { fromX: 85, fromY: 85, fromRotate: 120, delay: 0.42, duration: 1.2 }
  }
]

export function DeskAssets({ isEntering = false, isLeaving = false }) {
  const containerRef = useRef(null)
  const itemOuterRefs = useRef({})
  const itemInnerRefs = useRef({})
  const statesRef = useRef({})
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
          clearProps: 'transform'
        }
      )
    })
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

  // 3. The stationery catches the pointer's motion like light paper in a breeze.
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let visible = true
    let previousTime = 0
    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, vx: 0, vy: 0 }
    let target = { x: pointer.x, y: pointer.y }
    let hasPointer = false
    let observer
    const move = event => {
      if (event.pointerType === 'touch' || isReduced) return
      target = { x: event.clientX, y: event.clientY }
      hasPointer = true
      schedule()
    }
    const leave = () => { hasPointer = false; pointer.vx = 0; pointer.vy = 0; schedule() }
    const onScroll = () => schedule()
    const tick = time => {
      frame = 0
      if (!visible) return
      const delta = previousTime ? Math.min(time - previousTime, 40) : 16.7
      previousTime = time
      if (!isReduced) {
        const pointerEase = 1 - Math.exp(-delta / 95)
        const oldX = pointer.x
        const oldY = pointer.y
        pointer.x += (target.x - pointer.x) * pointerEase
        pointer.y += (target.y - pointer.y) * pointerEase
        pointer.vx = (pointer.x - oldX) / Math.max(delta, 1)
        pointer.vy = (pointer.y - oldY) / Math.max(delta, 1)
        const scrollY = window.scrollY || 0
        let unsettled = false
        ASSETS.forEach(asset => {
          const inner = itemInnerRefs.current[asset.id]
          const outer = itemOuterRefs.current[asset.id]
          if (!inner || !outer) return
          const physics = asset.physics
          const cur = statesRef.current[asset.id]
          const rect = outer.getBoundingClientRect()
          const dx = pointer.x - (rect.left + rect.width / 2)
          const dy = pointer.y - (rect.top + rect.height / 2)
          const distance = Math.hypot(dx, dy)
          const influence = hasPointer ? Math.pow(Math.max(0, 1 - distance / 560), 2) : 0
          const gustX = Math.max(-1, Math.min(1, pointer.vx * 42))
          const gustY = Math.max(-1, Math.min(1, pointer.vy * 42))
          const targetX = -gustX * influence * 5
          const targetY = scrollY * physics.scrollY - gustY * influence * 3
          const targetRot = scrollY * (physics.rotScroll || 0) + gustX * influence * 2.2
          const targetRotX = gustY * influence * -0.8
          const targetRotY = gustX * influence * 0.9
          const ease = 1 - Math.exp(-delta / 240)
          cur.x += (targetX - cur.x) * ease
          cur.y += (targetY - cur.y) * ease
          cur.rot += (targetRot - cur.rot) * ease
          cur.rotX += (targetRotX - cur.rotX) * ease
          cur.rotY += (targetRotY - cur.rotY) * ease
          if (Math.abs(targetX - cur.x) + Math.abs(targetY - cur.y) + Math.abs(targetRot - cur.rot) + Math.abs(targetRotX - cur.rotX) + Math.abs(targetRotY - cur.rotY) > 0.015 || Math.abs(pointer.vx) + Math.abs(pointer.vy) > 0.002) unsettled = true
          inner.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0) rotateX(${cur.rotX.toFixed(2)}deg) rotateY(${cur.rotY.toFixed(2)}deg) rotateZ(${cur.rot.toFixed(2)}deg)`
          if (physics.fadeWithScroll) inner.style.opacity = Math.max(0, 1 - scrollY / 320).toFixed(2)
        })
        if (unsettled || Math.abs(target.x - pointer.x) + Math.abs(target.y - pointer.y) > 0.1) frame = requestAnimationFrame(tick)
      }
    }
    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(tick) }
    const onVisibility = () => { visible = !document.hidden; if (visible) schedule(); else if (frame) cancelAnimationFrame(frame) }
    observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && !document.hidden; if (visible) schedule(); else if (frame) { cancelAnimationFrame(frame); frame = 0 } })
    observer.observe(containerRef.current)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      observer?.disconnect()
      if (frame) cancelAnimationFrame(frame)
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
