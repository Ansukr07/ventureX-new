import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import cases from './cases.json'
import about from './about.json'
import { DeskAssets } from './DeskAssets'
import IdCard from './IdCard'
import CaseArchive from './CaseArchive'
import GreenMat from './GreenMat'
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
  { color: '#699ad1', label: 'Event Overview', description: 'The essential VentureX details and guidance for founders preparing to pitch.', files: [0, 5] },
  { color: '#ec2127', label: 'Timeline & Phases', description: 'Follow the journey from online video submissions, through the Top 30 shortlist, to the live investor pitching round.', files: [1] },
  { color: '#f5cf51', label: 'Participant Guide', description: 'Find eligibility, team, and fee information for teams considering VentureX.', files: [2, 3] },
  { color: '#803f98', label: 'Why Participate', description: 'Put your idea in front of investors, learn from industry perspectives, and build connections that can move your venture forward.', files: [4, 6] }
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

    // Exact Dct Home leave animation (0.6s desktop / 0.38s mobile)
    const isMobile = window.innerWidth <= 768
    const tl = gsap.timeline({
      defaults: { duration: isMobile ? 0.38 : 0.6, ease: 'power2.out' },
      onComplete: () => {
        if (onSelectCase) {
          onSelectCase(groupIndex, pageIndex, item, targetRect)
        } else {
          go('/cases/' + item.slug)
        }
      }
    })

    tl.to('.hero-title', { y: '2rem', opacity: 0, duration: isMobile ? 0.25 : 0.45 }, 0.05)
    tl.to(unselected, { yPercent: 120, duration: isMobile ? 0.38 : 0.6, stagger: isMobile ? 0.04 : 0.08, ease: 'power2.in' }, 0)
    if (inactivePeerTabs.length > 0) {
      tl.to(inactivePeerTabs, { yPercent: 110, duration: isMobile ? 0.25 : 0.4, ease: 'power2.in' }, 0)
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
          <p>By E-Cell, BMSIT&amp;M. Open to student teams across India (3–4 members). Free online round — the top 30 teams pitch live in Bengaluru on 30 December 2026.</p>
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

const teamDomains = [
  { name: 'Coordinators', members: [
    { name: 'Vaibhav Balakundi', role: 'President', img: '/team/team-09.webp' },
    { name: 'Milan Sampath', role: 'Mentor', img: '/team/team-05.webp' },
    { name: 'P Deepthi Jain', role: 'Vice President', img: '/team/team-19.webp' },
    { name: 'Gagan H S', role: 'Vice President', img: '/team/team-31.webp' }
  ] },
  { name: 'Tech Domain', members: [
    { name: 'Ansu Kumar', role: 'Tech Head', img: '/team/team-14.webp' },
    { name: 'Krish Jain', role: 'Tech Vice Head', img: '/team/team-17.webp' },
    { name: 'Archit Kumar', role: 'Tech Associate', img: '/team/team-12.webp' },
    { name: 'Vansh Baranwal', role: 'Tech Associate', img: '/team/team-03.webp' }
  ] },
  { name: 'Design Domain', members: [
    { name: 'Jasvanti M', role: 'Design Head', img: '/team/team-08.webp' },
    { name: 'Raashi A', role: 'Vice Design Head', img: '/team/team-07.webp' },
    { name: 'Gaurav S', role: 'Design Associate', img: '/team/team-28.webp' },
    { name: 'Disha Kanmuse', role: 'Design Associate', img: '/team/team-11.webp' },
    { name: 'Yeshwin J', role: 'Design Associate', img: '/team/team-01.webp' }
  ] },
  { name: 'Marketing', members: [
    { name: 'Manal Gupta', role: 'Marketing Head', img: '/team/team-32.webp' },
    { name: 'Ujwal Jawalgi', role: 'Marketing Vice Head', img: '/team/team-27.webp' },
    { name: 'Srilakshmi', role: 'Marketing Associate', img: '/team/team-23.webp' },
    { name: 'Poojit Sriram', role: 'Marketing Associate', img: '/team/team-33.webp' },
    { name: 'Namratha R Bagade', role: 'Marketing Associate', img: '/team/team-25.webp' },
    { name: 'Abhyuday Kaushik', role: 'Marketing Associate', img: '/team/team-21.webp' },
    { name: 'Natania Martin', role: 'Marketing Associate', img: '/team/team-04.webp' },
    { name: 'Rohan Ittigi', role: 'Marketing Associate', img: '/team/team-06.webp' }
  ] },
  { name: 'Events & operations', members: [
    { name: 'Dhyeya Talupula', role: 'Event/Ops Head', img: '/team/team-22.webp' },
    { name: 'Mohammed Talha', role: 'Event/Ops Vice Head', img: '/team/team-29.webp' },
    { name: 'Rishav Kumar Singh', role: 'Event/Ops Associate', img: '/team/team-02.webp' },
    { name: 'Aadya Bajpai', role: 'Events/Ops Associate', img: '/team/team-16.webp' },
    { name: 'Bhuvan Shivaprasad', role: 'Events/Ops Associate', img: '/team/team-15.webp' },
    { name: 'Jiya Jain', role: 'Events/Ops Associate', img: '/team/team-18.webp' }
  ] },
  { name: 'Corporate relations', members: [
    { name: 'Arush Singh', role: 'Corporate Relations Head', img: '/team/team-30.webp' },
    { name: 'Harshith Kumar Medathati', role: 'Corporate Relations Associate', img: '/team/team-10.webp' },
    { name: 'Bhuvan Tej Reddy Seethi', role: 'Corporate Relations Associate', img: '/team/team-26.webp' }
  ] },
  { name: 'Content', members: [
    { name: 'Parikshith S', role: 'Content Head', img: '/team/team-20.webp' },
    { name: 'N J Jayakeerthy', role: 'Content Vice Head', img: '/team/team-13.webp' },
    { name: 'Vimarsha V', role: 'Content Associate', img: '/team/team-34.webp' },
    { name: 'Kushadhi J Yadav', role: 'Content Associate', img: '/team/team-24.webp' }
  ] }
]

// Cubic Bézier curve between p1 and p2 with natural catenary gravity droop / lateral bow
function bezierCatenary(p1, p2, options = {}) {
  const { sag = 0, bow = 0, bend = 0 } = options
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const dist = Math.hypot(dx, dy)
  const isHorizontal = Math.abs(dx) >= Math.abs(dy) * 0.75
  const autoSag = sag !== 0 ? sag : isHorizontal ? Math.min(32, Math.max(10, Math.abs(dx) * 0.05)) : Math.min(22, Math.max(6, dist * 0.03))
  const autoBow = bow !== 0 ? bow : (isHorizontal ? 0 : (dx >= 0 ? -1 : 1) * Math.min(28, Math.max(6, dist * 0.05)))
  const cp1x = p1.x + dx * 0.32 + autoBow * 0.4 + bend
  const cp1y = p1.y + dy * 0.22 + autoSag
  const cp2x = p1.x + dx * 0.68 - autoBow * 0.4 + bend
  const cp2y = p1.y + dy * 0.78 + autoSag
  return `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
}

// Two-segment C1-continuous organic cord loop around outer board margin:
// Curves smoothly from p1 to the margin apex with a vertical tangent,
// then continues smoothly from the apex down to p2 with zero sharp cusps or corners.
function bezierLoop(p1, p2, targetApex) {
  const x0 = p1.x
  const y0 = p1.y
  const x1 = p2.x
  const y1 = p2.y
  const yMid = (y0 + y1) / 2
  const dy = y1 - y0
  const dx0 = targetApex - x0
  const dx1 = targetApex - x1

  // Segment 1: from p1 to apex (targetApex, yMid)
  // cp1 leaves p1 curving organically outward; cp2 enters apex purely vertical
  const cp1 = { x: x0 + dx0 * 0.52, y: y0 + dy * 0.12 }
  const cp2 = { x: targetApex, y: yMid - dy * 0.22 }

  // Segment 2: from apex (targetApex, yMid) to p2
  // cp3 leaves apex purely vertical (matching cp2 tangent); cp4 enters p2 organically
  const cp3 = { x: targetApex, y: yMid + dy * 0.22 }
  const cp4 = { x: x1 + dx1 * 0.52, y: y1 - dy * 0.12 }

  return `C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)}, ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)}, ${targetApex.toFixed(1)} ${yMid.toFixed(1)} ` +
         `C ${cp3.x.toFixed(1)} ${cp3.y.toFixed(1)}, ${cp4.x.toFixed(1)} ${cp4.y.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`
}

function segmentPath(p1, p2, options = {}) {
  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} ` + bezierCatenary(p1, p2, options)
}

