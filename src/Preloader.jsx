import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import GreenMat from './GreenMat'
import './Preloader.css'

// Vector path constants for VentureX branding
const VENTURE_PATH = "M 223 92 L 222 97 L 221 101 L 221 106 L 219 111 L 219 121 L 220 123 L 223 126 L 225 127 L 235 127 L 237 126 L 239 124 L 243 124 L 246 126 L 247 127 L 249 127 L 251 125 L 251 120 L 254 110 L 254 105 L 256 100 L 256 96 L 257 95 L 257 92 L 249 92 L 249 94 L 248 95 L 248 99 L 246 108 L 245 113 L 243 116 L 240 119 L 238 120 L 231 120 L 227 116 L 227 112 L 230 102 L 230 97 L 232 92 Z M 302 91 L 299 92 L 293 95 L 290 98 L 288 101 L 287 103 L 286 105 L 285 109 L 285 118 L 286 120 L 287 122 L 290 125 L 292 126 L 294 127 L 306 127 L 311 125 L 313 123 L 314 123 L 315 122 L 315 121 L 317 118 L 315 117 L 310 117 L 307 120 L 305 121 L 298 121 L 296 120 L 294 118 L 293 116 L 294 111 L 320 111 L 321 109 L 321 99 L 320 97 L 319 95 L 318 94 L 317 94 L 315 92 L 312 91 Z M 302 97 L 309 97 L 313 101 L 313 103 L 313 106 L 295 105 L 295 103 L 300 98 Z M 282 91 L 279 92 L 277 93 L 273 92 L 265 92 L 264 94 L 264 99 L 262 103 L 261 108 L 261 113 L 259 118 L 258 123 L 258 127 L 266 126 L 267 124 L 268 119 L 268 114 L 269 110 L 270 106 L 271 104 L 274 101 L 277 99 L 285 99 L 285 95 L 286 94 L 286 91 Z M 173 91 L 170 92 L 165 94 L 165 92 L 157 92 L 156 94 L 156 99 L 154 109 L 151 119 L 151 123 L 150 124 L 150 127 L 152 127 L 158 127 L 159 124 L 160 120 L 161 110 L 162 106 L 163 104 L 164 102 L 167 99 L 169 98 L 176 98 L 179 101 L 179 103 L 180 105 L 179 110 L 178 116 L 175 127 L 177 127 L 183 127 L 184 125 L 184 121 L 186 116 L 188 105 L 188 97 L 187 95 L 184 92 L 182 91 Z M 129 91 L 125 92 L 123 93 L 120 95 L 117 98 L 115 101 L 114 103 L 113 105 L 112 109 L 112 118 L 113 120 L 114 122 L 117 125 L 119 126 L 122 127 L 132 127 L 136 126 L 138 125 L 141 123 L 144 120 L 145 118 L 142 117 L 137 117 L 134 120 L 132 121 L 125 121 L 120 116 L 121 111 L 148 110 L 148 99 L 147 97 L 146 95 L 145 94 L 144 94 L 142 92 L 139 91 Z M 130 97 L 135 97 L 137 98 L 141 102 L 140 106 L 122 104 L 123 102 L 127 98 Z M 205 83 L 204 84 L 202 84 L 201 90 L 199 92 L 194 92 L 194 95 L 193 96 L 193 98 L 199 100 L 197 105 L 195 116 L 195 122 L 196 124 L 198 126 L 201 127 L 211 126 L 212 123 L 212 120 L 206 120 L 204 118 L 204 111 L 206 101 L 207 99 L 217 97 L 218 92 L 209 91 L 210 86 L 210 83 Z M 73 80 L 73 84 L 74 85 L 74 90 L 76 95 L 76 100 L 79 110 L 80 121 L 81 125 L 84 127 L 89 127 L 91 127 L 95 125 L 96 122 L 101 115 L 105 108 L 112 94 L 117 87 L 120 80 L 111 80 L 109 82 L 107 86 L 104 93 L 92 114 L 88 115 L 88 109 L 85 98 L 85 92 L 83 86 L 82 80 Z M 76 69 L 72 71 L 64 75 L 62 76 L 61 78 L 64 76 L 66 76 L 74 71 L 76 71 L 78 70 L 80 69 Z"
const X_PATH = "M 397 62 L 394 64 L 392 64 L 385 68 L 371 74 L 369 74 L 365 76 L 366 80 L 359 87 L 357 88 L 355 87 L 354 86 L 353 84 L 352 81 L 348 75 L 331 75 L 332 78 L 342 94 L 346 94 L 348 95 L 349 98 L 338 109 L 331 117 L 323 128 L 308 145 L 308 146 L 303 151 L 302 153 L 304 152 L 308 148 L 313 145 L 327 133 L 331 130 L 334 129 L 336 126 L 341 122 L 342 122 L 351 114 L 355 114 L 356 114 L 357 115 L 357 116 L 363 124 L 363 125 L 381 126 L 380 124 L 379 122 L 369 106 L 367 104 L 366 105 L 364 104 L 363 101 L 369 94 L 373 90 L 375 89 L 377 90 L 379 88 L 381 84 L 389 73 L 395 66 L 395 65 Z"
const SPARKLE_PATH = "M 382 17 C 382 24 376 28 368 29 C 376 30 382 34 382 43 C 382 34 388 30 396 29 C 388 28 382 24 382 17 Z"
const TICKS_PATHS = ["M 14 62 L 30 44 L 34 47 L 18 65 Z", "M 39 46 L 47 25 L 52 27 L 44 48 Z", "M 63 36 L 77 48 L 73 52 L 59 40 Z"]
const OVAL_PATH = "M 18 92 C 18 42, 120 22, 235 23 C 330 24, 400 48, 398 80 C 396 118, 305 142, 195 142 C 105 142, 18 128, 18 92 Z"

