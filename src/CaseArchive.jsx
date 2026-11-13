// Archive extras strip rendered at the bottom of every file page.
// The artifacts are drawn from scratch in JSX SVG (like IdCard) after two
// reference boards: a brutalist typewritten seed-order form with measurement
// strips ("d—ot", HSE Design School) and the Bridge of Spies prop flat-lay by
// Annie Atkins (dossier memo, string tag, airmail envelope, fingerprint card,
// wooden ruler). All pieces share the dossier paper + Departure Mono language
// already used across the site, tinted with each page's --case-color.

// Local copy of the App.jsx paperclip (kept here to avoid an import cycle).
function PaperclipTop({ className = '' }) {
  return (
    <svg className={`paperclip-svg ${className}`} viewBox="0 0 24 107" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2.05513 5.28193C4.21232 2.09502 7.8614 0.000174314 11.9995 3.55316e-05C18.6269 3.55316e-05 23.9995 5.37279 23.9996 12.0001L24.0003 95.0002C24.0003 101.628 18.6275 107 12.0002 107C5.37279 107 0.00010339 101.628 0.00010339 95.0002L0.00010339 42.905H1.99989L1.99989 95.0002C1.99989 100.523 6.47735 105.001 12.0002 105.001C17.5229 105 22.0005 100.523 22.0005 95.0002L21.9998 12.0001C21.9997 6.47745 17.5229 2.00066 12.0002 2.00051C8.34976 2.00051 5.15651 3.95666 3.41065 6.87775L2.05513 5.28193Z" fill="currentColor" />
    </svg>
  )
}

const INK = '#1d1b1a'
const PAPER = '#fffcf9'
const MANILA = '#d8b489'
const WOOD = '#d3ab77'
const DARK = '#221e1a'
const MONO = "'Departure Mono', 'IBM Plex Mono', 'Courier New', monospace"

// Shared paper texture + airmail stripe pattern defs
function PaperDefs({ id }) {
  return (
    <defs>
      <pattern id={id + '-dots'} width="5" height="5" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.55" fill="#d0ccc7" opacity="0.4" />
      </pattern>
      <pattern id={id + '-par'} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="11" height="22" fill="#b23a2e" />
        <rect x="11" width="11" height="22" fill="#274472" />
      </pattern>
    </defs>
  )
}

function Paper({ id, w, h, children }) {
  return (
    <>
      <defs>
        <clipPath id={id + '-clip'}>
          <rect width={w} height={h} rx="3" />
        </clipPath>
      </defs>
      <rect width={w} height={h} rx="3" fill={PAPER} />
      <rect width={w} height={h} fill={`url(#${id}-dots)`} />
      <g clipPath={`url(#${id}-clip)`}>{children}</g>
      <rect width={w} height={h} rx="3" fill="none" stroke="rgba(29,27,26,.22)" />
    </>
  )
}

