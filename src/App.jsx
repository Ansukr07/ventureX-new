import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import cases from './cases.json'
import about from './about.json'
import { DeskAssets } from './DeskAssets'
import './App.css'

gsap.registerPlugin(Flip)
if (typeof window !== 'undefined') {
  window.gsap = gsap
  window.Flip = Flip
}

const groups = [
  { color: '#699ad1', label: 'Organic & Early Modernism', description: 'The movement that broke from European convention before Europe finished writing its manifesto. Buildings designed around human life, natural landscape, and open space — where structure followed environment, not the other way around. The root system beneath everything American Modernism would later become.', files: [0, 1] },
  { color: '#ec2127', label: 'Expressive', description: 'Where function alone was never enough. These architects pushed form, material, and structure into territory that was confrontational, sculptural, and deeply personal. Every surface carried an argument, every material choice a point of view. Buildings that refused to stand quietly in the background and never apologized for it.', files: [2] },
  { color: '#f5cf51', label: 'Monumental Modernism', description: 'Architecture at the scale of civilization — civic, institutional, and built to outlast the moment. These buildings draw on mass, geometry, and the precise control of light to create spaces that feel both inevitable and timeless. Modernism stripped of sentimentality, left with only what matters.', files: [3, 4, 5] },
  { color: '#803f98', label: 'Contextual & Transitional Architecture', description: 'Architecture shaped by place, culture, and continuity rather than formal invention alone. Mix of tradition and modernity through local materials, historical reference, and environmental logic that resist the impulse to impose and choose instead to belong. A quiet but foundational thread in the fabric of American architectural identity.', files: [6, 7] }
]

function useRoute() {
  const [path, setPath] = useState(location.pathname)
  useEffect(() => {
    const f = () => setPath(location.pathname)
    addEventListener('popstate', f)
    return () => removeEventListener('popstate', f)
  }, [])
  function go(next, scrollToTop = true) {
    if (next !== location.pathname) {
      history.pushState({}, '', next)
    }
    if (next !== path) {
      setPath(next)
    }
    if (scrollToTop) window.scrollTo({ top: 0, behavior: 'instant' })
  }
  return [path, go]
}

function Link({ to, go, children, ...props }) {
  return (
    <a
      href={to}
      onClick={e => {
        e.preventDefault()
        go(to)
      }}
      {...props}
    >
      {children}
    </a>
  )
}

function Header({ go, onGoHome }) {
  return (
    <header className="the-header">
      <div className="the-header-inner">
        <a
          href="/"
          className="the-header-logo"
          onClick={e => {
            e.preventDefault()
            if (onGoHome) onGoHome()
            else go('/')
          }}
        >
          VENTURE X
        </a>
        <Link to="/about" go={go} className="the-header-about">
          About
        </Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="folder-footer">
      <img className="scale" src="/footer/scale.svg" alt="Architectural scale" />
      <span className="footer-year">© 2026</span>
      <a href="https://tubikstudio.com/" target="_blank" rel="noreferrer">
        <span>CRAFTED WITH ♥ BY <u>TUBIK STUDIO</u></span>
        <img className="footer-seal" src="/footer/tubik_logo.svg" alt="Tubik Studio" />
      </a>
    </footer>
  )
}

const compassImages = ['f.png', 'f-1.png', 'f-2.avif', 'f-3.png', 'f-4.png', 'f-5.png', 'f-6.avif']

function CompassRow() {
  const row = useRef(null)
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let pointer = null
    const draw = () => {
      frame = 0
      if (!pointer || motion.matches) return
      const compasses = Array.from(row.current?.children ?? [])
      const angles = compasses.map(el => {
        const rect = el.getBoundingClientRect()
        return Math.atan2(pointer.y - rect.top - rect.height / 2, pointer.x - rect.left - rect.width / 2) * 180 / Math.PI + 45
      })
      compasses.forEach((el, i) => {
        el.firstElementChild.style.transform = `rotate(${angles[i]}deg)`
      })
    }
    const move = e => {
      if (e.pointerType === 'touch' || motion.matches) return
      pointer = { x: e.clientX, y: e.clientY }
      if (!frame) frame = requestAnimationFrame(draw)
    }
    const reset = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      for (const el of row.current?.children ?? []) el.firstElementChild.style.transform = ''
    }
    window.addEventListener('pointermove', move, { passive: true })
    motion.addEventListener('change', reset)
    return () => {
      window.removeEventListener('pointermove', move)
      motion.removeEventListener('change', reset)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <div ref={row} className="compass-row" aria-hidden="true">
      {compassImages.map((src, i) => (
        <span className={'compass' + (i === 0 || i === 3 ? ' hide-on-mobile' : '')} key={src}>
          <img src={'/footer/' + src} alt="" draggable="false" />
        </span>
      ))}
    </div>
  )
}

function TabShape({ name }) {
  const path = "M1.1449 0H-521.145C-531.065 0-540.343 4.90374-545.932 13.0999L-558.55 31.6066C-563.837 39.3607-572.615 44-582 44H62C52.6151 44 43.8369 39.3607 38.5499 31.6066L25.9318 13.0999C20.3434 4.90373 11.0649 0 1.1449 0Z"
  return (
    <>
      <svg className="tab-side tab-start" viewBox="0 0 62 44" preserveAspectRatio="none" aria-hidden="true">
        <path d={path} fill="currentColor" />
      </svg>
      <span className="tab-middle">{name}</span>
      <svg className="tab-side tab-end" viewBox="0 0 62 44" preserveAspectRatio="none" aria-hidden="true">
        <path d={path} fill="currentColor" />
      </svg>
    </>
  )
}

