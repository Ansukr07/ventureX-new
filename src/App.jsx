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

function setPageMetadata(title, description) {
  document.title = title
  const setContent = (selector, attribute, value) => {
    const element = document.querySelector(selector)
    if (element) element.setAttribute(attribute, value)
  }
  setContent('meta[name="description"]', 'content', description)
  setContent('meta[property="og:title"]', 'content', title)
  setContent('meta[property="og:description"]', 'content', description)
  const url = window.location.origin + window.location.pathname
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url
  setContent('meta[property="og:url"]', 'content', url)
}

const groups = [
  { color: '#699ad1', label: 'Event Overview', description: 'The essential VentureX details and guidance for founders preparing to pitch.', files: [0, 6] },
  { color: '#ec2127', label: 'Timeline & Phases', description: 'Follow the journey from online video submissions, through the Top 30 shortlist, to the live investor pitching round.', files: [1] },
  { color: '#f5cf51', label: 'Participant Guide', description: 'Find eligibility, team, fee, and coordination information for teams considering VentureX.', files: [2, 3, 4] },
  { color: '#803f98', label: 'Why Participate', description: 'Put your idea in front of investors, learn from industry perspectives, and build connections that can move your venture forward.', files: [5, 7] }
]

const teamPhotoNames = [
  'Vaibhav Balakundi', 'P Deepthi Jain', 'Milan Sampath', 'Yeshwin J',
  'Rishav Kumar Singh', 'Vansh Baranwal', 'Natania Martin', 'Rohan Ittigi',
  'Raashi A', 'Jasvanti M', 'Harshith Kumar', 'Disha K',
  'Archit Kumar', 'Jayakeerthy N J', 'Ansu Kumar', 'Bhuvan Shivaprasad',
  'Aadya Bajpai', 'Krish Jain', 'Jiya Jain', 'Parikshith S',
  'Abhyuday Kaushik', 'Dhyeya Talupula', 'Srilakshmi', 'Kushadhi J Yadav',
  'Namratha R B', 'Bhuvan Tej Reddy Seethi', 'Ujwal Jawalgi', 'Gaurav S'
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

function Header({ go, isFileOpen = false, onBackHome }) {
  return (
    <header className={'the-header' + (isFileOpen ? ' is-file-header' : '')}>
      {isFileOpen && <nav className="file-nav" aria-label="File navigation">
        <button className="file-nav__back" type="button" onClick={onBackHome}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8.25 4.5 2.75 10l5.5 5.5M3.25 10h14" /></svg>
          <span>Back to home</span>
        </button>
      </nav>}
    </header>
  )
}

function Footer() {
  return (
    <footer className="folder-footer">
      <img className="scale" src="/footer/scale.svg" alt="Architectural scale" />
      <span className="footer-year">© 2026</span>
    </footer>
  )
}

function PitchGuide() {
  useEffect(() => {
    setPageMetadata(
      'How to Prepare a VentureX Startup Pitch Video | Student Guide',
      'Prepare your VentureX startup pitch and video demonstration. Learn the confirmed team rules and what to present before the online preliminary round.'
    )
  }, [])

  return <main className="pitch-guide">
    <div className="pitch-guide__inner">
      <a className="pitch-guide__back" href="/">← VentureX home</a>
      <h1>Prepare your VentureX pitch</h1>
      <p className="pitch-guide__lead">The first round is online: student teams submit a startup pitch and video demonstration for investor evaluation. The round is free to enter.</p>
      <section>
        <h2>Build a clear case for your venture</h2>
        <p>Explain the problem your startup addresses, what your product or idea does, and why it matters. Show the venture’s value, business model, and market potential in terms your audience can understand.</p>
        <p>Use the video demonstration to show the innovation in action where possible. Keep claims accurate and make the team’s vision clear.</p>
      </section>
      <section>
        <h2>Check your team</h2>
        <p>Teams must have 3–4 students enrolled in accredited higher education institutions across India. Cross-college and interdepartmental teams are permitted. VentureX welcomes ideas from any industry.</p>
      </section>
      <section>
        <h2>Know what happens next</h2>
        <p>The 30 most promising teams from the online round advance to the live investor pitching round at BMS Institute of Technology &amp; Management in Yelahanka, Bengaluru, on 30 December 2026.</p>
      </section>
      <section>
        <h2>Submission details</h2>
        <p>The official registration link, deadline, video length, file format, submission method, and judging criteria are TBA. Check the <a href="/cases/frequently-asked-questions">VentureX FAQs</a> for confirmed eligibility and fee information.</p>
      </section>
    </div>
  </main>
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

function Home({
  go,
  isEntering,
  isEnteringFromAbout,
  closedGroupIndex,
  closedPageIndex,
  onEnteringComplete,
  onSelectCase,
  onSaveRects,
  isLeavingForAbout,
  onHomeLeftForAbout
}) {
  const [hovered, setHovered] = useState(() => (isEntering && closedGroupIndex !== null && closedGroupIndex !== undefined)
    ? { group: closedGroupIndex, page: closedPageIndex ?? 0 }
    : null)
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
    setPageMetadata(
      'VentureX | Student Startup Pitching & Investor Connect, Bengaluru',
      'VentureX by E-Cell, BMSIT&M welcomes student startup teams across India. The free online preliminary round leads to an investor pitching finale in Bengaluru on 30 December 2026.'
    )
  }, [])

  // Cache folder positions for pixel-perfect Flip returning
  useLayoutEffect(() => {
    const folders = Array.from(document.querySelectorAll('.archive .folder'))
    if (folders.length > 0 && onSaveRects) {
      onSaveRects(folders.map(f => f.getBoundingClientRect()))
    }
  }, [onSaveRects])

  // Mosby eat: Enter Home from About transition
  useLayoutEffect(() => {
    if (!isEnteringFromAbout) return
    isTransitioningRef.current = true
    window.scrollTo({ top: 0, behavior: 'instant' })

    const tl = gsap.timeline({
      defaults: { duration: 0.75, ease: 'power3.out' },
      onComplete: () => {
        isTransitioningRef.current = false
        if (onEnteringComplete) onEnteringComplete()
      }
    })
    tl.fromTo('.hero-title',
      { y: '-50vh', opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', clearProps: 'transform,opacity' },
      0.25
    )
    tl.from('.desk-assets', { y: '-50vh', duration: 0.75, ease: 'power3.out' }, 0.25)
    tl.from('.stack', { yPercent: 60, duration: 0.5, ease: 'power4.inOut' }, 0)
    tl.from('.archive .folder', {
      yPercent: 200,
      scale: 1.75,
      duration: 0.5,
      stagger: 0.015,
      ease: 'power4.inOut',
      clearProps: 'scale,transform'
    }, 0)

    return () => tl.kill()
  }, [isEnteringFromAbout, onEnteringComplete])

  // Mosby mat: Leave Home for About transition
  useLayoutEffect(() => {
    if (!isLeavingForAbout) return
    isTransitioningRef.current = true
    setIsLeaving(true)
    gsap.set('.stack', { transformOrigin: 'top', pointerEvents: 'none' })

    const tl = gsap.timeline({
      defaults: { duration: 0.75, ease: 'power3.inOut' },
      onComplete: () => {
        if (onHomeLeftForAbout) onHomeLeftForAbout()
      }
    })
    tl.to('.hero-title', { y: '-50vh' }, 0)
    tl.to('.desk-assets', { y: '-50vh', duration: 0.75, ease: 'power3.inOut' }, 0)
    tl.to('.stack', { yPercent: 60, scale: 1.75 }, 0)

    return () => tl.kill()
  }, [isLeavingForAbout, onHomeLeftForAbout])

  // Returning from a file keeps its folder and active page in place while sibling files and folders rise from below
  useLayoutEffect(() => {
    if (isEntering) {
      isTransitioningRef.current = true
      const folders = Array.from(document.querySelectorAll('.archive .folder'))
      const unselected = (closedGroupIndex !== null && closedGroupIndex !== undefined)
        ? folders.filter((_, idx) => idx !== closedGroupIndex)
        : folders

      // Start only the folders around the selected one below the stack and bring them up.
      gsap.set(unselected, { yPercent: 120, visibility: 'visible', transition: 'none' })
      gsap.set('.hero-title', { y: '2rem', opacity: 0 })

      const tl = gsap.timeline({
        defaults: { duration: 0.75, ease: 'power2.out' },
        onComplete: () => {
          gsap.set(unselected, { clearProps: 'transform,visibility,transition' })
          isTransitioningRef.current = false
          if (onEnteringComplete) onEnteringComplete()
        }
      })
      tl.to(unselected,
        { yPercent: 0, duration: 0.85, stagger: 0.07, ease: 'power3.out' },
        0
      )
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
      <DeskAssets isEntering={isEntering || isEnteringFromAbout} isLeaving={isLeaving || isLeavingForAbout} />
      <section className="intro" id="hero">
        <h1 className="hero-title">VENTURE X</h1>
        <div className="intro-event" aria-label="VentureX event overview">
          <p className="intro-event__lead">Student startup pitching meets investor connection.</p>
          <p>By E-Cell, BMSIT&amp;M. Open to student teams across India, with 3–4 members per team.</p>
          <p>The online video submission round is free. The top 30 teams advance to an in-person investor pitching finale in Bengaluru on 30 December 2026.</p>
          <p className="intro-event__registration">Registration details will be published here when confirmed.</p>
          <a className="intro-event__guide" href="/guide/pitch-video">How to prepare your pitch →</a>
        </div>
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
                  (later && unfolded ? ' is-unfolded' : '') +
                  (isEntering && i !== closedGroupIndex ? ' is-entering-hidden' : '')
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

function TeamEvidenceBoard({ images }) {
  return (
    <section className="team-evidence" aria-label="VentureX team photo archive">
      <div className="team-evidence__board">
        <aside className="team-evidence__note" aria-hidden="true">
          <span>FIELD NOTES / 01-28</span>
          <strong>THE<br />VENTUREX TEAM</strong>
          <small>One crew. One big idea.</small>
        </aside>
                <svg className="team-evidence__loupe" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="team-loupe-handle" x1="112" y1="112" x2="181" y2="181" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4f382d" />
              <stop offset=".42" stopColor="#a77b59" />
              <stop offset=".72" stopColor="#76503a" />
              <stop offset="1" stopColor="#493126" />
            </linearGradient>
            <radialGradient id="team-loupe-glass" cx="0" cy="0" r="1" gradientTransform="matrix(68 66 -66 68 42 38)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#d7e8dc" stopOpacity=".72" />
              <stop offset="1" stopColor="#5c8e79" stopOpacity=".28" />
            </radialGradient>
            <filter id="team-loupe-shadow" x="-15%" y="-15%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dy="4" />
              <feComponentTransfer><feFuncA slope=".32" type="linear" /></feComponentTransfer>
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g filter="url(#team-loupe-shadow)">
            <path d="m111 111 72 72" stroke="#4b3429" strokeWidth="25" strokeLinecap="round" />
            <path d="m112 110 70 70" stroke="url(#team-loupe-handle)" strokeWidth="19" strokeLinecap="round" />
            <path d="m116 112 61 61" stroke="#d1a27a" strokeOpacity=".65" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="70" cy="70" r="62" fill="url(#team-loupe-glass)" stroke="#e1e3d2" strokeWidth="13" />
            <circle cx="70" cy="70" r="50" fill="none" stroke="#f3f4e8" strokeOpacity=".72" strokeWidth="1.5" />
            <path d="M34 52c10-17 27-27 47-26" fill="none" stroke="#fff" strokeOpacity=".46" strokeWidth="2" strokeLinecap="round" />
            <circle cx="111" cy="111" r="8" fill="#876044" stroke="#ddc6a7" strokeWidth="2" />
          </g>
        </svg>
        <svg className="team-evidence__thread" viewBox="0 0 1000 2400" preserveAspectRatio="none" aria-hidden="true">
          <path d="M54 180 C180 40 212 360 350 258 S515 122 600 315 S812 372 948 190 C1060 424 806 520 670 680 S370 820 132 690 C20 860 230 1030 472 960 S770 1010 923 890 C1035 1120 780 1260 560 1170 S226 1210 76 1370 C10 1520 275 1630 512 1515 S810 1510 940 1710 C1020 1890 740 1960 530 1850 S220 1900 82 2070 C36 2220 300 2320 535 2200 S820 2210 964 2350" />
          <path d="M72 540 C280 650 366 462 514 560 S742 770 920 610 M85 1540 C260 1450 390 1660 580 1550 S780 1440 930 1580" />
        </svg>
        <div className="team-evidence__grid">
          {images.map((src, index) => {
            const frame = String(index + 1).padStart(2, '0')
            return (
              <figure className="team-photo" key={src}>
                <div className="team-photo__image">
                  <div className="team-photo__placeholder">
                    <span>PHOTO / {frame}</span>
                    <small>Drop team-{frame}.jpg here</small>
                  </div>
                  <img
                    src={src}
                    alt={`Team archive photograph ${frame}`}
                    loading="lazy"
                    onError={event => { event.currentTarget.hidden = true }}
                  />
                </div>
                <figcaption>
                  <span className="team-photo__script">{teamPhotoNames[index]}</span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
function ArrivalTicketGuide() {
  const ticketStageRef = useRef(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const ticketStage = ticketStageRef.current
    if (!ticketStage) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches || !('IntersectionObserver' in window)) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsRevealed(true)
        observer.disconnect()
      }
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' })

    observer.observe(ticketStage)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={'arrival-guide' + (isRevealed ? ' is-revealed' : '')} aria-labelledby="arrival-guide-title">
      <div className="arrival-guide__heading">
        <h2 id="arrival-guide-title">Coming from another state?</h2>
        <p>Get into Bengaluru, then take the last leg to BMSIT&M in Avalahalli, Yelahanka.</p>
      </div>

      <div ref={ticketStageRef} className="arrival-ticket-layout">
        <article className="arrival-boarding-pass">
          <div className="arrival-boarding-pass__topline">
            <span>VENTUREX · BOARDING PASS</span>
            <span>BLR / YHK</span>
          </div>
          <div className="arrival-boarding-pass__route">
            <div>
              <span>ARRIVE IN</span>
              <strong>BLR</strong>
              <small>BENGALURU</small>
            </div>
            <span className="arrival-boarding-pass__arrows" aria-hidden="true">···›</span>
            <div>
              <span>FINAL STOP</span>
              <strong>BMSIT</strong>
              <small>AVALAHALLI · YELAHANKA</small>
            </div>
          </div>
          <div className="arrival-boarding-pass__meta">
            <div><span>TRAVEL MODE</span><b>FLIGHT / TRAIN / BUS</b></div>
            <div><span>LAST MILE</span><b>BMTC + WALK / AUTO</b></div>
            <div><span>DESTINATION</span><b>DODDABALLAPUR MAIN RD</b></div>
          </div>
          <div className="arrival-barcode" aria-hidden="true" />
          <p className="arrival-boarding-pass__serial">VX—BMSIT—ARRIVAL—01</p>
        </article>

        <aside className="arrival-receipt">
          <p className="arrival-receipt__eyebrow">YOUR LAST LEG</p>
          <h3>Three ways in</h3>
          <ol>
            <li><b>Flying to BLR</b><span>Take BMTC Vayu Vajra towards Hebbal / Yelahanka, then a local bus or auto to Avalahalli.</span></li>
            <li><b>Arriving by train</b><span>If your train stops at Yelahanka Junction, continue by local bus or auto. From KSR Bengaluru, reach Majestic and take BMTC 285-M towards Avalahalli.</span></li>
            <li><b>Arriving by intercity bus</b><span>From Kempegowda Bus Station (Majestic), board BMTC 285-M towards Avalahalli / Doddaballapura and get off at Avalahalli.</span></li>
          </ol>
          <p className="arrival-receipt__fineprint">Check live routes and fares before you leave; traffic and service frequency vary.</p>
        </aside>

        <div className="arrival-city-ticket">
          <span className="arrival-city-ticket__hole" aria-hidden="true" />
          <div className="arrival-city-ticket__vertical">CITY TRANSFER · BMTC 285-M</div>
          <div className="arrival-city-ticket__main">
            <div className="arrival-city-ticket__print">
              <span>BUS TICKET</span>
              <b>MAJESTIC<br />› AVALAHALLI</b>
              <small>ORDINARY SERVICE · PAY PER RIDE</small>
            </div>
          </div>
          <div className="arrival-city-ticket__stub">YHK—BMSIT</div>
        </div>
      </div>

    </section>
  )
}

function FilePage({
  entry,
  isInitialOpen,
  isEnteringFromAbout,
  transitionGroupIndex,
  targetRect,
  onNavigate,
  onRegisterGoHome,
  onInitialOpenComplete,
  isLeavingForAbout,
  onCaseLeftForAbout,
  onCaseEnterComplete
}) {
  const [activeEntry, setActiveEntry] = useState(entry)
  const [showScrollCue, setShowScrollCue] = useState(false)
  const [scrollCueProgress, setScrollCueProgress] = useState(0)
  const isSwitchingRef = useRef(false)
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
    setPageMetadata(`VentureX ${activeEntry.name} | Student Startup Pitching`, activeEntry.bio?.[0] || 'Explore the VentureX student startup pitching event.')
  }, [activeEntry])

  // At the end of a file, a deliberate extra downward scroll opens the next file.
  useEffect(() => {
    const bottomThreshold = 300
    const maxDeltaPerScroll = 100
    let overscrollAmount = 0
    let touchStartY = null
    let hasNavigated = false
    let navigationTimer = null

    const isAtBottom = () => {
      const scrollRoot = document.scrollingElement || document.documentElement
      return scrollRoot.scrollTop + window.innerHeight >= scrollRoot.scrollHeight - 2
    }
    const reset = () => {
      overscrollAmount = 0
      hasNavigated = false
      if (navigationTimer) {
        window.clearTimeout(navigationTimer)
        navigationTimer = null
      }
      setShowScrollCue(false)
      setScrollCueProgress(0)
    }
    const addDownwardIntent = amount => {
      const atBottom = isAtBottom()
      if (!atBottom) {
        reset()
        return
      }
      if (amount <= 0) {
        if (amount < 0) reset()
        return
      }

      setShowScrollCue(true)
      overscrollAmount = Math.min(bottomThreshold, overscrollAmount + Math.min(amount, maxDeltaPerScroll))
      const progress = overscrollAmount / bottomThreshold
      setScrollCueProgress(progress)
      if (overscrollAmount >= bottomThreshold && !hasNavigated) {
        hasNavigated = true
        navigationTimer = window.setTimeout(() => {
          navigationTimer = null
          handleTabClick(null, nextCase)
        }, 1750)
      }
    }
    const onWheel = event => addDownwardIntent(event.deltaY)
    const onTouchStart = event => {
      touchStartY = event.touches[0]?.clientY ?? null
    }
    const onTouchMove = event => {
      if (touchStartY === null) return
      const nextY = event.touches[0]?.clientY
      if (nextY === undefined) return
      const delta = touchStartY - nextY
      touchStartY = nextY
      addDownwardIntent(delta)
    }
    const onTouchEnd = () => { touchStartY = null }
    const onScroll = () => {
      if (!isAtBottom()) reset()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('scroll', onScroll)
      if (navigationTimer) window.clearTimeout(navigationTimer)
    }
  }, [activeEntry.slug])

  // Mosby aat: Case-to-About leave animation
  useLayoutEffect(() => {
    if (!isLeavingForAbout) return
    const tl = gsap.timeline({
      defaults: { duration: 1, ease: 'power3.inOut' },
      onComplete: () => {
        if (onCaseLeftForAbout) onCaseLeftForAbout()
      }
    })
    tl.to('.case-content', { x: '-100vw' }, 0)
    tl.to('.case-folder-tags', { x: '-10vw', duration: 0.9 }, 0)
    tl.to('.case-hero-title', { x: '-50vw', duration: 0.9 }, 0)
    return () => tl.kill()
  }, [isLeavingForAbout, onCaseLeftForAbout])

  // Mosby _ct: About-to-Case enter animation
  useLayoutEffect(() => {
    if (!isEnteringFromAbout) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    const tl = gsap.timeline({
      defaults: { duration: 1, ease: 'power3.out' },
      onComplete: () => {
        if (onCaseEnterComplete) onCaseEnterComplete()
      }
    })
    tl.from('.case-content', { x: '-100vw', duration: 0.9 }, 0)
    tl.from('.case-hero-title', { x: '-50vw', duration: 0.9 }, 0)
    tl.from('.case-folder-tags', { x: '-10vw', duration: 1 }, 0)
    return () => tl.kill()
  }, [isEnteringFromAbout, onCaseEnterComplete])

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
      '.project, .extra-photos, .case-bottom'
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
      '.project, .extra-photos, .case-bottom'
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
          '.project, .extra-photos, .case-bottom'
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
        const items = document.querySelectorAll(
          '.project, .extra-photos, .case-bottom'
        )
        const folder = folderRef.current

        if (folder) {
          folder.style.setProperty('--turning-front-color', activeEntry.color)
          folder.style.setProperty('--turning-back-color', activeEntry.color)
        }

        window.scrollTo({ top: 0, behavior: 'instant' })

        gsap.set(cover, { visibility: 'visible' })
        if (activeTag) {
          gsap.set(activeTag, { yPercent: 0, opacity: 1 })
        }

        const closeTl = gsap.timeline({
          paused: true,
          onComplete: () => {
            isSwitchingRef.current = false
            if (done) done()
          }
        })
        closeTl.to(items, { y: '50vh', opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
        closeTl.to(chars, { xPercent: -150, opacity: 0, duration: 0.65, stagger: 0.015, ease: 'power2.inOut' }, 0)
        closeTl.fromTo(frontShadow, { opacity: 0 }, { opacity: 1, duration: 0.65, ease: 'power3.inOut' }, 0)
        closeTl.to(frontShadow, { opacity: 0, duration: 0.35, ease: 'power3.inOut' }, 0.65)
        closeTl.to(cover, { rotateY: 0, duration: 1.25, ease: 'power3.inOut' }, 0)

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

          closeTl.add(Flip.from(state, {
            duration: 1.25,
            ease: 'power3.inOut'
          }), 0)
        }
        closeTl.play()
      })
    }
  }, [onRegisterGoHome, targetRect, remaining, safeGroupIndex])

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
      <section className="case-hero">
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
            className={'case-folder' + (activeEntry.slug === 'event-timeline' ? ' has-arrival-guide' : '')}
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
            <div className={"case-folder__inner" + (activeEntry.slug === 'team' ? ' case-folder__inner--team' : '')}>
              <article className="paper dossier" ref={paperRef}>
                <div className="holes" aria-hidden="true">
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <div className="dossier-left">
                  <div className="portrait">
                    <img src={activeEntry.images[0]} alt={'Illustrative image for ' + activeEntry.name} />
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
                <div className={'bio' + (activeEntry.faqs ? ' faq-content' : '') + (activeEntry.timeline ? ' timeline-content' : '')}>
                  {activeEntry.timeline
                    ? <>
                      <p className="timeline-intro">{activeEntry.bio[0]}</p>
                      <ol className="event-timeline">
                        {activeEntry.timeline.map((milestone, i) => (
                          <li key={i}>
                            <time>{milestone.date}</time>
                            <div>
                              <h2>{milestone.title}</h2>
                              <p>{milestone.text}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </>
                    : activeEntry.faqs
                    ? activeEntry.faqs.map(({ question, answer }, i) => (
                      <section className="faq-item" key={i}>
                        <h2><span>Q.</span> {question}</h2>
                        <p><span className="faq-answer-label">A.</span> {answer}</p>
                      </section>
                    ))
                    : activeEntry.bio.map((p, i) => (
                      <p key={i} className={i === 0 ? 'dropcap' : ''}>{p}</p>
                    ))}
                </div>
              </article>

              <div className={'projects' + (activeEntry.timeline ? ' projects--timeline' : '')}>
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
                            <img src={src} alt={'Illustrative image for ' + note.title + ' ' + (j + 1)} loading="lazy" />
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
                      <img key={src} src={src} alt={'Illustrative image for ' + activeEntry.name + ' ' + (i + 1)} loading="lazy" />
                    ))}
                  </div>
                )}
              </div>
              {activeEntry.slug === 'team' && <TeamEvidenceBoard images={activeEntry.images} />}
              {activeEntry.slug === 'event-timeline' && <ArrivalTicketGuide />}
            </div>
          </div>
        </div>
      </div>

      <div className="case-bottom">
        <p>NEXT PAGE</p>
        <a className="case-bottom-next" href={'/cases/' + nextCase.slug} onClick={e => handleTabClick(e, nextCase)}>
          {nextCase.name} ↗
        </a>
      </div>
    </main>

    {showScrollCue && (
      <div className="case-scroll-cue" aria-hidden="true">
        <span style={{ '--scroll-fill': `${scrollCueProgress * 100}%` }}>
          <span className="case-scroll-cue__label">Keep scrolling<br />for the next page</span>
        </span>
      </div>
    )}

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

function AboutGallery({ gallery }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const iterationRef = useRef(1)

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    if (!gallery || gallery.length <= 1) return
    const interval = setInterval(() => {
      if (isAnimatingRef.current) return
      isAnimatingRef.current = true
      iterationRef.current += 1
      const prev = currentIndexRef.current
      const next = (prev + 1) % gallery.length
      setCurrentIndex(next)

      const prevImg = document.querySelector(`.about-gallery__images img:nth-child(${prev + 1})`)
      const nextImg = document.querySelector(`.about-gallery__images img:nth-child(${next + 1})`)

      if (prevImg && nextImg) {
        gsap.fromTo(prevImg, { yPercent: 0 }, { yPercent: -110, duration: 0.6, ease: 'power2.out' })
        gsap.fromTo(nextImg, { yPercent: 110 }, {
          yPercent: 0,
          duration: 0.6,
          ease: 'power2.out',
          onStart: () => {
            gsap.set(nextImg, { zIndex: iterationRef.current, opacity: 1 })
          },
          onComplete: () => {
            isAnimatingRef.current = false
          }
        })
      } else {
        isAnimatingRef.current = false
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [gallery])

  return (
    <div className="about-gallery">
      <div className="about-gallery__inner">
        <div className="about-gallery__images">
          {gallery.map((item, idx) => (
            <img
              key={item.id || idx}
              src={item.src}
              alt={item.alt || ''}
              loading="lazy"
            />
          ))}
        </div>
      </div>
      <div className="about-gallery__captions">
        {gallery.map((item, idx) => (
          <p key={item.id || idx} className={idx === currentIndex ? 'is-active' : ''}>
            {item.caption}
          </p>
        ))}
      </div>
    </div>
  )
}

function About({ onClose, onRegisterClose }) {
  const isLeavingRef = useRef(false)

  useEffect(() => {
    setPageMetadata('About VentureX | E-Cell BMSIT&M', about.intro)
  }, [])

  // Register programmatic close handler (for header clicks)
  useEffect(() => {
    if (onRegisterClose) {
      onRegisterClose(() => handleClose())
    }
  }, [onRegisterClose])

  // Mosby Enter Phase (KE)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const tl = gsap.timeline({
      defaults: { duration: 1, ease: 'power3.out' }
    })
    tl.from('.page-about__inner', { y: '60vh', opacity: 0 }, 0)
    tl.from('.about-gallery', { y: '-60vh' }, 0)
    tl.from('.page-about__close', { y: '60vh', opacity: 0 }, 0)
    tl.from('.about-gallery__inner', { yPercent: 100 }, 0)
    tl.from('.about-gallery__images', { yPercent: -100 }, 0)
    tl.from(['.page-about__title', '.page-about__desc'], { opacity: 0 }, 0.3)

    return () => tl.kill()
  }, [])

  // Mosby Leave Phase (WR)
  const handleClose = () => {
    if (isLeavingRef.current) return
    isLeavingRef.current = true

    const tl = gsap.timeline({
      defaults: { duration: 0.75, ease: 'power3.out' },
      onComplete: () => {
        if (onClose) onClose()
      }
    })
    tl.to('.page-about__inner', { y: '60vh', opacity: 0 }, 0)
    tl.to('.page-about__close', { y: '60vh', opacity: 0 }, 0)
    tl.to('.about-gallery', { y: '-60vh' }, 0)
    tl.to('.about-gallery__inner', { yPercent: 100 }, 0)
    tl.to('.about-gallery__images', { yPercent: -100 }, 0)
    tl.to(['.page-about__title', '.page-about__desc'], { opacity: 0, duration: 0.3 }, 0)
  }

  const galleryItems = about.gallery || [
    { id: 1, src: about.image?.src, alt: about.image?.alt, caption: about.tagline }
  ]

  return (
    <main className="page-about">
      <div className="page-about__inner">
        <div className="page-about__content">
          <div className="page-about__left">
            <h1 className="page-about__title">{about.title}</h1>
            <div className="page-about__gallery">
              <AboutGallery gallery={galleryItems} />
            </div>
          </div>
          <div className="page-about__right">
            <div className="page-about__desc">
              <div className="rich-text">
                <p className="about-tagline">{about.tagline}</p>
                <p>{about.intro}</p>
                {about.sections.map(section => (
                  <section className="about-section" key={section.heading}>
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="page-about__bg" />
      </div>
      <div className="page-about__close">
        <button className="close-button" onClick={handleClose} aria-label="Close About">
          <svg className="close-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </main>
  )
}

export default function App() {
  const [path, go] = useRoute()
  const [pageTransition, setPageTransition] = useState(null)
  const [isHomeEnteringFromAbout, setIsHomeEnteringFromAbout] = useState(false)
  const [isCaseEnteringFromAbout, setIsCaseEnteringFromAbout] = useState(false)
  const [closedGroupIndex, setClosedGroupIndex] = useState(null)
  const [closedPageIndex, setClosedPageIndex] = useState(null)
  const [isHomeEntering, setIsHomeEntering] = useState(false)
  const [transition, setTransition] = useState(null)
  const previousRouteRef = useRef('/')
  const filePageGoHomeRef = useRef(null)
  const aboutCloseRef = useRef(null)
  const folderRectsRef = useRef([])

  const entry = cases.find(c => path === '/cases/' + c.slug)
  const currentGroupIndex = entry ? groups.findIndex(g => g.files.some(i => cases[i].slug === entry.slug)) : 0
  const safeCurrentGroupIndex = currentGroupIndex >= 0 ? currentGroupIndex : 0

  // Track previous route so About close returns to the correct place
  useEffect(() => {
    if (path !== '/about') {
      previousRouteRef.current = path
    }
  }, [path])

  const handleGoHome = () => {
    if (path === '/about') {
      if (aboutCloseRef.current) {
        aboutCloseRef.current()
      } else {
        go('/')
      }
      return
    }
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

  const handleAboutClick = () => {
    if (path === '/about') return
    if (pageTransition) return

    if (path === '/') {
      // Home-to-About leave phase
      setPageTransition({ type: 'home-to-about' })
    } else if (entry) {
      // Case-to-About leave phase
      setPageTransition({ type: 'case-to-about', slug: entry.slug })
    } else {
      go('/about')
    }
  }

  const handleHomeLeftForAbout = () => {
    history.pushState({}, '', '/about')
    go('/about', false)
    setPageTransition(null)
  }

  const handleCaseLeftForAbout = () => {
    history.pushState({}, '', '/about')
    go('/about', false)
    setPageTransition(null)
  }

  const handleAboutClose = () => {
    const prev = previousRouteRef.current
    if (prev && prev.startsWith('/cases/')) {
      history.pushState({}, '', prev)
      setIsCaseEnteringFromAbout(true)
      go(prev, false)
    } else {
      history.pushState({}, '', '/')
      setIsHomeEnteringFromAbout(true)
      go('/', false)
    }
  }

  const handleEnteringComplete = () => {
    setIsHomeEntering(false)
    setIsHomeEnteringFromAbout(false)
    setClosedGroupIndex(null)
    setClosedPageIndex(null)
  }

  const handleCaseEnterComplete = () => {
    setIsCaseEnteringFromAbout(false)
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
      <Header
        go={go}
        isFileOpen={Boolean(entry || transition?.type === 'home-to-case' || transition?.type === 'case-to-home')}
        onBackHome={handleGoHome}
      />
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
      ) : path === '/about' ? (
        <About
          onClose={handleAboutClose}
          onRegisterClose={fn => { aboutCloseRef.current = fn }}
        />
      ) : path === '/guide/pitch-video' ? (
        <PitchGuide />
      ) : entry ? (
        <FilePage
          key={`group-${safeCurrentGroupIndex}`}
          entry={entry}
          isInitialOpen={false}
          isEnteringFromAbout={isCaseEnteringFromAbout}
          isLeavingForAbout={pageTransition?.type === 'case-to-about'}
          targetRect={folderRectsRef.current[safeCurrentGroupIndex]}
          onNavigate={nextPath => go(nextPath, false)}
          onRegisterGoHome={fn => { filePageGoHomeRef.current = fn }}
          onCaseLeftForAbout={handleCaseLeftForAbout}
          onCaseEnterComplete={handleCaseEnterComplete}
        />
      ) : path === '/' ? (
        <Home
          go={go}
          isEntering={isHomeEntering}
          isEnteringFromAbout={isHomeEnteringFromAbout}
          isLeavingForAbout={pageTransition?.type === 'home-to-about'}
          closedGroupIndex={closedGroupIndex}
          closedPageIndex={closedPageIndex}
          onEnteringComplete={handleEnteringComplete}
          onHomeLeftForAbout={handleHomeLeftForAbout}
          onSelectCase={handleSelectCase}
          onSaveRects={handleSaveFolderRects}
        />
      ) : (
        <main className="route-not-found">
          <h1>Page not found</h1>
          <p>This file is not in the VentureX archive.</p>
          <a href="/" onClick={e => { e.preventDefault(); go('/') }}>Back to VentureX</a>
        </main>
      )}
    </div>
  )
}