// Typewritten order form (d—ot reference): ruled fields, checkbox grid,
// numbered code and a case-color accent block, closed with the fine print.
function FormSheet({ title, code, accent }) {
  const rows = ['TEAM NAME', 'INSTITUTE', 'MEMBERS', 'CONTACT']
  const checks = [
    { label: 'TECH', on: true },
    { label: 'PRODUCT', on: false },
    { label: 'SOCIAL', on: true },
    { label: 'OTHER', on: false }
  ]
  return (
    <svg viewBox="0 0 300 396" aria-hidden="true" focusable="false">
      <PaperDefs id="arform" />
      <Paper id="arform" w={300} h={396}>
        <text x="272" y="30" textAnchor="end" fontFamily={MONO} fontSize="9" fill={INK} textDecoration="underline">№ {code}</text>
        <text x="24" y="46" fontFamily={MONO} fontSize="10" fill={INK}>1. VX·ENTRIES:</text>
        <text x="24" y="62" fontFamily={MONO} fontSize="14" fontWeight="700" letterSpacing="1.5" fill={INK}>{title}</text>
        <line x1="24" y1="70" x2="216" y2="70" stroke={INK} strokeWidth="1" />
        {/* case-color accent block, echoing the d→ot swatch card */}
        <g className="arc-form-accent">
          <rect x="236" y="84" width="40" height="104" fill={accent} />
          <rect x="236" y="84" width="40" height="44" fill="rgba(0,0,0,.28)" />
          <text x="256" y="112" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill="#fff">VX</text>
          <text x="256" y="170" textAnchor="middle" fontFamily={MONO} fontSize="8" fill="#fff" opacity=".85">©2026</text>
        </g>
        <text x="24" y="92" fontFamily={MONO} fontSize="7.5" fill={INK} opacity=".78">
          <tspan x="24" dy="0">THIS SLIP CONFIRMS YOUR ENTRY</tspan>
          <tspan x="24" dy="10">TO THE VENTUREX PITCHING</tspan>
          <tspan x="24" dy="10">ROUNDS. FILL IN EVERY FIELD</tspan>
          <tspan x="24" dy="10">BEFORE YOUR FILE IS FILED.</tspan>
        </text>
        {rows.map((row, i) => (
          <g key={row} transform={`translate(24 ${124 + i * 34})`}>
            <text x="0" y="10" fontFamily={MONO} fontSize="9" fill={INK}>{row} :</text>
            <line x1="92" y1="11" x2="200" y2="11" stroke="rgba(29,27,26,.5)" strokeWidth="0.8" strokeDasharray="3 3" />
          </g>
        ))}
        <text x="24" y="268" fontFamily={MONO} fontSize="8" fill={INK} opacity=".78">IDEA CATEGORY — TICK ONE</text>
        {checks.map((check, i) => (
          <g key={check.label} transform={`translate(${24 + (i % 2) * 112} ${280 + Math.floor(i / 2) * 26})`}>
            <rect width="10" height="10" fill="none" stroke={INK} strokeWidth="1" />
            {check.on && <path d="M2.5 5.5 L4.8 8 L8 2.6" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />}
            <text x="16" y="9" fontFamily={MONO} fontSize="8" fill={INK}>{check.label}</text>
          </g>
        ))}
        <text x="24" y="352" fontFamily={MONO} fontSize="7" fill={INK} opacity=".7">
          <tspan x="24" dy="0">* FILED DOSSIERS ARE NOT RETURNED.</tspan>
          <tspan x="24" dy="10">QUESTIONS GO TO THE VENTUREX DESK,</tspan>
          <tspan x="24" dy="10">E-CELL · BMSIT&M · 30 DEC 2026.</tspan>
        </text>
        <rect x="0" y="388" width="300" height="8" fill={accent} opacity=".85" />
      </Paper>
    </svg>
  )
}

// Interoffice memo with a rotated rubber stamp (Bridge of Spies dossier sheet).
function StampMemo({ stamp, to, from, re, accent }) {
  return (
    <svg viewBox="0 0 320 252" aria-hidden="true" focusable="false">
      <PaperDefs id="armemo" />
      <Paper id="armemo" w={320} h={252}>
        <text x="160" y="30" textAnchor="middle" fontFamily={MONO} fontSize="11" fontWeight="700" letterSpacing="2.5" fill={INK}>INTEROFFICE MEMO</text>
        <line x1="24" y1="40" x2="296" y2="40" stroke={INK} strokeWidth="1.2" />
        <line x1="24" y1="43" x2="296" y2="43" stroke={INK} strokeWidth="0.5" />
        {[['TO', to], ['FROM', from], ['RE', re]].map(([label, value], i) => (
          <g key={label} transform={`translate(24 ${56 + i * 18})`}>
            <text x="0" y="9" fontFamily={MONO} fontSize="8.5" fontWeight="700" fill={INK}>{label}:</text>
            <text x="38" y="9" fontFamily={MONO} fontSize="8.5" fill={INK} opacity=".85">{value}</text>
            <line x1="38" y1="12" x2="296" y2="12" stroke="rgba(29,27,26,.35)" strokeWidth="0.7" strokeDasharray="2.5 2.5" />
          </g>
        ))}
        <text x="24" y="126" fontFamily={MONO} fontSize="7.5" fill={INK} opacity=".78">
          <tspan x="24" dy="0">REVIEWED AGAINST THE VENTUREX RULES.</tspan>
          <tspan x="24" dy="11">NO OBJECTIONS ON RECORD. THIS SHEET</tspan>
          <tspan x="24" dy="11">STAYS WITH THE FILE PERMANENTLY.</tspan>
        </text>
        {/* rubber stamp, re-inks on hover (inner g so CSS keeps the positioning) */}
        <g transform="translate(216 158) rotate(-11)">
          <g className="arc-stamp-ink">
            <rect x="-72" y="-20" width="144" height="40" fill="none" stroke={accent} strokeWidth="2.5" rx="4" />
            <rect x="-66" y="-14" width="132" height="28" fill="none" stroke={accent} strokeWidth="1" rx="2" />
            <text x="0" y="4.5" textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" letterSpacing="2" fill={accent}>{stamp}</text>
          </g>
        </g>
        <path d="M32 214 c 12 -12 22 6 34 -6 c 10 -10 20 4 32 -4" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
        <line x1="24" y1="226" x2="120" y2="226" stroke={INK} strokeWidth="1" />
        <text x="24" y="238" fontFamily={MONO} fontSize="7" fill={INK} opacity=".7">AUTHORISED SIGNATORY</text>
      </Paper>
    </svg>
  )
}

