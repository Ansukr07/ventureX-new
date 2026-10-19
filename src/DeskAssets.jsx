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
    parallax: { mouseX: 14, mouseY: 10, scrollY: 0.28, rotScroll: 0.02 },
    entrance: { fromX: -90, fromY: -120, fromRotate: -52, delay: 0.05, duration: 1.15 }
  },
  {
    id: 'sticky',
    className: 'desk-item-sticky',
    src: assetStickyNote,
    alt: 'Sticky Note',
    baseRotate: -7,
    parallax: { mouseX: 8, mouseY: 6, scrollY: -0.52, rotScroll: -0.015, fadeWithScroll: true },
    entrance: { fromX: -25, fromY: -95, fromRotate: 12, delay: 0.12, duration: 1.05 }
  },
  {
    id: 'paperclip-sticky',
    className: 'desk-item-paperclip-sticky',
    src: assetPaperclip,
    alt: 'Paperclip on Sticky Note',
    baseRotate: 24,
    parallax: { mouseX: 8, mouseY: 6, scrollY: -0.52, rotScroll: -0.015, fadeWithScroll: true },
    entrance: { fromX: -15, fromY: -105, fromRotate: 45, delay: 0.18, duration: 1.0 }
  },
  {
    id: 'glasses',
    className: 'desk-item-glasses',
    src: assetGlasses,
    alt: 'Reading Glasses',
    baseRotate: 18,
    parallax: { mouseX: 20, mouseY: 16, scrollY: 0.36, rotScroll: -0.02 },
    entrance: { fromX: -130, fromY: 40, fromRotate: 5, delay: 0.22, duration: 1.2 }
  },
  {
    id: 'binder',
    className: 'desk-item-binder',
    src: assetBinderClip,
    alt: 'Binder Clip',
    baseRotate: 36,
    parallax: { mouseX: 16, mouseY: 12, scrollY: 0.42, rotScroll: 0.025 },
    entrance: { fromX: 85, fromY: -100, fromRotate: 65, delay: 0.1, duration: 1.15 }
  },
  {
    id: 'earphones',
    className: 'desk-item-earphones',
    src: assetEarphones,
    alt: 'Earphones',
    baseRotate: -12,
    parallax: { mouseX: 15, mouseY: 12, scrollY: 0.24, rotScroll: 0.01 },
    entrance: { fromX: 125, fromY: 20, fromRotate: -25, delay: 0.28, duration: 1.25 }
  },
  {
    id: 'paper-top',
    className: 'desk-item-paper-top',
    src: assetCrumpledPaper,
    alt: 'Crumpled Paper Ball',
    baseRotate: 42,
    parallax: { mouseX: 22, mouseY: 18, scrollY: 0.18, rotScroll: 0.03 },
    entrance: { fromX: 25, fromY: -110, fromRotate: 0, delay: 0.16, duration: 1.1 }
  },
  {
    id: 'paper-lowerleft',
    className: 'desk-item-paper-lowerleft',
    src: assetCrumpledPaper,
    alt: 'Crumpled Paper Ball',
    baseRotate: -32,
    parallax: { mouseX: 24, mouseY: 20, scrollY: -0.15, rotScroll: -0.02 },
    entrance: { fromX: -75, fromY: 90, fromRotate: -65, delay: 0.32, duration: 1.2 }
  },
  {
    id: 'paperclip-right',
    className: 'desk-item-paperclip-right',
    src: assetPaperclip,
    alt: 'Paperclip',
    baseRotate: -68,
    parallax: { mouseX: 10, mouseY: 8, scrollY: 0.15, rotScroll: -0.01 },
    entrance: { fromX: 55, fromY: 45, fromRotate: -90, delay: 0.36, duration: 0.95 }
  },
  {
    id: 'paper-bottomright',
    className: 'desk-item-paper-bottomright',
    src: assetCrumpledPaper,
    alt: 'Crumpled Paper Ball',
    baseRotate: 82,
    parallax: { mouseX: 22, mouseY: 18, scrollY: -0.18, rotScroll: 0.02 },
    entrance: { fromX: 85, fromY: 85, fromRotate: 120, delay: 0.42, duration: 1.2 }
  }
]

export function DeskAssets({ isEntering = false, isLeaving = false }) {
  const containerRef = useRef(null)
  const itemOuterRefs = useRef({})
  const itemInnerRefs = useRef({})
  const animFrameRef = useRef(null)

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
          clearProps: 'transform' // so inner transform doesn't fight
        }
      )
    })
  }, [isEntering])

  // 2. Handle Case opening exit transition (fade/drift out gracefully)
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

  // 3. Continuous 60fps/120fps Parallax & Ambient Motion
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    let mouseTargetX = 0
    let mouseTargetY = 0
    let mouseCurrentX = 0
    let mouseCurrentY = 0
    let isMouseMoving = false

    const handlePointerMove = e => {
      if (e.pointerType === 'touch') return
      isMouseMoving = true
      const halfW = window.innerWidth / 2
      const halfH = window.innerHeight / 2
      mouseTargetX = (e.clientX - halfW) / halfW // -1 to +1
      mouseTargetY = (e.clientY - halfH) / halfH // -1 to +1
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    let startTime = performance.now()

    const tick = () => {
      const now = performance.now()
      const elapsed = (now - startTime) * 0.001
      const scrollY = window.scrollY || 0

      // Smooth mouse interpolation
      mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.06
      mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.06

      ASSETS.forEach((asset, idx) => {
        const inner = itemInnerRefs.current[asset.id]
        if (!inner) return

        // 1. Mouse parallax
        const pX = mouseCurrentX * asset.parallax.mouseX
        const pY = mouseCurrentY * asset.parallax.mouseY

        // 2. Scroll parallax
        const sY = scrollY * asset.parallax.scrollY
        const sRot = scrollY * (asset.parallax.rotScroll || 0)

        // 3. Gentle ambient breathing (sine wave)
        const breatheY = Math.sin(elapsed * 1.2 + idx * 0.9) * 2.5
        const breatheRot = Math.cos(elapsed * 0.9 + idx * 0.7) * 0.5

        const totalX = pX
        const totalY = pY + sY + breatheY
        const totalRot = sRot + breatheRot

        inner.style.transform = `translate3d(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0) rotate(${totalRot.toFixed(2)}deg)`

        if (asset.parallax.fadeWithScroll) {
          const fade = Math.max(0, 1 - scrollY / 320)
          inner.style.opacity = fade.toFixed(2)
        }
      })

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
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
