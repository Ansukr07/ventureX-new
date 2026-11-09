import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import cases from '../src/cases.json' with { type: 'json' }
import about from '../src/about.json' with { type: 'json' }

const output = path.resolve('dist')
const template = await readFile(path.join(output, 'index.html'), 'utf8')
const siteUrl = process.env.SITE_URL?.replace(/\/+$/, '') || ''
if (siteUrl && !/^https:\/\/[^/]+$/.test(siteUrl)) {
  throw new Error('SITE_URL must be a production HTTPS origin, for example https://example.com')
}
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const summary = 'VentureX by E-Cell, BMSIT&M welcomes student startup teams across India. The free online preliminary round leads to an investor pitching finale in Bengaluru on 30 December 2026.'
const finaleEvent = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'VentureX 2026 Live Investor Pitching Round',
  startDate: '2026-12-30T09:00:00+05:30',
  endDate: '2026-12-30T16:00:00+05:30',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  description: 'The top 30 student startup teams selected from the online preliminary round pitch their ventures to investors in person.',
  location: {
    '@type': 'Place',
    name: 'BMS Institute of Technology & Management',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Doddaballapur Main Road, Avalahalli, Yelahanka',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      postalCode: '560064',
      addressCountry: 'IN'
    }
  },
  organizer: { '@type': 'Organization', name: 'Entrepreneurship Cell, BMS Institute of Technology & Management' }
}
const pages = [
  { route: '/', title: 'VentureX | Student Startup Pitching & Investor Connect, Bengaluru', description: summary,
    html: `<h1>VentureX — Student Startup Pitching &amp; Investor Connect</h1><p>${escape(summary)}</p><p>Teams of 3–4 students can submit a startup pitch and video demonstration online. The top 30 teams advance to the in-person finale at BMS Institute of Technology &amp; Management, Yelahanka, Bengaluru.</p><p>Registration details will be published when confirmed.</p><nav aria-label="Event information"><ul>${cases.map(item => `<li><a href="/cases/${escape(item.slug)}">${escape(item.name)}</a></li>`).join('')}<li><a href="/guide/pitch-video">How to prepare a VentureX pitch video</a></li><li><a href="/about">About VentureX</a></li></ul></nav>` },
  ...cases.map(item => ({ route: `/cases/${item.slug}`, title: `VentureX ${item.name} | Student Startup Pitching`, description: item.bio?.[0] || summary,
    html: `<h1>${escape(item.name)} — VentureX</h1>${(item.bio || []).map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}${item.faqs ? item.faqs.map(faq => `<h2>${escape(faq.question)}</h2><p>${escape(faq.answer)}</p>`).join('') : ''}${item.timeline ? `<ol>${item.timeline.map(step => `<li><strong>${escape(step.date)}: ${escape(step.title)}</strong> ${escape(step.text)}</li>`).join('')}</ol>` : ''}<p><a href="/">Explore VentureX</a></p>` })),
  { route: '/about', title: 'About VentureX | E-Cell BMSIT&M', description: about.intro,
    html: `<h1>About VentureX</h1><p>${escape(about.intro)}</p>${(about.sections || []).map(section => `<section><h2>${escape(section.heading)}</h2>${section.paragraphs.map(p => `<p>${escape(p)}</p>`).join('')}</section>`).join('')}<p><a href="/">Explore VentureX</a></p>` },
  { route: '/guide/pitch-video', title: 'How to Prepare a VentureX Startup Pitch Video | Student Guide', description: 'Prepare your VentureX startup pitch and video demonstration. Learn the confirmed team rules and what to present before the online preliminary round.',
    html: '<h1>Prepare your VentureX pitch</h1><p>The first round is online: student teams submit a startup pitch and video demonstration for investor evaluation. The round is free to enter.</p><h2>Build a clear case for your venture</h2><p>Explain the problem your startup addresses, what your product or idea does, and why it matters. Show the venture’s value, business model, and market potential in terms your audience can understand.</p><h2>Check your team</h2><p>Teams must have 3–4 students enrolled in accredited higher education institutions across India. Cross-college and interdepartmental teams are permitted. VentureX welcomes ideas from any industry.</p><h2>Know what happens next</h2><p>The top 30 teams advance to the live investor pitching round in Yelahanka, Bengaluru, on 30 December 2026.</p><h2>Submission details</h2><p>Registration link, deadline, video length, file format, submission method, and judging criteria are TBA.</p><p><a href="/cases/frequently-asked-questions">VentureX FAQs</a></p>' }
]

const setTag = (html, selector, replacement) => html.replace(selector, replacement)
for (const page of pages) {
  let html = template
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
  html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${escape(page.description)}" />`)
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escape(page.title)}" />`)
  html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escape(page.description)}" />`)
  if (siteUrl) html = html.replace('</head>', `<link rel="canonical" href="${siteUrl}${page.route}" /><meta property="og:url" content="${siteUrl}${page.route}" /></head>`)
  if (page.route === '/' || page.route === '/cases/event-timeline') {
    const event = { ...finaleEvent, ...(siteUrl ? { url: `${siteUrl}/cases/event-timeline` } : {}) }
    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(event).replace(/</g, '\\u003c')}</script></head>`)
  }
  html = html.replace('<div id="root"></div>', `<div id="root"><main class="seo-fallback">${page.html}</main></div>`)
  const target = page.route === '/' ? path.join(output, 'index.html') : path.join(output, page.route, 'index.html')
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, html)
}
await writeFile(path.join(output, '404.html'), template.replace('<div id="root"></div>', '<div id="root"><main><h1>Page not found</h1><p><a href="/">Return to VentureX</a></p></main></div>').replace('</head>', '<meta name="robots" content="noindex" /></head>'))
if (siteUrl) {
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${escape(siteUrl + page.route)}</loc></url>`).join('')}</urlset>`)
  await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)
}
console.log(`Prepared ${pages.length} public routes${siteUrl ? ' with sitemap and canonical URLs' : ' (set SITE_URL for canonical URLs and sitemap)'}.`)