// Dark specimen strip with measurement arrows (d—ot reference strips).
function SpecimenStrip({ accent }) {
  const marks = [
    { label: '25 CM', y: 62 },
    { label: '20 CM', y: 138 },
    { label: '15 CM', y: 214 },
    { label: '10 CM', y: 290 },
    { label: '5 CM', y: 366 }
  ]
  return (
    <svg viewBox="0 0 150 430" aria-hidden="true" focusable="false">
      <rect width="150" height="430" rx="3" fill={DARK} />
      <rect x="8" y="8" width="134" height="30" fill={accent} />
      <text x="75" y="27" textAnchor="middle" fontFamily={MONO} fontSize="11" fontWeight="700" fill="#fff">VX·SPEC</text>
      {marks.map(({ label, y }) => (
        <g key={label} transform={`translate(75 ${y})`}>
          <g className="arc-measure">
            <line x1="-58" y1="0" x2="58" y2="0" stroke="#f2efe9" strokeWidth="1.6" />
            <path d="M-58 0 l8 -4 v8 z M58 0 l-8 -4 v8 z" fill="#f2efe9" />
            <rect x="-26" y="-10" width="52" height="20" fill={DARK} stroke="#f2efe9" strokeWidth="1" />
            <text x="0" y="4" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fill="#f2efe9">{label}</text>
          </g>
        </g>
      ))}
      <text x="75" y="416" textAnchor="middle" fontFamily={MONO} fontSize="7" fill="#f2efe9" opacity=".6">DO NOT TRIM — KEEP FULL WIDTH</text>
    </svg>
  )
}

// Manila luggage tag on a string (Bridge of Spies reference).
function TagCard({ exhibit, name, code }) {
  return (
    <svg viewBox="0 0 260 200" aria-hidden="true" focusable="false">
      <g className="arc-tag-swing">
        <path d="M20 -6 C 20 40 26 52 46 62" fill="none" stroke="#8a6b4a" strokeWidth="2" />
        <circle cx="46" cy="62" r="4.5" fill="none" stroke="#8a6b4a" strokeWidth="2" />
        <g transform="rotate(3 46 62)">
          <path d="M46 50 h196 a6 6 0 0 1 6 6 v128 a6 6 0 0 1 -6 6 h-196 a6 6 0 0 1 -6 -6 v-44 l-14 -20 l14 -20 v-38 a6 6 0 0 1 6 -6 z" fill={MANILA} />
          <path d="M46 50 h196 a6 6 0 0 1 6 6 v128 a6 6 0 0 1 -6 6 h-196 a6 6 0 0 1 -6 -6 v-44 l-14 -20 l14 -20 v-38 a6 6 0 0 1 6 -6 z" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="1" />
          <line x1="52" y1="60" x2="236" y2="60" stroke="rgba(0,0,0,.16)" strokeWidth="0.8" />
          <circle cx="52" cy="62" r="7" fill={PAPER} stroke="rgba(0,0,0,.35)" strokeWidth="1.5" />
          <text x="86" y="92" fontFamily={MONO} fontSize="9" fill="#4a3a26" opacity=".85">VENTUREX FILE</text>
          <text x="86" y="116" fontFamily={MONO} fontSize="20" fontWeight="700" letterSpacing="1" fill="#2e2416">{exhibit}</text>
          <text x="86" y="138" fontFamily={MONO} fontSize="10" fill="#4a3a26">{name.toUpperCase()}</text>
          <line x1="86" y1="150" x2="228" y2="150" stroke="rgba(0,0,0,.3)" strokeWidth="0.8" strokeDasharray="3 3" />
          <text x="86" y="166" fontFamily={MONO} fontSize="8" fill="#4a3a26" opacity=".8">{code} · HANDLE WITH CARE</text>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => (
            <rect key={i} x={168 + i * 4.2} y="86" width={i % 3 === 0 ? 2.8 : 1.4} height="16" fill="#2e2416" opacity=".8" />
          ))}
        </g>
      </g>
    </svg>
  )
}