// Organic investigative red-thread web connecting the evidence corkboard:
// Multi-strand, catenary-drooping curves weaving through domain headings,
// photo clusters, pushpins, and the central briefing note.
function TeamThread() {
  const anchorRef = useRef(null)
  const [geometry, setGeometry] = useState(null)

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const board = anchor.parentElement
    const measure = () => {
      const heads = Array.from(board.querySelectorAll('.team-domain__head'))
      if (heads.length === 0) {
        setGeometry(null)
        return
      }
      const domains = Array.from(board.querySelectorAll('.team-domain'))
      const domainData = heads.map((head, idx) => {
        const domain = domains[idx] || head.closest('.team-domain') || head.offsetParent
        let domainTop = 0
        let curr = domain
        while (curr && curr !== board) {
          domainTop += curr.offsetTop
          curr = curr.offsetParent
        }
        const headTop = domainTop + head.offsetTop + head.offsetHeight + 14
        const domainHeight = domain ? domain.offsetHeight : 320
        const midY = headTop + Math.max(60, (domainHeight - head.offsetHeight) * 0.48)
        return { headY: headTop, midY }
      })

      let start = null
      const note = board.querySelector('.team-evidence__note')
      if (note) {
        let noteTop = 0
        let noteLeft = 0
        let curr = note
        while (curr && curr !== board) {
          noteTop += curr.offsetTop
          noteLeft += curr.offsetLeft
          curr = curr.offsetParent
        }
        start = { x: noteLeft + 24, y: noteTop + note.offsetHeight - 8 }
      }

      let loupe = null
      const loupeEl = board.querySelector('.team-evidence__loupe')
      if (loupeEl) {
        let loupeTop = 0
        let loupeLeft = 0
        let curr = loupeEl
        while (curr && curr !== board) {
          loupeTop += curr.offsetTop
          loupeLeft += curr.offsetLeft
          curr = curr.offsetParent
        }
        loupe = { x: loupeLeft + loupeEl.offsetWidth * 0.45, y: loupeTop + loupeEl.offsetHeight * 0.45 }
      }

      setGeometry({
        width: anchor.offsetWidth,
        height: anchor.offsetHeight,
        domains: domainData,
        start,
        loupe
      })
    }
    measure()
    window.addEventListener('resize', measure)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => measure())
    const settleTimer = window.setTimeout(measure, 600)
    return () => {
      window.removeEventListener('resize', measure)
      window.clearTimeout(settleTimer)
    }
  }, [])

  let paths = null
  let pins = []

  if (geometry && geometry.domains && geometry.domains.length > 0) {
    const W = geometry.width
    const gutter = Math.max(16, Math.min(32, W * 0.03))
    const L = gutter
    const R = W - gutter
    const d = geometry.domains

    const hY = (i, fallback) => d[i]?.headY ?? fallback

    const notePin = geometry.start || { x: W * 0.14, y: 110 }

    // Domain evidence pushpin hubs
    const p0_M = { x: W * 0.44, y: hY(0, 140) + 10 }

    const p1_M2 = { x: W * 0.72, y: hY(1, 460) + 10 }
    const p1_hub = { x: W * 0.34, y: hY(1, 460) + 10 }

    const p2_hub = { x: W * 0.46, y: hY(2, 780) + 10 }

    const p3_hub2 = { x: W * 0.68, y: hY(3, 1140) + 10 }
    const p3_hub1 = { x: W * 0.28, y: hY(3, 1140) + 10 }

    const e_hub = { x: W * 0.52, y: hY(4, 1560) + 10 }

    const cr_hub = { x: W * 0.38, y: hY(5, 1940) + 10 }

    const co_hub = { x: W * 0.50, y: hY(6, 2260) + 10 }
    const co_end = { x: W * 0.36, y: Math.min(geometry.height - 30, (d[6]?.midY ?? 2400) + 32) }

    // Continuous primary cord weaving smoothly from pin to pin with organic C-loops at the sides (zero sharp corners)
    let primary = `M ${notePin.x.toFixed(1)} ${notePin.y.toFixed(1)}`
    // Note down to Domain 0
    primary += ' ' + bezierCatenary(notePin, p0_M, { sag: 36, bow: -10 })
    // Loop around right margin: Domain 0 (p0_M) -> Tech (p1_M2)
    primary += ' ' + bezierLoop(p0_M, p1_M2, R)
    // Across Tech heading: p1_M2 -> p1_hub (the 3-thread junction pin)
    primary += ' ' + bezierCatenary(p1_M2, p1_hub, { sag: 22 })
    // Loop around left margin: Tech (p1_hub) -> Design (p2_hub)
    primary += ' ' + bezierLoop(p1_hub, p2_hub, L)
    // Loop around right margin: Design (p2_hub) -> Marketing (p3_hub2)
    primary += ' ' + bezierLoop(p2_hub, p3_hub2, R)
    // Across Marketing heading: p3_hub2 -> p3_hub1
    primary += ' ' + bezierCatenary(p3_hub2, p3_hub1, { sag: 22 })
    // Loop around left margin: Marketing (p3_hub1) -> Events & Ops (e_hub)
    primary += ' ' + bezierLoop(p3_hub1, e_hub, L)
    // Loop around right margin: Events & Ops (e_hub) -> Corporate Relations (cr_hub)
    primary += ' ' + bezierLoop(e_hub, cr_hub, R)
    // Loop around left margin: Corporate Relations (cr_hub) -> Content (co_hub)
    primary += ' ' + bezierLoop(cr_hub, co_hub, L)
    // Final tie-off to bottom anchor pin
    primary += ' ' + bezierCatenary(co_hub, co_end, { bow: -26, sag: 28 })

    // Secondary cross-connecting investigation web (anchored at both ends with red pushpins)
    const crossSegments = [
      segmentPath(notePin, p1_hub, { sag: 28, bow: -14 }),
      segmentPath(p0_M, p2_hub, { sag: 26, bow: 12 }),
      segmentPath(p1_hub, p3_hub2, { sag: 30, bow: 16 }),
      segmentPath(p2_hub, e_hub, { sag: 24, bow: -12 }),
      segmentPath(p3_hub1, cr_hub, { sag: 28, bow: 14 }),
      segmentPath(e_hub, co_hub, { sag: 26, bow: -10 }),
      segmentPath(co_hub, co_end, { sag: 18, bow: 8 })
    ]

    // Accent tension links (dashed cord with pushpins anchoring each end)
    const accentSegments = [
      segmentPath(p0_M, p1_hub, { bow: 20, sag: 22 }),
      segmentPath(p1_M2, p3_hub1, { bow: -30, sag: 34 }),
      segmentPath(p2_hub, e_hub, { bow: 26, sag: 30 }),
      segmentPath(p3_hub2, cr_hub, { bow: -24, sag: 28 })
    ]

    paths = {
      primary,
      cross: crossSegments.join(' '),
      accent: accentSegments.join(' ')
    }

    // Only authentic red pushpins at key evidence hubs and junctions;
    // all corners are purely curved loops with no pins or sharp vertices.
    pins = [
      { ...notePin, red: true },
      { ...p0_M, red: true },
      { ...p1_hub, red: true },
      { ...p1_M2, red: true },
      { ...p2_hub, red: true },
      { ...p3_hub1, red: true },
      { ...p3_hub2, red: true },
      { ...e_hub, red: true },
      { ...cr_hub, red: true },
      { ...co_hub, red: true },
      { ...co_end, red: true }
    ]
  }

  return (
    <>
      <span ref={anchorRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />
      {paths && (
        <svg
          className="team-evidence__thread"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Depth contact shadows */}
          <g className="team-evidence__thread-shadows">
            <path d={paths.primary} className="thread-shadow" />
            <path d={paths.cross} className="thread-shadow" />
            <path d={paths.accent} className="thread-shadow thread-shadow--dashed" />
          </g>

          {/* Crimson evidence yarns */}
          <g className="team-evidence__thread-strands">
            <path d={paths.cross} className="thread-cross" />
            <path d={paths.accent} className="thread-accent" />
            <path d={paths.primary} className="thread-primary" />
          </g>
        </svg>
      )}
      {pins.map((pin, i) => (
        <i
          key={i}
          className={'team-evidence__pin' + (pin.red ? ' team-evidence__pin--red' : '')}
          style={{ left: pin.x.toFixed(1) + 'px', top: pin.y.toFixed(1) + 'px' }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

function TeamEvidenceBoard() {
  return (
    <section className="team-evidence" aria-label="VentureX team photo archive">
      <div className="team-evidence__board">
        <aside className="team-evidence__note" aria-hidden="true">
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
        <TeamThread />
        {teamDomains.map((domain, di) => (
          <section className="team-domain" key={domain.name}>
            <header className="team-domain__head">
              <h3 className="team-domain__name">{domain.name}</h3>
            </header>
            <div className="team-evidence__grid">
              {domain.members.map(member => {
                const initials = member.name.split(' ').map(part => part[0]).join('').slice(0, 2)
                return (
                  <figure className="team-photo" key={member.name}>
                    <div className="team-photo__image">
                      {member.img ? (
                        <img src={member.img} alt={member.name} loading="lazy" />
                      ) : (
                        <div className="team-photo__placeholder">
                          <span>{initials}</span>
                          <small>Photo to be pinned</small>
                        </div>
                      )}
                    </div>
                    <figcaption>
                      <span className="team-photo__script">{member.name}</span>
                      <span className="team-photo__role">{member.role}</span>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
function PixelBarcode({ seed = 19 }) {
  // Deterministic pixel-noise barcode, in the style of the Departure Mono boarding pass.
  let s = seed >>> 0
  const rand = () => {
    s = (s + 0x6D2B79F5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const W = 316
  const H = 46
  const cell = 4
  const cols = Math.floor((W - 40) / cell)
  const rows = Math.floor((H - 2) / cell)
  const rects = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const v = rand()
      const x = 20 + c * cell
      const y = 1 + r * cell
      if (v < 0.42) rects.push(<rect key={`${c}-${r}`} x={x} y={y} width={cell} height={cell} fill="#EEEEEE" />)
      else if (v > 0.88) rects.push(<rect key={`${c}-${r}b`} x={x} y={y} width={cell} height={cell * 2} fill="#EEEEEE" />)
    }
  }
  return (
    <svg className="arrival-boarding-pass__barcode" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <rect x="0" y="1" width="20" height={H - 2} fill="#EEEEEE" />
      {rects}
      <rect x={W - 14} y="1" width="14" height={H - 2} fill="#EEEEEE" />
    </svg>
  )
}

function ArrivalTicketGuide() {
  const ticketStageRef = useRef(null)

  useEffect(() => {
    const ticketStage = ticketStageRef.current
    if (!ticketStage) return

    // Like the Departure Mono reference: hovering the tickets swings the whole
    // cluster from its flat pose into the tilted resting pose, and it eases
    // back flat once the cursor leaves.
    const apply = (pass, receipt, city) => {
      ticketStage.style.setProperty('--pass-settle', pass.toFixed(4))
      ticketStage.style.setProperty('--receipt-settle', receipt.toFixed(4))
      ticketStage.style.setProperty('--city-settle', city.toFixed(4))
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(1, 1, 1)
      return
    }

    let raf = 0
    let target = 0
    const cur = { pass: 0, receipt: 0, city: 0 }
    const tick = () => {
      cur.pass += (target - cur.pass) * 0.06
      cur.receipt += (target - cur.receipt) * 0.06
      cur.city += (target - cur.city) * 0.06
      apply(cur.pass, cur.receipt, cur.city)
      raf = requestAnimationFrame(tick)
    }
    const swingIn = () => { target = 1 }
    const swingOut = event => {
      if (!event.relatedTarget || !event.relatedTarget.closest('.arrival-boarding-pass, .arrival-receipt, .arrival-city-ticket')) {
        target = 0
      }
    }
    const tickets = ticketStage.querySelectorAll('.arrival-boarding-pass, .arrival-receipt, .arrival-city-ticket')
    tickets.forEach(ticket => {
      ticket.addEventListener('pointerenter', swingIn)
      ticket.addEventListener('pointerleave', swingOut)
    })
    raf = requestAnimationFrame(tick)
    return () => {
      tickets.forEach(ticket => {
        ticket.removeEventListener('pointerenter', swingIn)
        ticket.removeEventListener('pointerleave', swingOut)
      })
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="arrival-guide" aria-labelledby="arrival-guide-title">
      <div className="arrival-guide__heading">
        <h2 id="arrival-guide-title">Coming from another state?</h2>
        <p>Get into Bengaluru, then take the last leg to BMSIT&M in Avalahalli, Yelahanka.</p>
      </div>

      <div ref={ticketStageRef} className="arrival-ticket-layout">
        <article className="arrival-boarding-pass">
          <span className="arrival-boarding-pass__fineprint" aria-hidden="true">DO NOT EXPOSE TO EXCESSIVE HEAT OR DIRECT SUNLIGHT</span>
          <div className="arrival-boarding-pass__content">
            <div className="arrival-boarding-pass__topline">
              <div className="arrival-boarding-pass__brand">
                <span className="arrival-boarding-pass__logo" aria-hidden="true" />
                <div>
                  <p className="arrival-boarding-pass__brandname">VENTUREX ·<br />BOARDING PASS</p>
                  <small className="arrival-boarding-pass__routecodes">BLR / YHK</small>
                </div>
              </div>
              <div className="arrival-boarding-pass__passtk">
                <PixelBarcode />
                <span className="arrival-boarding-pass__serial">VX—BMSIT—ARRIVAL—01</span>
              </div>
            </div>
            <div className="arrival-boarding-pass__route">
              <div className="arrival-boarding-pass__leg">
                <span>ARRIVE IN</span>
                <div className="arrival-boarding-pass__legstack">
                  <strong>BLR</strong>
                  <small>BENGALURU</small>
                </div>
              </div>
              <span className="arrival-boarding-pass__arrows" aria-hidden="true">···›</span>
              <div className="arrival-boarding-pass__leg">
                <span>FINAL STOP</span>
                <div className="arrival-boarding-pass__legstack">
                  <strong>BMSIT</strong>
                  <small>AVALAHALLI · YELAHANKA</small>
                </div>
              </div>
            </div>
            <div className="arrival-boarding-pass__meta">
              <div><span>TRAVEL MODE</span><b>FLIGHT / TRAIN / BUS</b></div>
              <div><span>LAST MILE</span><b>BMTC + WALK / AUTO</b></div>
              <div><span>DESTINATION</span><b>DODDABALLAPUR MAIN RD</b></div>
            </div>
            <p className="arrival-boarding-pass__stars" aria-hidden="true">***********************</p>
          </div>
          <div className="arrival-boarding-pass__stub">
            <p className="arrival-boarding-pass__stubbrand">VENTUREX ·<br />BOARDING PASS</p>
            <small className="arrival-boarding-pass__stubcodes">BLR / YHK</small>
            <div className="arrival-boarding-pass__stubrow"><span>ARRIVE IN</span><b>BLR</b></div>
            <div className="arrival-boarding-pass__stubrow"><span>FINAL STOP</span><b>BMSIT</b></div>
            <div className="arrival-boarding-pass__stubrow"><span>TRAVEL MODE</span><b>FLIGHT / TRAIN / BUS</b></div>
          </div>
        </article>

        <aside className="arrival-receipt" aria-label="Bengaluru arrival route receipt">
          <p className="arrival-receipt__eyebrow">YOUR LAST LEG</p>
          <h3>Three ways in</h3>
          <div className="arrival-receipt__rule" aria-hidden="true" />
          <ol>
            <li><b>Flying to BLR</b><span>Take BMTC Vayu Vajra towards Hebbal / Yelahanka, get down at Yelahanka NES Office Stop, then take a local bus or auto to BMSIT&amp;M, Avalahalli.</span></li>
            <li><b>Arriving by train</b><span>If your train stops at Yelahanka Junction, get down at Yelahanka NES Office Stop, then take a local bus or auto to BMSIT&amp;M, Avalahalli. From KSR Bengaluru, reach Majestic and take BMTC 285-M towards Avalahalli.</span></li>
            <li><b>Arriving by intercity bus</b><span>From Kempegowda Bus Station (Majestic), take BMTC 285-M towards Avalahalli / Doddaballapura, get down at Yelahanka NES Office Stop, and take a bus or auto to BMSIT&amp;M, Avalahalli.</span></li>
          </ol>
          <p className="arrival-receipt__fineprint">Check live routes and fares before you leave, traffic and service frequency may vary.</p>
        </aside>

        <div className="arrival-city-ticket">
          <div className="arrival-city-ticket__tag">
            <span className="arrival-city-ticket__hole" aria-hidden="true" />
            <div className="arrival-city-ticket__cells">
              <div className="arrival-city-ticket__cell">
                <span>CITY TRANSFER ·</span>
                <b>BMTC 285-M</b>
              </div>
              <div className="arrival-city-ticket__cell is-right">
                <span>ORDINARY SERVICE ·</span>
                <b>PAY PER RIDE</b>
              </div>
            </div>
            <div className="arrival-city-ticket__main">
              <span className="arrival-city-ticket__side">BUS TICKET</span>
              <p className="arrival-city-ticket__big">MAJESTIC<br />› AVALAHALLI</p>
            </div>
            <div className="arrival-city-ticket__footer">
              <span className="arrival-city-ticket__dither" aria-hidden="true" />
              <span className="arrival-city-ticket__serial">YHK—BMSIT</span>
            </div>
          </div>
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
  const cancelEasedScrollRef = useRef(null)

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
    let scrollFrame = 0
    let targetScrollY = window.scrollY
    let previousFrameTime = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Stops an eased wheel scroll still settling, so programmatic jumps
    // (closing to home, switching tabs) aren't dragged back by this loop.
    const stopEasedScroll = () => {
      if (scrollFrame) {
        window.cancelAnimationFrame(scrollFrame)
        scrollFrame = 0
      }
      previousFrameTime = 0
      targetScrollY = window.scrollY
    }
    cancelEasedScrollRef.current = stopEasedScroll

    const letNativeWheelHandle = event => {
      if (event.ctrlKey || event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return true
      let element = event.target instanceof Element ? event.target : event.target?.parentElement
      if (!element || element.closest('input, textarea, select, [contenteditable="true"]')) return true
      while (element && element !== document.body) {
        const overflowY = window.getComputedStyle(element).overflowY
        const canScroll = /(auto|scroll|overlay)/.test(overflowY) && element.scrollHeight > element.clientHeight + 1
        if (canScroll) {
          const maxScroll = element.scrollHeight - element.clientHeight
          if ((event.deltaY < 0 && element.scrollTop > 0) || (event.deltaY > 0 && element.scrollTop < maxScroll)) return true
        }
        element = element.parentElement
      }
      return false
    }

    const easeWheelScroll = time => {
      const scrollRoot = document.scrollingElement || document.documentElement
      const maxScroll = Math.max(0, scrollRoot.scrollHeight - window.innerHeight)
      targetScrollY = Math.min(targetScrollY, maxScroll)
      const currentScrollY = window.scrollY
      const distance = targetScrollY - currentScrollY
      if (Math.abs(distance) < 0.7) {
        if (distance) window.scrollTo({ top: targetScrollY, behavior: 'instant' })
        scrollFrame = 0
        previousFrameTime = 0
        return
      }
      const elapsed = previousFrameTime ? Math.min(time - previousFrameTime, 48) : 16.67
      previousFrameTime = time
      const ease = 1 - Math.exp(-elapsed / 220)
      window.scrollTo({ top: currentScrollY + distance * ease, behavior: 'instant' })
      scrollFrame = window.requestAnimationFrame(easeWheelScroll)
    }

    const isAtBottom = () => {
      const scrollRoot = document.scrollingElement || document.documentElement
      const effectiveScrollTop = scrollFrame ? Math.max(scrollRoot.scrollTop, targetScrollY) : scrollRoot.scrollTop
      return effectiveScrollTop + window.innerHeight >= scrollRoot.scrollHeight - 2
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
    const onWheel = event => {
      addDownwardIntent(event.deltaY)
      if (reduceMotion || letNativeWheelHandle(event)) return
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      const scrollRoot = document.scrollingElement || document.documentElement
      const maxScroll = Math.max(0, scrollRoot.scrollHeight - window.innerHeight)
      if (!scrollFrame) targetScrollY = window.scrollY
      targetScrollY = Math.max(0, Math.min(maxScroll, targetScrollY + event.deltaY * unit * 0.72))
      event.preventDefault()
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(easeWheelScroll)
    }
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

    window.addEventListener('wheel', onWheel, { passive: false })
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
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
      cancelEasedScrollRef.current = null
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
    const leavingIdCard = document.querySelector('.case-id-card')
    if (leavingIdCard) tl.to(leavingIdCard, { x: '-100vw' }, 0)
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
    const enteringIdCard = document.querySelector('.case-id-card')
    if (enteringIdCard) tl.from(enteringIdCard, { x: '-100vw' }, 0)
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
      '.project, .extra-photos, .team-evidence, .case-id-card, .case-archive .archive-item'
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
      if (isMobile) folder.classList.add('is-flipping')

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
      // Suppress side tags width & paint during Flip rotation (exact Mosby kct: original-transitions.js)
      gsap.set('.case-folder-tags', { width: 0, opacity: 0 })
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

      const openDuration = isMobile ? 0.85 : 1.5
      const openEase = isMobile ? 'power2.inOut' : 'power3.inOut'

      const tl = gsap.timeline({
        defaults: { duration: openDuration, ease: openEase },
        paused: true
      })

      // 1. 3D Cover flips open: rotateY 0deg -> -180deg over openDuration
      tl.to(cover, {
        rotateY: -180,
        duration: openDuration,
        ease: openEase
      }, 0)

      // 2. Cover shadow peaks and fades
      const shadowPeakTime = isMobile ? 0.16 : 0.25
      const shadowPeakDuration = isMobile ? 0.22 : 0.35
      const shadowFadeTime = isMobile ? 0.38 : 0.6
      const shadowFadeDuration = isMobile ? 0.2 : 0.3

      tl.fromTo(coverShadow, { opacity: 0 }, { opacity: 1, duration: shadowPeakDuration, ease: openEase }, shadowPeakTime)
      tl.to(coverShadow, { opacity: 0, duration: shadowFadeDuration, ease: openEase }, shadowFadeTime)

      // 3. Inner lined notebook page swings into view at 0.35s (rotate: -6deg -> 0deg, y: 55px -> 0px)
      const paperTime = isMobile ? 0.22 : 0.35
      const paperDuration = isMobile ? 0.45 : 0.6
      tl.to(paper, { rotate: 0, y: 0, opacity: 1, duration: paperDuration, ease: 'power3.out' }, paperTime)

      // 4. Header title characters shutter reveal from left at 0.65s (xPercent: -150 -> 0, stagger: 0.025s)
      const charsTime = isMobile ? 0.38 : 0.65
      const charsDuration = isMobile ? 0.42 : 0.65
      const charsStagger = isMobile ? 0.015 : 0.025
      tl.to(chars, { xPercent: 0, opacity: 1, duration: charsDuration, stagger: charsStagger, ease: 'power2.out' }, charsTime)

      // 5. Inactive side tags slide up into place at 0.85s (matches inspo kct: original-transitions.js:68)
      const tagsTime = isMobile ? 0.45 : 0.85
      const tagsDuration = isMobile ? 0.45 : 0.75
      tl.set('.case-folder-tags', { clearProps: 'width,opacity' }, tagsTime)
      if (inactiveTags.length > 0) {
        tl.to(inactiveTags, {
          yPercent: 0,
          opacity: 1,
          duration: tagsDuration,
          ease: 'power3.out',
          clearProps: 'yPercent,opacity'
        }, tagsTime)
      }

      // 6. Scrapbook items rise up at 1.0s (y: 50vh -> 0)
      const itemsTime = isMobile ? 0.55 : 1.0
      const itemsDuration = isMobile ? 0.35 : 0.5
      tl.to(items, { y: 0, opacity: 1, duration: itemsDuration, ease: 'power3.out' }, itemsTime)

      // 7. Morph folder from rotated stack position to upright case view
      Flip.from(state, {
        duration: openDuration,
        ease: openEase,
        onStart: () => {
          tl.play()
        },
        onComplete: () => {
          if (folder) folder.classList.remove('is-flipping')
          if (cover) gsap.set(cover, { visibility: 'hidden' })
          gsap.set('.case-folder-tags', { clearProps: 'all' })
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
      '.project, .extra-photos, .team-evidence, .case-id-card, .case-archive .archive-item'
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
        // Cancel any eased wheel scroll still settling first, otherwise the
        // loop drags the page back down and the Flip starts off-screen.
        if (cancelEasedScrollRef.current) cancelEasedScrollRef.current()
        window.scrollTo({ top: 0, behavior: 'instant' })

        // Target incoming page elements (guaranteed in DOM via flushSync)
        const newChars = document.querySelectorAll('.case-hero-title .case-char')
        const newItems = document.querySelectorAll(
          '.project, .extra-photos, .team-evidence, .case-id-card, .case-archive .archive-item'
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
        const items = document.querySelectorAll(
          '.project, .extra-photos, .team-evidence, .case-id-card, .case-archive .archive-item, .paper.dossier'
        )
        const folder = folderRef.current
        const folderInner = folder?.querySelector('.case-folder__inner')

        const isMobile = window.innerWidth <= 768
        if (folder) folder.classList.add('is-flipping')

        if (folder) {
          folder.style.setProperty('--turning-front-color', activeEntry.color)
          folder.style.setProperty('--turning-back-color', activeEntry.color)
        }

        // Cancel any eased wheel scroll still settling first, otherwise the
        // loop drags the page back to the bottom and the Flip starts from an
        // off-screen position, desyncing the closing rotation from the stack.
        if (cancelEasedScrollRef.current) cancelEasedScrollRef.current()
        window.scrollTo({ top: 0, behavior: 'instant' })

        // 1. Immediately suppress side tags so they don't composite during rotation
        gsap.set('.case-folder-tags', { opacity: 0, width: 0 })

        // 2. Exact Mosby Rct pattern: quickly drop inner scrapbook items first (0.16s mobile / 0.22s desktop),
        // so the folder rotating back into the stack is virtually empty, eliminating mobile GPU fill-rate lag.
        const dropDuration = isMobile ? 0.16 : 0.22
        gsap.to(items, {
          y: '50vh',
          opacity: 0,
          duration: dropDuration,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(cover, { visibility: 'visible' })

            const closeDuration = isMobile ? 0.85 : 1.25
            const closeEase = isMobile ? 'power2.inOut' : 'power3.inOut'

            const closeTl = gsap.timeline({
              paused: true,
              onComplete: () => {
                if (folder) folder.classList.remove('is-flipping')
                isSwitchingRef.current = false
                if (done) done()
              }
            })

            const charsDropDuration = isMobile ? 0.45 : 0.65
            const charsStagger = isMobile ? 0.008 : 0.015
            const shadowDuration1 = isMobile ? 0.45 : 0.65
            const shadowDuration2 = isMobile ? 0.25 : 0.35
            const shadowTime2 = isMobile ? 0.45 : 0.65

            closeTl.to(chars, { xPercent: -150, opacity: 0, duration: charsDropDuration, stagger: charsStagger, ease: 'power2.inOut' }, 0)
            closeTl.fromTo(frontShadow, { opacity: 0 }, { opacity: 1, duration: shadowDuration1, ease: closeEase }, 0)
            closeTl.to(frontShadow, { opacity: 0, duration: shadowDuration2, ease: closeEase }, shadowTime2)
            closeTl.to(cover, {
              rotateY: 0,
              duration: closeDuration,
              ease: closeEase,
              onComplete: () => {
                if (folderInner) gsap.set(folderInner, { backgroundColor: 'transparent' })
              }
            }, 0)

            // 3. Flip folder back to stack geometry
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
              if (contentInnerRef.current) {
                gsap.set(contentInnerRef.current, { height: folder.offsetHeight })
              }
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
                duration: closeDuration,
                ease: closeEase,
                onComplete: () => {
                  if (folder) folder.classList.remove('is-flipping')
                  if (contentInnerRef.current) {
                    gsap.set(contentInnerRef.current, { clearProps: 'height' })
                  }
                }
              }), 0)
            }
            closeTl.play()
          }
        })
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

              {(activeEntry.notes?.length > 0 || (activeEntry.images?.length || 0) > (activeEntry.notes?.length || 0) * 2 + 1) && (
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
              )}
              {activeEntry.slug === 'team' && <TeamEvidenceBoard />}
              {activeEntry.slug === 'event-timeline' && <ArrivalTicketGuide />}
              {/* Pinned archive extras; team and event-timeline carry their own dedicated boards */}
              {activeEntry.slug !== 'team' && activeEntry.slug !== 'event-timeline' && <CaseArchive entry={activeEntry} />}
            </div>
          </div>
        </div>
      </div>
    </main>

    {/* VentureX ID card tucked into the right screen edge, outside the folder.
        Fixed so it stays put while the file page scrolls. */}
    {activeEntry.slug === 'executive-overview' && (
      <aside className="case-id-card" aria-hidden="true">
        <IdCard className="case-id-card__svg" />
      </aside>
    )}

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
    <>
      <GreenMat />
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
    </>
  )
}