export function Preloader({ isHome = true, onExitStart, onComplete }) {
  const [shouldRender, setShouldRender] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const containerRef = useRef(null)
  const ovalRef = useRef(null)
  const logoGroupRef = useRef(null)
  const xArrowRef = useRef(null)
  const sparkleRef = useRef(null)
  const ticksRef = useRef(null)
  const trailTopRef = useRef(null)
  const trailBottomRef = useRef(null)

  // 1. Clear any legacy session flag so preloader appears on every reload
  useEffect(() => {
    try {
      sessionStorage.removeItem('vx_preloader_seen')
    } catch {}
  }, [])

  // 2. Loading logic: smooth progress connected to real page resources
  useEffect(() => {
    if (!shouldRender) return

    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startTime = Date.now()
    const MIN_DURATION = isReduced ? 200 : 2800 // Paced duration to appreciate artwork
    const MAX_DURATION = 4800 // Fallback safety limit

    let animationFrame = null
    let targetProgress = 12

    const updateTarget = () => {
      const state = document.readyState
      if (state === 'complete') {
        targetProgress = Math.max(targetProgress, 60)
      } else if (state === 'interactive') {
        targetProgress = Math.max(targetProgress, 40)
      } else {
        targetProgress = Math.max(targetProgress, 25)
      }
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        targetProgress = Math.max(targetProgress, 45)
      }).catch(() => {})
    }

    updateTarget()
    const onStateChange = () => updateTarget()
    document.addEventListener('readystatechange', onStateChange)
    window.addEventListener('load', onStateChange)

    const step = () => {
      const elapsed = Date.now() - startTime

      if (elapsed > 600 && targetProgress < 35) targetProgress = 35
      if (elapsed > 1200 && targetProgress < 60) targetProgress = 60
      if (elapsed > 1800 && targetProgress < 82) targetProgress = 82
      if (elapsed > 2300 && targetProgress < 94) targetProgress = 94
      if (elapsed >= MIN_DURATION && (document.readyState === 'complete' || elapsed >= MAX_DURATION)) {
        targetProgress = 100
      }

      setProgress(prev => {
        if (prev >= 100) return 100
        const delta = targetProgress - prev
        const increment = Math.max(0.35, delta * 0.08)
        const next = Math.min(100, prev + increment)
        if (next >= 100) {
          setIsComplete(true)
          return 100
        }
        return next
      })

      if (targetProgress < 100 || progress < 100) {
        animationFrame = requestAnimationFrame(step)
      }
    }

    animationFrame = requestAnimationFrame(step)

    return () => {
      document.removeEventListener('readystatechange', onStateChange)
      window.removeEventListener('load', onStateChange)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [shouldRender])

  // 3. Entrance & Continuous Animations
  useEffect(() => {
    if (!shouldRender || !containerRef.current) return

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    const ctx = gsap.context(() => {
      // Oval stroke drawing animation
      if (ovalRef.current) {
        gsap.fromTo(
          ovalRef.current,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.25, ease: 'power2.inOut', delay: 0.1 }
        )
      }

      // Logo fade-in + slight scale
      if (logoGroupRef.current) {
        gsap.fromTo(
          logoGroupRef.current,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }
        )
      }

      // Purple X arrow entrance
      if (xArrowRef.current) {
        gsap.fromTo(
          xArrowRef.current,
          { scale: 0.8, opacity: 0, transformOrigin: 'center center' },
          { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.5)', delay: 0.2 }
        )
      }

      // Three ticks entrance
      if (ticksRef.current) {
        gsap.fromTo(
          ticksRef.current,
          { opacity: 0, scale: 0.6, transformOrigin: 'bottom right' },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.35 }
        )
      }

      // Sparkle gentle pulse (repeating)
      if (sparkleRef.current) {
        gsap.fromTo(
          sparkleRef.current,
          { scale: 0.85, opacity: 0.7, transformOrigin: 'center center' },
          { scale: 1.18, opacity: 1, duration: 0.85, repeat: -1, yoyo: true, ease: 'sine.inOut' }
        )
      }

      // Dashed motion trails continuous animation
      if (trailTopRef.current) {
        gsap.to(trailTopRef.current, {
          strokeDashoffset: -32,
          duration: 2.4,
          repeat: -1,
          ease: 'none'
        })
      }
      if (trailBottomRef.current) {
        gsap.to(trailBottomRef.current, {
          strokeDashoffset: 32,
          duration: 2.6,
          repeat: -1,
          ease: 'none'
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [shouldRender])

  // 4. Smooth Exit Transition when progress reaches 100%
  useEffect(() => {
    if (!isComplete || !containerRef.current) return

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const exitTimer = setTimeout(() => {
      if (isReduced) {
        if (onExitStart) onExitStart()
        if (onComplete) onComplete()
        setShouldRender(false)
        return
      }

      if (onExitStart) onExitStart()

      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.32,
        ease: 'power2.out',
        onComplete: () => {
          setShouldRender(false)
          if (onComplete) onComplete()
        }
      })
    }, 150)

    return () => clearTimeout(exitTimer)
  }, [isComplete, onExitStart, onComplete])

  if (!shouldRender) return null

  return (
    <aside
      ref={containerRef}
      className={'vx-preloader-overlay' + (isHome ? ' is-home' : ' is-fallback-bg')}
      aria-label="VentureX is loading"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {!isHome && (
        <div className="vx-preloader-bg">
          <GreenMat />
          <div className="vx-preloader-sunlight" aria-hidden="true" />
        </div>
      )}

      {/* Central Composition: Logo, Dashed Motion Trails & Loading Bar */}
      <div className="vx-center-composition">
        {/* Dashed motion trails SVG overlay */}
        <svg
          className="vx-trails-svg"
          viewBox="0 0 800 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            ref={trailTopRef}
            d="M 430 145 C 530 115, 630 110, 680 155"
            stroke="rgba(253, 251, 247, 0.45)"
            strokeWidth="2.2"
            strokeDasharray="7 8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            ref={trailBottomRef}
            d="M 410 320 C 310 355, 230 335, 195 305"
            stroke="rgba(253, 251, 247, 0.45)"
            strokeWidth="2.2"
            strokeDasharray="7 8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Central VentureX Logo Box */}
        <div className="vx-logo-box" ref={logoGroupRef}>
          <svg
            className="vx-logo-svg"
            viewBox="0 0 425 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={ovalRef}
              d={OVAL_PATH}
              fill="none"
              stroke="#FDFBF7"
              strokeWidth="2.2"
              strokeLinecap="round"
              pathLength="1"
            />
            <g ref={ticksRef}>
              {TICKS_PATHS.map((p, idx) => (
                <path key={idx} d={p} fill="#FDFBF7" />
              ))}
            </g>
            <g ref={sparkleRef}>
              <path d={SPARKLE_PATH} fill="#FDFBF7" />
            </g>
            <path
              d={VENTURE_PATH}
              fill="#FDFBF7"
              fillRule="evenodd"
            />
            <g ref={xArrowRef}>
              <path d={X_PATH} fill="#818CF8" />
            </g>
          </svg>
        </div>

        {/* Loading Indicator */}
        <div className="vx-progress-section">
          <div className="vx-progress-track">
            <div
              className="vx-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="vx-loading-text">Loading...</span>
        </div>
      </div>
    </aside>
  )
}