// Airmail envelope (Bridge of Spies reference): striped border, stamps and a
// postmark that stamps itself in on hover.
function AirmailEnvelope({ accent, lines }) {
  return (
    <svg viewBox="0 0 340 220" aria-hidden="true" focusable="false">
      <PaperDefs id="arair" />
      <rect width="340" height="220" rx="3" fill="url(#arair-par)" />
      <rect x="10" y="10" width="320" height="200" fill={PAPER} />
      <rect x="10" y="10" width="320" height="200" fill="none" stroke="rgba(29,27,26,.25)" />
      {/* envelope flap crease */}
      <path d="M10 10 L170 108 L330 10" fill="none" stroke="rgba(29,27,26,.14)" strokeWidth="1" />
      {lines.map((line, i) => (
        <text key={i} x="34" y={96 + i * 16} fontFamily={MONO} fontSize={i === 0 ? 8 : 10} fill={INK} opacity={i === 0 ? 0.7 : 0.92}>{line}</text>
      ))}
      {/* two stamps */}
      <g transform="translate(236 30)">
        <rect width="56" height="66" fill={accent} stroke={PAPER} strokeWidth="2.5" strokeDasharray="3 3" />
        <text x="28" y="26" textAnchor="middle" fontFamily={MONO} fontSize="14" fontWeight="700" fill="#fff">VX</text>
        <text x="28" y="42" textAnchor="middle" fontFamily={MONO} fontSize="7.5" fill="#fff">30 DEC 26</text>
        <text x="28" y="56" textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill="#fff" opacity=".85">E-CELL BMSIT&M</text>
      </g>
      <g transform="translate(296 30)">
        <rect width="24" height="66" fill={PAPER} stroke={INK} strokeWidth="1.2" strokeDasharray="2.5 2.5" />
        <text x="12" y="38" textAnchor="middle" fontFamily={MONO} fontSize="8" fill={INK} transform="rotate(90 12 38)">VX·26</text>
      </g>
      {/* postmark stamps itself in on hover (inner g keeps the positioning) */}
      <g transform="translate(212 64)">
        <g className="arc-postmark">
          <circle r="34" fill="none" stroke="#4a4a48" strokeWidth="1.6" strokeDasharray="6 3" opacity=".8" />
          <circle r="27" fill="none" stroke="#4a4a48" strokeWidth="1" opacity=".8" />
          <text y="-6" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill="#4a4a48">BLR · YHK</text>
          <text y="7" textAnchor="middle" fontFamily={MONO} fontSize="8" fill="#4a4a48">30 DEC 26</text>
          <text y="19" textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill="#4a4a48">RECEIVED</text>
        </g>
      </g>
      <text x="34" y="196" fontFamily={MONO} fontSize="7" fill={INK} opacity=".6">IF UNDELIVERED, RETURN TO THE VENTUREX DESK</text>
    </svg>
  )
}