function isTabDark(color) {
  return color === '#f5cf51' || color === '#f5cf52'
}

function PaperclipTop({ className = '' }) {
  return (
    <svg className={`paperclip-svg ${className}`} viewBox="0 0 24 107" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2.05513 5.28193C4.21232 2.09502 7.8614 0.000174314 11.9995 3.55316e-05C18.6269 3.55316e-05 23.9995 5.37279 23.9996 12.0001L24.0003 95.0002C24.0003 101.628 18.6275 107 12.0002 107C5.37279 107 0.00010339 101.628 0.00010339 95.0002L0.00010339 42.905H1.99989L1.99989 95.0002C1.99989 100.523 6.47735 105.001 12.0002 105.001C17.5229 105 22.0005 100.523 22.0005 95.0002L21.9998 12.0001C21.9997 6.47745 17.5229 2.00066 12.0002 2.00051C8.34976 2.00051 5.15651 3.95666 3.41065 6.87775L2.05513 5.28193Z" fill="currentColor" />
    </svg>
  )
}

function PaperclipFull({ className = '' }) {
  return (
    <svg className={`paperclip-full-svg ${className}`} viewBox="0 0 27 119" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6.07566 41.2136L6.54471 92.5805C6.5831 96.7849 8.75324 103.607 12.6652 105.148C18.4425 107.424 19.2992 98.314 19.4108 92.1056L20.809 14.2625C20.9243 7.84149 17.9926 1.08318 11.5708 1.12736C5.20542 1.17115 1.9815 7.56937 1.93352 13.9347C1.59947 58.2519 -0.17395 97.5992 2.92809 107.458C6.26416 118.061 20.5413 121.357 23.626 110.501C26.7107 99.645 24.338 73.1576 24.7038 43.2007" stroke="currentColor" strokeWidth="2.25426" strokeLinecap="round" />
    </svg>
  )
}

const NOTE_COLORS = [
  { bg: '#FFDE7A', text: '#181408', name: 'yellow' },
  { bg: '#8EACED', text: '#0e1726', name: 'blue' },
  { bg: '#79B6B2', text: '#082524', name: 'teal' },
  { bg: '#F7A399', text: '#2d0f0c', name: 'coral' }
]

const NOTE_ROTATIONS = [2.25, -1.75, 1.5, -2.1]