// Ink fingerprint record card (Bridge of Spies reference). Prints develop on hover.
function FingerprintCard({ accent, caption }) {
  const prints = [
    { x: 44, y: 108, r: -8 }, { x: 120, y: 104, r: 6 }, { x: 196, y: 110, r: -4 },
    { x: 52, y: 186, r: 10 }, { x: 128, y: 182, r: -6 }, { x: 200, y: 188, r: 5 }
  ]
  return (
    <svg viewBox="0 0 250 312" aria-hidden="true" focusable="false">
      <PaperDefs id="arfp" />
      <Paper id="arfp" w={250} h={312}>
        <rect x="0" y="0" width="250" height="26" fill={accent} />
        <text x="125" y="17.5" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill="#fff">PARTICIPANT RECORD</text>
        <text x="24" y="46" fontFamily={MONO} fontSize="8" fill={INK} opacity=".78">FINGERPRINTS — ROUNDS I & II</text>
        <line x1="24" y1="54" x2="226" y2="54" stroke={INK} strokeWidth="1" />
        {prints.map(({ x, y, r }, i) => (
          <g key={i} className="arc-print" transform={`translate(${x} ${y}) rotate(${r})`}>
            {[15, 11.5, 8, 4.8, 1.8].map((rx, k) => (
              <ellipse key={k} rx={rx} ry={rx * 1.45} fill="none" stroke="#241f1b" strokeWidth="1.05" strokeDasharray={k % 2 ? '7 2.5' : '11 2'} opacity={k === 0 ? 0.35 : 0.6} />
            ))}
            <path d="M-7 3 C -3 -6 4 -7 7 0" fill="none" stroke="#241f1b" strokeWidth="1.2" />
            <text x="0" y="34" textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill={INK} opacity=".55">{String(i + 1).padStart(2, '0')}</text>
          </g>
        ))}
        <line x1="24" y1="234" x2="226" y2="234" stroke="rgba(29,27,26,.4)" strokeWidth="0.8" />
        <text x="24" y="252" fontFamily={MONO} fontSize="7.5" fill={INK} opacity=".8">{caption}</text>
        <text x="24" y="272" fontFamily={MONO} fontSize="7" fill={INK} opacity=".6">VERIFIED AT THE VENTUREX DESK, YELAHANKA</text>
        <rect x="0" y="304" width="250" height="8" fill={accent} opacity=".85" />
      </Paper>
    </svg>
  )
}

// Wooden ruler (Bridge of Spies reference).
function ArchiveRuler() {
  const ticks = []
  for (let mm = 0; mm <= 200; mm += 5) {
    const major = mm % 40 === 0
    const mid = mm % 20 === 0 && !major
    ticks.push(
      <line
        key={mm}
        x1={16 + mm * 2} y1={major ? 22 : mid ? 26 : 29}
        x2={16 + mm * 2} y2={36}
        stroke="#3a2c1a"
        strokeWidth={major ? 1.4 : 0.8}
      />
    )
    if (major) {
      ticks.push(
        <text key={'n' + mm} x={16 + mm * 2} y={44.5} textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill="#3a2c1a">{mm / 20}</text>
      )
    }
  }
  return (
    <svg viewBox="0 0 432 48" aria-hidden="true" focusable="false">
      <rect width="432" height="48" rx="2.5" fill={WOOD} />
      <rect width="432" height="48" rx="2.5" fill="none" stroke="rgba(0,0,0,.3)" />
      <line x1="0" y1="3" x2="432" y2="3" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
      <text x="216" y="15" textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" fill="#3a2c1a" letterSpacing="1.5">VENTUREX · MEASURE TWICE, PITCH ONCE</text>
      <line x1="8" y1="19" x2="424" y2="19" stroke="rgba(0,0,0,.22)" strokeWidth="1" />
      {ticks}
    </svg>
  )
}

// Per-page artifact sets. event-timeline is intentionally absent — that page
// already carries its own arrival-guide tickets.
const PAGES = {
  'executive-overview': [
    { type: 'memo', stamp: 'APPROVED', to: 'REVIEW PANEL', from: 'E-CELL BMSIT&M', re: 'EXECUTIVE SUMMARY' },
    { type: 'specimen' },
    { type: 'ruler' }
  ],
  'frequently-asked-questions': [
    { type: 'form', title: 'ENQUIRY LOG', code: 'VX-02-26' },
    { type: 'tag' },
    { type: 'airmail' }
  ],
  'team': [
    { type: 'fingerprint' },
    { type: 'form', title: 'PERSONNEL FORM', code: 'VX-03-26' },
    { type: 'tag' }
  ],
  'why-participate': [
    { type: 'memo', stamp: 'RECOMMENDED', to: 'FOUNDERS DESK', from: 'INVESTOR PANEL', re: 'WHY TAKE PART' },
    { type: 'specimen' },
    { type: 'fingerprint' }
  ],
  'for-founders': [
    { type: 'form', title: 'FOUNDER SLIP', code: 'VX-05-26' },
    { type: 'memo', stamp: 'TOP 30', to: 'SHORTLIST DESK', from: 'REVIEW PANEL', re: 'ROUND II ENTRY' },
    { type: 'tag' }
  ],
  'about-venturex': [
    { type: 'fingerprint' },
    { type: 'memo', stamp: 'ARCHIVED', to: 'THE RECORDS ROOM', from: 'E-CELL BMSIT&M', re: 'ABOUT THE FILE' },
    { type: 'ruler' }
  ]
}

const EXHIBITS = {
  'executive-overview': ['EXHIBIT 01', 'Executive Overview', 'VX·EO·26'],
  'frequently-asked-questions': ['EXHIBIT 02', 'FAQs', 'VX·FA·26'],
  'team': ['EXHIBIT 03', 'The Team', 'VX·TE·26'],
  'why-participate': ['EXHIBIT 04', 'Why Participate', 'VX·WP·26'],
  'for-founders': ['EXHIBIT 05', 'For Founders', 'VX·FF·26'],
  'about-venturex': ['EXHIBIT 06', 'About VentureX', 'VX·AB·26']
}

const ENVELOPE_LINES = {
  'frequently-asked-questions': ['ANSWERS ENCLOSED — DO NOT FOLD', 'VENTUREX DESK, E-CELL BMSIT&M', 'AVALAHALLI · YELAHANKA', 'BENGALURU 560064']
}

function Artifact({ item, entry }) {
  const accent = entry.color
  const [exhibit, name, code] = EXHIBITS[entry.slug] || ['EXHIBIT VX', entry.name, 'VX·XX·26']
  switch (item.type) {
    case 'form':
      return <FormSheet title={item.title} code={item.code} accent={accent} />
    case 'memo':
      return <StampMemo stamp={item.stamp} to={item.to} from={item.from} re={item.re} accent={accent} />
    case 'specimen':
      return <SpecimenStrip accent={accent} />
    case 'tag':
      return <TagCard exhibit={exhibit} name={name} code={code} />
    case 'airmail':
      return <AirmailEnvelope accent={accent} lines={ENVELOPE_LINES[entry.slug] || ['VENTUREX DESK, E-CELL BMSIT&M', 'AVALAHALLI · YELAHANKA', 'BENGALURU 560064']} />
    case 'fingerprint':
      return <FingerprintCard accent={accent} caption={name.toUpperCase() + ' — RECORD ON FILE'} />
    case 'ruler':
      return <ArchiveRuler />
    default:
      return null
  }
}

export default function CaseArchive({ entry }) {
  if (entry.slug === 'event-timeline') return null
  const items = PAGES[entry.slug] || [
    { type: 'memo', stamp: 'FILED', to: 'RECORDS ROOM', from: 'E-CELL BMSIT&M', re: entry.name },
    { type: 'tag' }
  ]
  return (
    <section className="case-archive" aria-hidden="true" style={{ '--case-color': entry.color }}>
      <div className="case-archive__row">
        {items.map((item, i) => (
          <div className="archive-item" key={item.type + i}>
            <div className={'archive-card archive-card--' + item.type}>
              {item.type === 'form' && (
                <span className="archive-card__clip" aria-hidden="true">
                  <PaperclipTop className="archive-card__clip-svg" />
                </span>
              )}
              <Artifact item={item} entry={entry} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