function Home({ go, isEntering, closedGroupIndex, closedPageIndex, onEnteringComplete, onSelectCase, onSaveRects }) {
  const [hovered, setHovered] = useState(null)
  const [unfolded, setUnfolded] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const isTransitioningRef = useRef(false)

  function preview(group, page) {
    if (isTransitioningRef.current) return
    setHovered({ group, page })
    setUnfolded(false)
  }
  function resetPreview() {
    if (isTransitioningRef.current) return
    setHovered(null)
    setUnfolded(false)
  }

  useEffect(() => {
    document.title = 'Venture X'
  }, [])

  // Cache folder positions for pixel-perfect Flip returning
  useLayoutEffect(() => {
    const folders = Array.from(document.querySelectorAll('.archive .folder'))
    if (folders.length > 0 && onSaveRects) {
      onSaveRects(folders.map(f => f.getBoundingClientRect()))
    }
  }, [onSaveRects])

  // Exact zct animation when returning from Case to Home: unselected folders rise from down
  useLayoutEffect(() => {
    if (isEntering) {
      isTransitioningRef.current = true
      const folders = Array.from(document.querySelectorAll('.archive .folder'))
      const unselected = (closedGroupIndex !== null && closedGroupIndex !== undefined)
        ? folders.filter((_, idx) => idx !== closedGroupIndex)
        : folders

      // Hide unselected folders off-screen BEFORE paint so there is zero flash
      gsap.set(unselected, { yPercent: 120 })
      gsap.set('.hero-title', { y: '2rem', opacity: 0 })

      let inactiveTabsOnClosedFolder = []
      if (closedGroupIndex !== null && closedGroupIndex !== undefined && folders[closedGroupIndex]) {
        const closedFolder = folders[closedGroupIndex]
        const closedSheets = Array.from(closedFolder.querySelectorAll('.folder-sheet'))
        if (closedPageIndex !== null && closedPageIndex !== undefined) {
          inactiveTabsOnClosedFolder = closedSheets
            .filter((_, idx) => idx !== closedPageIndex)
            .map(s => s.querySelector('.folder-tab.is-visible'))
            .filter(Boolean)
          if (inactiveTabsOnClosedFolder.length > 0) {
            gsap.set(inactiveTabsOnClosedFolder, { yPercent: 110 })
          }
        }
      }

      const tl = gsap.timeline({
        defaults: { duration: 0.75, ease: 'power2.out' },
        onComplete: () => {
          isTransitioningRef.current = false
          if (onEnteringComplete) onEnteringComplete()
        }
      })
      tl.to(unselected,
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', clearProps: 'yPercent' },
        0
      )
      if (inactiveTabsOnClosedFolder.length > 0) {
        tl.to(inactiveTabsOnClosedFolder,
          { yPercent: 0, duration: 0.6, ease: 'power3.out', clearProps: 'yPercent' },
          0.3
        )
      }
      tl.to('.hero-title',
        { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', clearProps: 'y,opacity' },
        0
      )
      tl.fromTo('.folder-description',
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power2.out', clearProps: 'opacity' },
        0.6
      )
    }
  }, [isEntering, closedGroupIndex, closedPageIndex, onEnteringComplete])

  const handleTabClick = (groupIndex, pageIndex, item) => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    setIsLeaving(true)

    const folders = Array.from(document.querySelectorAll('.archive .folder'))
    const unselected = folders.filter((_, idx) => idx !== groupIndex)
    const selected = folders[groupIndex]
    const desc = selected?.querySelector('.folder-description')
    const cat = selected?.querySelector('.folder-category')

    // Peer tabs on this selected folder that were NOT clicked
    const allSheets = selected ? Array.from(selected.querySelectorAll('.folder-sheet')) : []
    const inactivePeerTabs = allSheets
      .filter((_, idx) => idx !== pageIndex)
      .map(s => s.querySelector('.folder-tab.is-visible'))
      .filter(Boolean)

    const targetRect = selected ? selected.getBoundingClientRect() : null

    // Exact Dct Home leave animation (0.6s)
    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: 'power2.out' },
      onComplete: () => {
        if (onSelectCase) {
          onSelectCase(groupIndex, pageIndex, item, targetRect)
        } else {
          go('/cases/' + item.slug)
        }
      }
    })

    tl.to('.hero-title', { y: '2rem', opacity: 0, duration: 0.45 }, 0.05)
    tl.to(unselected, { yPercent: 120, duration: 0.6, stagger: 0.08, ease: 'power2.in' }, 0)
    if (inactivePeerTabs.length > 0) {
      tl.to(inactivePeerTabs, { yPercent: 110, duration: 0.4, ease: 'power2.in' }, 0)
    }
    if (desc) tl.to(desc, { opacity: 0, duration: 0.15 }, 0)
    if (cat) tl.to(cat, { opacity: 0, duration: 0.15 }, 0)
  }

  return (
    <main className="home">
      <DeskAssets isEntering={isEntering} isLeaving={isLeaving} />
      <section className="intro" id="hero">
        <h1 className="hero-title">VENTURE X</h1>
      </section>
      <section className="archive">
        <div className="stack">
          {groups.map((g, i) => {
            const selected = hovered?.group === i
            const later = hovered !== null && i > hovered.group
            const expanded = selected || (!hovered && i === groups.length - 1)

            return (
              <article
                key={g.label}
                onMouseLeave={resetPreview}
                className={
                  'folder' +
                  (later ? ' is-rotated' : '') +
                  (later && unfolded ? ' is-unfolded' : '')
                }
                style={{
                  '--color': cases[g.files[0]].color,
                  '--i': i,
                  '--remaining': groups.length - i - 1
                }}
              >
                <div className="folder-inner">
                  <div className={'folder-face' + (selected ? ' is-rotated' : '') + (selected && hovered.page === 0 ? ' is-hovered' : '') + (expanded ? ' is-unfolded' : '') + (isTabDark(cases[g.files[0]].color) ? ' is-light' : '')}>
                    <span className="folder-category">
                      <span className="folder-category-label">{g.label}</span>
                      <svg className="folder-category-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
                        <path d="M2.5 3.75L6.17542 8.25L9.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="folder-description">{g.description}</span>
                    {i === groups.length - 1 && (
                      <div className="folder-open-content">
                        <CompassRow />
                        <Footer />
                      </div>
                    )}
                  </div>
                  {g.files.map((index, page) => (
                    <a
                      key={index}
                      href={'/cases/' + cases[index].slug}
                      onClick={e => {
                        e.preventDefault()
                        handleTabClick(i, page, cases[index])
                      }}
                      className={'folder-sheet' + (selected && page < hovered.page ? ' is-rotated' : '')}
                      style={{ '--sheet-color': cases[index].color, '--page': page }}
                      aria-label={'Explore ' + cases[index].name}
                      onMouseEnter={() => preview(i, page)}
                      onFocus={() => preview(i, page)}
                      onBlur={e => {
                        if (!e.currentTarget.contains(e.relatedTarget)) resetPreview()
                      }}
                    >
                      <span className="tab-row" aria-hidden="true">
                        {g.files.map((tabIndex, slot) => (
                          <span
                            key={tabIndex}
                            className={'folder-tab' + (slot === page ? ' is-visible' : '') + (isTabDark(cases[index].color) ? ' tab-dark' : '')}
                            style={{ '--tab-color': cases[index].color }}
                          >
                            <TabShape name={cases[tabIndex].name} />
                          </span>
                        ))}
                      </span>
                      <span className="folder-unfold-area" onMouseEnter={() => setUnfolded(true)} onMouseLeave={() => setUnfolded(false)} />
                    </a>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

function FilePage({ entry, isInitialOpen, transitionGroupIndex, targetRect, onNavigate, onRegisterGoHome, onInitialOpenComplete }) {
  const [activeEntry, setActiveEntry] = useState(entry)
  const isSwitchingRef = useRef(false)
  const [isHeaderShrunk, setIsHeaderShrunk] = useState(false)
  const hasFlippedRef = useRef(false)

  const activeCaseIndex = cases.findIndex(c => c.slug === activeEntry.slug)
  const safeCaseIndex = activeCaseIndex >= 0 ? activeCaseIndex : 0
  const nextCase = cases[(safeCaseIndex + 1) % cases.length]
  const nextGroup = groups.find(g => g.files.some(idx => cases[idx].slug === nextCase.slug))

  const coverRef = useRef(null)
  const frontShadowRef = useRef(null)
  const coverShadowRef = useRef(null)
  const folderRef = useRef(null)
  const paperRef = useRef(null)
  const contentInnerRef = useRef(null)

  useEffect(() => {
    setActiveEntry(entry)
  }, [entry])

  const currentGroupIndex = groups.findIndex(g => g.files.some(i => cases[i].slug === activeEntry.slug))
  const safeGroupIndex = currentGroupIndex >= 0 ? currentGroupIndex : (transitionGroupIndex !== undefined ? transitionGroupIndex : 0)
  const group = groups[safeGroupIndex] || groups[0]
  const firstCase = cases[group.files[0]]
  const firstCaseColor = firstCase ? firstCase.color : activeEntry.color
  const remaining = groups.length - 1 - safeGroupIndex
  const peers = group.files.map(i => cases[i])

  useEffect(() => {
    document.title = activeEntry.name + '—Venture X'
  }, [activeEntry])

  // Initial Open Animation (1.5s power3.inOut with 90deg Flip)
  useLayoutEffect(() => {
    if (!isInitialOpen || hasFlippedRef.current) return
    hasFlippedRef.current = true

    const cover = coverRef.current
    const coverShadow = coverShadowRef.current
    const chars = document.querySelectorAll('.case-hero-title .case-char')
    const activeTag = document.querySelector('.case-folder-tags__page.--active .case-folder-tag.is-visible')
    const inactiveTags = document.querySelectorAll('.case-folder-tags__page:not(.--active) .case-folder-tag.is-visible')
    const paper = paperRef.current
    const items = document.querySelectorAll(
      '.project, .extra-photos, .case-bottom, .case-next-widget'
    )
    const folder = folderRef.current

    const isMobile = window.innerWidth <= 768
    // Fallback if targetRect wasn't passed (e.g. direct load)
    const rect = targetRect || (isMobile ? {
      left: 12,
      top: Math.round(window.innerHeight * 0.54 + safeGroupIndex * 50),
      width: window.innerWidth - 24,
      height: Math.round(window.innerHeight * 0.75 + remaining * 50)
    } : {
      left: Math.round((window.innerWidth - Math.min(1320, window.innerWidth * 0.93)) / 2),
      top: Math.round(window.innerHeight * 0.54),
      width: Math.min(1320, Math.round(window.innerWidth * 0.93)),
      height: Math.round(window.innerHeight * 0.8 + remaining * 60)
    })

    if (folder) {
      // 1. Initial stack placement: matches clicked folder on Home down to the sub-pixel
      folder.style.position = 'fixed'
      folder.style.left = `${rect.left}px`
      folder.style.top = `${rect.top}px`
      folder.style.width = `${rect.height}px`
      folder.style.height = `${rect.width}px`
      folder.style.transformOrigin = 'top left'
      folder.style.transform = `translateY(${rect.height}px) rotate(-90deg)`
      folder.style.zIndex = '100'

      // Prepare initial states: cover shut at 0deg
      gsap.set(cover, { rotateY: 0, transformOrigin: 'left center', visibility: 'visible' })
      gsap.set(chars, { xPercent: -150, opacity: 0 })
      // Active tag is attached and visible from t = 0 (rotates smoothly with folder)
      if (activeTag) gsap.set(activeTag, { yPercent: 0, opacity: 1 })
      // Inactive peer tabs start tucked behind folder edge
      if (inactiveTags.length > 0) gsap.set(inactiveTags, { yPercent: 110, opacity: 0 })
      gsap.set(paper, { rotate: -6, y: 55, opacity: 0.2 })
      gsap.set(items, { y: '50vh', opacity: 0 })

      // 2. Capture Flip state from exact stack position
      const state = Flip.getState(folder, { props: 'transform,backgroundColor' })

      // 3. Clear inline styles so folder computes its in-flow detail layout
      folder.style.position = ''
      folder.style.left = ''
      folder.style.top = ''
      folder.style.width = ''
      folder.style.height = ''
      folder.style.transformOrigin = ''
      folder.style.transform = ''
      folder.style.zIndex = ''

      const tl = gsap.timeline({
        defaults: { duration: 1.5, ease: 'power3.inOut' },
        paused: true
      })

      // 1. 3D Cover flips open: rotateY 0deg -> -180deg over 1.5s
      tl.to(cover, {
        rotateY: -180,
        duration: 1.5,
        ease: 'power3.inOut'
      }, 0)

      // 2. Cover shadow peaks at 0.25s (opacity: 1), fades at 0.6s (opacity: 0)
      tl.fromTo(coverShadow, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power3.inOut' }, 0.25)
      tl.to(coverShadow, { opacity: 0, duration: 0.3, ease: 'power3.inOut' }, 0.6)

      // 3. Inner lined notebook page swings into view at 0.35s (rotate: -6deg -> 0deg, y: 55px -> 0px)
      tl.to(paper, { rotate: 0, y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.35)

      // 4. Header title characters shutter reveal from left at 0.65s (xPercent: -150 -> 0, stagger: 0.025s)
      tl.to(chars, { xPercent: 0, opacity: 1, duration: 0.65, stagger: 0.025, ease: 'power2.out' }, 0.65)

      // 5. Inactive side tags slide up into place at 0.85s (matches inspo kct: original-transitions.js:68)
      if (inactiveTags.length > 0) {
        tl.to(inactiveTags, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'yPercent,opacity'
        }, 0.85)
      }

      // 6. Scrapbook items rise up at 1.0s (y: 50vh -> 0)
      tl.to(items, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 1.0)

      // 7. Morph folder from rotated stack position to upright case view
      Flip.from(state, {
        duration: 1.5,
        ease: 'power3.inOut',
        onStart: () => {
          tl.play()
        },
        onComplete: () => {
          if (onInitialOpenComplete) onInitialOpenComplete()
        }
      })
    } else {
      if (onInitialOpenComplete) onInitialOpenComplete()
    }
  }, [isInitialOpen, targetRect, onInitialOpenComplete, remaining])

  // Exact Tab-to-Tab Switch Animation (Pct Leave: 0.75s + Kct Enter: 0.75s)
  const handleTabClick = (e, targetCase) => {
    if (e) e.preventDefault()
    if (targetCase.slug === activeEntry.slug || isSwitchingRef.current) return
    isSwitchingRef.current = true

    const cover = coverRef.current
    const frontShadow = frontShadowRef.current
    const chars = document.querySelectorAll('.case-hero-title .case-char')
    const items = document.querySelectorAll(
      '.project, .extra-photos, .case-bottom, .case-next-widget'
    )
    const folder = folderRef.current

    // Set turning leaf colors:
    // Back face (peeling off from -180deg): outgoing architect color (activeEntry.color)
    // Front face (arriving at 0deg): incoming architect color (targetCase.color)
    if (folder) {
      folder.style.setProperty('--turning-back-color', activeEntry.color)
      folder.style.setProperty('--turning-front-color', targetCase.color)
    }

    // Set target tab to switching state so it immediately transitions smoothly
    const allTags = document.querySelectorAll('.case-folder-tag')
    allTags.forEach(tag => {
      if (tag.getAttribute('href')?.includes(targetCase.slug)) {
        tag.classList.add('is-switching-to')
      } else {
        tag.classList.remove('is-active')
      }
    })

    gsap.set(cover, { visibility: 'visible' })

    // 1. Leave Timeline (Pct)
    // Matches Mosby Files original-transitions.js:
    // Scrapbook items drop 50vh (0.25s power2.in) at time 0
    // Title chars exit right (0.5s stagger: 0.02) at time 0.15
    // Cover closes -180deg -> 0deg (0.75s power3.out) at time 0.15
    // Front shadow fades 0 -> 1 at time 0.15
    const leaveTl = gsap.timeline({
      defaults: { duration: 0.75, ease: 'power3.out' },
      onComplete: () => {
        // Cover is now completely closed (rotateY: 0)
        // Switch active architect state synchronously behind the closed cover
        flushSync(() => {
          setActiveEntry(targetCase)
        })

        if (folderRef.current) {
          folderRef.current.style.setProperty('--case-color', targetCase.color)
          folderRef.current.style.setProperty('--turning-front-color', targetCase.color)
          folderRef.current.style.setProperty('--turning-back-color', targetCase.color)
        }
        history.pushState({}, '', '/cases/' + targetCase.slug)
        window.scrollTo({ top: 0, behavior: 'instant' })

        // Target incoming page elements (guaranteed in DOM via flushSync)
        const newChars = document.querySelectorAll('.case-hero-title .case-char')
        const newItems = document.querySelectorAll(
          '.project, .extra-photos, .case-bottom, .case-next-widget'
        )

        // Ensure incoming elements are hidden behind closed cover
        gsap.set(newChars, { xPercent: 150, opacity: 0 })
        gsap.set(newItems, { y: '50vh', opacity: 0 })

        // Ensure cover is visible and pinned at 0deg before opening
        gsap.set(cover, { rotateY: 0, visibility: 'visible' })

        // Clean up switching class from tags now that activeEntry is updated
        document.querySelectorAll('.case-folder-tag').forEach(tag => {
          tag.classList.remove('is-switching-to')
        })

        // 2. Enter Timeline (Kct)
        // Matches Mosby Files original-transitions.js:
        // Cover flips open from 0deg to -180deg (0.75s power3.inOut) at time 0
        // Front shadow fades 1 -> 0 (0.75s) at time 0
        // Title characters shutter in from right (0.5s stagger: -0.025 power2.out) at time 0.2
        // Scrapbook items rise up from 50vh (0.5s power3.out) at time 0.55
        const enterTl = gsap.timeline({
          defaults: { duration: 0.75, ease: 'power2.inOut' },
          onComplete: () => {
            isSwitchingRef.current = false
            if (onNavigate) {
              onNavigate('/cases/' + targetCase.slug)
            }
          }
        })

        enterTl.fromTo(cover, { rotateY: 0 }, {
          rotateY: -180,
          duration: 0.75,
          ease: 'power2.inOut'
        }, 0)
        enterTl.fromTo(frontShadow, { opacity: 1 }, { opacity: 0, duration: 0.75, ease: 'power2.inOut' }, 0)
        enterTl.to(newChars, { xPercent: 0, opacity: 1, duration: 0.5, stagger: -0.025, ease: 'power2.out' }, 0.2)
        enterTl.to(newItems, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.55)
      }
    })

    // Outgoing scrapbook items drop 50vh (power2.in)
    leaveTl.to(items, { y: '50vh', opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
    // Outgoing title chars exit to right (xPercent: 150)
    leaveTl.to(chars, { xPercent: 150, opacity: 0, duration: 0.5, stagger: 0.02, ease: 'power2.in' }, 0.15)
    // Cover closes shut (-180deg -> 0deg)
    leaveTl.fromTo(cover, { rotateY: -180 }, { rotateY: 0, duration: 0.75, ease: 'power3.out' }, 0.15)
    // Front shadow fades in
    leaveTl.fromTo(frontShadow, { opacity: 0 }, { opacity: 1, duration: 0.75 }, 0.15)
  }

  // Register close folder handler for "MOSBY'S FILES" logo click (Rct)
  useEffect(() => {
    if (onRegisterGoHome) {
      onRegisterGoHome((param1, param2) => {
        if (isSwitchingRef.current) return
        isSwitchingRef.current = true

        const done = typeof param1 === 'function' ? param1 : param2
        const closeRect = (typeof param1 === 'object' && param1) ? param1 : targetRect

        const cover = coverRef.current
        const frontShadow = frontShadowRef.current
        const chars = document.querySelectorAll('.case-hero-title .case-char')
        const activeTag = document.querySelector('.case-folder-tags__page.--active .case-folder-tag.is-visible')
        const inactiveTags = document.querySelectorAll('.case-folder-tags__page:not(.--active) .case-folder-tag.is-visible')
        const items = document.querySelectorAll(
          '.project, .extra-photos, .case-bottom, .case-next-widget'
        )
        const folder = folderRef.current

        if (folder) {
          folder.style.setProperty('--turning-front-color', firstCaseColor)
          folder.style.setProperty('--turning-back-color', activeEntry.color)
        }

        window.scrollTo({ top: 0, behavior: 'instant' })

        gsap.set(cover, { visibility: 'visible' })

        // 0. Only inactive peer tags drop away before folder rotates back into stack
        if (inactiveTags.length > 0) {
          gsap.to(inactiveTags, { yPercent: 110, opacity: 0, duration: 0.35, ease: 'power2.in' })
        }
        if (activeTag) {
          gsap.set(activeTag, { yPercent: 0, opacity: 1 })
        }

        // 1. Scrapbook items drop down
        gsap.to(items, { y: '50vh', opacity: 0, duration: 0.2, ease: 'power2.in' })

        // 2. Chars exit to left
        gsap.to(chars, { xPercent: -150, opacity: 0, duration: 1.15, stagger: 0.035, ease: 'power2.inOut' })

        // 3. Front shadow
        gsap.fromTo(frontShadow, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'power3.inOut' }, 0)
        gsap.to(frontShadow, { opacity: 0, duration: 0.4, ease: 'power3.inOut' }, 1.0)

        // 4. Cover rotates shut
        gsap.to(cover, { rotateY: 0, duration: 1.5, ease: 'power3.inOut' })

        // 5. Flip folder back to stack geometry
        const isMobile = window.innerWidth <= 768
        const rect = closeRect || (isMobile ? {
          left: 12,
          top: Math.round(window.innerHeight * 0.54 + safeGroupIndex * 50),
          width: window.innerWidth - 24,
          height: Math.round(window.innerHeight * 0.75 + remaining * 50)
        } : {
          left: Math.round((window.innerWidth - Math.min(1320, window.innerWidth * 0.93)) / 2),
          top: Math.round(window.innerHeight * 0.54 + safeGroupIndex * 60),
          width: Math.min(1320, Math.round(window.innerWidth * 0.93)),
          height: Math.round(window.innerHeight * 0.8 + remaining * 60)
        })

        if (folder) {
          const state = Flip.getState(folder, { props: 'transform,backgroundColor' })

          folder.style.position = 'fixed'
          folder.style.left = `${rect.left}px`
          folder.style.top = `${rect.top}px`
          folder.style.width = `${rect.height}px`
          folder.style.height = `${rect.width}px`
          folder.style.transformOrigin = 'top left'
          folder.style.transform = `translateY(${rect.height}px) rotate(-90deg)`
          folder.style.zIndex = '100'

          Flip.from(state, {
            duration: 1.5,
            ease: 'power3.inOut',
            onComplete: () => {
              isSwitchingRef.current = false
              if (done) done()
            }
          })
        } else {
          setTimeout(() => {
            isSwitchingRef.current = false
            if (done) done()
          }, 1500)
        }
      })
    }
  }, [onRegisterGoHome, targetRect, remaining, safeGroupIndex])

  // Sticky header shrink on scroll > 55px
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0
          const top = window.scrollY || document.documentElement.scrollTop
          if (top > 55 && !isHeaderShrunk) {
            setIsHeaderShrunk(true)
          } else if (top <= 45 && isHeaderShrunk) {
            setIsHeaderShrunk(false)
          }
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isHeaderShrunk])

  // Scrapbook Parallax & Micro-rotations (rotate: ±2deg)
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return

    const targets = document.querySelectorAll(
      '.portrait, .project-photo, .project-note, .extra-photos img'
    )

    let frame = 0
    const updateParallax = () => {
      frame = 0
      const vh = window.innerHeight
      targets.forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        if (rect.bottom >= -80 && rect.top <= vh + 80) {
          const centerY = rect.top + rect.height / 2
          const progress = (centerY - vh / 2) / (vh / 2)
          const clamped = Math.max(-1.4, Math.min(1.4, progress))
          const parallaxY = clamped * -15
          const sign = index % 2 === 0 ? 1 : -1
          const microRotate = sign * (clamped * 2.0)
          el.style.transform = `translate3d(0, ${parallaxY.toFixed(1)}px, 0) rotate(${microRotate.toFixed(2)}deg)`
        }
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateParallax)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateParallax()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [activeEntry.slug])

  return (
    <>
      <main className="case-page" style={{ '--case-color': activeEntry.color, '--first-case-color': firstCaseColor }}>
      <section className={'case-hero' + (isHeaderShrunk ? ' is-shrunk' : '')}>
        <h1 className="case-hero-title" aria-label={activeEntry.name}>
          {activeEntry.name.split('').map((char, i) => (
            <span key={`${activeEntry.slug}-${i}`} className="case-char-mask">
              <span className="case-char">
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          ))}
        </h1>
      </section>

      {/* In-flow container for case detail layout */}
      <div className="case-content">
        <div className="case-content__inner" ref={contentInnerRef}>
          <div
            className="case-folder"
            ref={folderRef}
            style={{
              '--case-color': activeEntry.color,
              '--first-case-color': firstCaseColor,
              '--remaining': remaining
            }}
          >
            {/* 3D Skeuomorphic Folder Cover */}
            <div className="case-folder__cover" ref={coverRef}>
              <div className="case-folder__cover__front">
                <div className="case-folder__cover__front__overlay" />
                <div className="case-folder__cover__front__shadow" ref={frontShadowRef} />
              </div>
              <div className="case-folder__cover__back">
                <div className="case-folder__cover__back__overlay" />
              </div>
              <div className="case-folder__cover__shadow" ref={coverShadowRef} />
            </div>

            {/* Vertical Side Tabs on right edge of folder (exact multi-layer slots matching inspo) */}
            <div className="case-edge case-folder-tags">
              {peers.map((pageEntry, pageIdx) => {
                const isActive = pageEntry.slug === activeEntry.slug
                return (
                  <div
                    key={pageEntry.slug}
                    className={'case-folder-tags__page' + (isActive ? ' --active' : '')}
                    style={{
                      '--bg-color': pageEntry.color,
                      zIndex: isActive ? 10 : (peers.length - pageIdx)
                    }}
                  >
                    {peers.map((item, slot) => {
                      const isCurrentSlot = slot === pageIdx
                      return (
                        <a
                          key={item.slug}
                          href={'/cases/' + item.slug}
                          className={'case-folder-tag' + (isCurrentSlot ? ' is-visible' : ' is-spacer') + (isActive && isCurrentSlot ? ' is-active' : '')}
                          onClick={e => {
                            if (isCurrentSlot) handleTabClick(e, item)
                          }}
                          aria-label={isCurrentSlot ? item.name : undefined}
                          aria-hidden={!isCurrentSlot}
                          tabIndex={isCurrentSlot ? 0 : -1}
                        >
                          <span
                            className={'folder-tab' + (isCurrentSlot ? ' is-visible' : '') + (isTabDark(pageEntry.color) ? ' tab-dark' : '')}
                            style={{ '--tab-color': pageEntry.color }}
                          >
                            <TabShape name={item.name} />
                          </span>
                        </a>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            {/* Open Folder Inner Content */}
            <div className="case-folder__inner">
              <article className="paper dossier" ref={paperRef}>
                <div className="holes" aria-hidden="true">
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <div className="dossier-left">
                  <div className="portrait">
                    <img src={activeEntry.images[0]} alt={activeEntry.name} />
                    <span className="portrait-clip-wrapper" aria-hidden="true">
                      <PaperclipTop className="portrait-paperclip" />
                    </span>
                  </div>
                  <div className="life-info">
                    {activeEntry.info.map((line, i) => (
                      <p key={i} className={i % 2 === 0 ? 'info-label' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
                <div className="bio">
                  {activeEntry.bio.map((p, i) => (
                    <p key={i} className={i === 0 ? 'dropcap' : ''}>{p}</p>
                  ))}
                </div>
              </article>

              <div className="projects">
                {activeEntry.notes.map((note, i) => {
                  const noteTheme = NOTE_COLORS[i % NOTE_COLORS.length]
                  const noteRot = NOTE_ROTATIONS[i % NOTE_ROTATIONS.length]
                  return (
                    <section className={'project project-' + i} key={i}>
                      <div className="project-photos">
                        {activeEntry.images.slice(1 + i * 2, 3 + i * 2).map((src, j) => (
                          <a
                            href={src}
                            target="_blank"
                            rel="noreferrer"
                            className={`project-photo ${j === 0 ? 'photo-plan' : 'photo-feature'}`}
                            key={src}
                            aria-label={'Open image of ' + note.title}
                          >
                            <img src={src} alt={note.title + ' photograph ' + (j + 1)} loading="lazy" />
                            {j === 1 && (
                              <span className="photo-clip-wrapper" aria-hidden="true">
                                <PaperclipFull className="photo-paperclip" />
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                      <div
                        className={`project-note note-${noteTheme.name}`}
                        style={{
                          '--note-bg': noteTheme.bg,
                          '--note-color': noteTheme.text,
                          '--note-rot': `${noteRot}deg`
                        }}
                      >
                        <span className="note-clip-wrapper" aria-hidden="true">
                          <PaperclipTop className="note-paperclip" />
                        </span>
                        <span className="note-texture-overlay" aria-hidden="true" />
                        <h2>{note.title}</h2>
                        <p>{note.text}</p>
                      </div>
                    </section>
                  )
                })}

                {activeEntry.images.length > activeEntry.notes.length * 2 + 1 && (
                  <div className="extra-photos">
                    {activeEntry.images.slice(1 + activeEntry.notes.length * 2).map((src, i) => (
                      <img key={src} src={src} alt={activeEntry.name + ' archival image ' + (i + 1)} loading="lazy" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="case-bottom">
        <p>EXPLORE THE FILES</p>
        <div>
          {cases.filter(c => c.slug !== activeEntry.slug).slice(0, 4).map(c => (
            <a key={c.slug} href={'/cases/' + c.slug} onClick={e => handleTabClick(e, c)}>
              {c.name} ↗
            </a>
          ))}
        </div>
      </div>
    </main>

    {/* Floating Next Case Widget matching inspo */}
    {nextCase && (
      <aside
        className="case-next-widget"
        style={{ '--next-case-color': nextCase.color }}
        onClick={e => handleTabClick(e, nextCase)}
        role="button"
        tabIndex={0}
        aria-label={`Go to next file: ${nextCase.name}`}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') handleTabClick(e, nextCase)
        }}
      >
        <div className="case-next-card">
          <span className="case-next-kicker">Next File</span>
          <h4 className="case-next-name">{nextCase.name}</h4>
          <p className="case-next-sub">
            {nextGroup?.label || (nextCase.notes?.[0]?.title ? nextCase.notes[0].title.split('(')[0].trim() : 'Archive Dossier')}
          </p>
        </div>
        <span className="case-next-btn">Next →</span>
      </aside>
    )}
  </>
  )
}

function About({ go }) {
  useEffect(() => {
    document.title = 'About Venture X'
  }, [])
  return (
    <main className="about-page">
      <article className="about-paper paper">
        <button className="about-close" onClick={() => go('/')} aria-label="Close About">×</button>
        <h1>{about.title}</h1>
        {about.images[0] && (
          <figure>
            <img src={about.images[0]} alt="Salk Institute by Louis Kahn" />
            <figcaption>{about.texts[0]}</figcaption>
          </figure>
        )}
        {about.texts.slice(4, -1).map((p, i) => (
          <div key={i}>
            {i === 5 && about.images[1] && (
              <figure>
                <img src={about.images[1]} alt="National Assembly Building" />
                <figcaption>{about.texts[1]}</figcaption>
              </figure>
            )}
            {i === 9 && about.images[2] && (
              <figure>
                <img src={about.images[2]} alt="Yale Art and Architecture Building" />
                <figcaption>{about.texts[2]}</figcaption>
              </figure>
            )}
            <p>{p}</p>
          </div>
        ))}
        <p className="signature">{about.texts.at(-1)}</p>
      </article>
    </main>
  )
}

export default function App() {
  const [path, go] = useRoute()
  const [isHomeEntering, setIsHomeEntering] = useState(false)
  const [closedGroupIndex, setClosedGroupIndex] = useState(null)
  const [closedPageIndex, setClosedPageIndex] = useState(null)
  const [transition, setTransition] = useState(null)
  const filePageGoHomeRef = useRef(null)
  const folderRectsRef = useRef([])

  const entry = cases.find(c => path === '/cases/' + c.slug)
  const currentGroupIndex = entry ? groups.findIndex(g => g.files.some(i => cases[i].slug === entry.slug)) : 0
  const safeCurrentGroupIndex = currentGroupIndex >= 0 ? currentGroupIndex : 0

  const handleGoHome = () => {
    if (entry && filePageGoHomeRef.current) {
      const gIndex = groups.findIndex(g => g.files.some(i => cases[i].slug === entry.slug))
      const safeGIndex = gIndex >= 0 ? gIndex : 0
      const pIndex = groups[safeGIndex]?.files.findIndex(i => cases[i].slug === entry.slug)
      const safePIndex = pIndex >= 0 ? pIndex : 0
      const targetRect = folderRectsRef.current[safeGIndex] || null
      setTransition({ type: 'case-to-home', entry, groupIndex: safeGIndex, targetRect })

      filePageGoHomeRef.current(targetRect, () => {
        setClosedGroupIndex(safeGIndex)
        setClosedPageIndex(safePIndex)
        setIsHomeEntering(true)
        setTransition(null)
        go('/', true)
      })
    } else {
      go('/')
    }
  }

  const handleEnteringComplete = () => {
    setIsHomeEntering(false)
    setClosedGroupIndex(null)
    setClosedPageIndex(null)
  }

  const handleSelectCase = (groupIndex, pageIndex, item, targetRect) => {
    setTransition({
      type: 'home-to-case',
      groupIndex,
      pageIndex,
      item,
      targetRect
    })
  }

  const handleSaveFolderRects = (rects) => {
    folderRectsRef.current = rects
  }

  return (
    <div className="app">
      <Header go={go} onGoHome={handleGoHome} />
      {transition?.type === 'home-to-case' ? (
        <FilePage
          key={`group-${transition.groupIndex}`}
          entry={transition.item}
          isInitialOpen={true}
          transitionGroupIndex={transition.groupIndex}
          targetRect={transition.targetRect}
          onInitialOpenComplete={() => {
            setTransition(null)
            go('/cases/' + transition.item.slug, false)
          }}
          onNavigate={nextPath => go(nextPath, false)}
          onRegisterGoHome={fn => { filePageGoHomeRef.current = fn }}
        />
      ) : transition?.type === 'case-to-home' ? (
        <FilePage
          key={`group-${transition.groupIndex}`}
          entry={transition.entry}
          isInitialOpen={false}
          transitionGroupIndex={transition.groupIndex}
          targetRect={transition.targetRect}
          onNavigate={nextPath => go(nextPath, false)}
          onRegisterGoHome={fn => { filePageGoHomeRef.current = fn }}
        />
      ) : entry ? (
        <FilePage
          key={`group-${safeCurrentGroupIndex}`}
          entry={entry}
          isInitialOpen={false}
          targetRect={folderRectsRef.current[safeCurrentGroupIndex]}
          onNavigate={nextPath => go(nextPath, false)}
          onRegisterGoHome={fn => { filePageGoHomeRef.current = fn }}
        />
      ) : path === '/about' ? (
        <About go={go} />
      ) : (
        <Home
          go={go}
          isEntering={isHomeEntering}
          closedGroupIndex={closedGroupIndex}
          closedPageIndex={closedPageIndex}
          onEnteringComplete={handleEnteringComplete}
          onSelectCase={handleSelectCase}
          onSaveRects={handleSaveFolderRects}
        />
      )}
    </div>
  )
}
