import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { build } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
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
  { route: '/', title: 'VentureX | Student Startup Pitching & Investor Connect, Bengaluru', description: summary },
  ...cases.map(item => ({ route: `/cases/${item.slug}`, title: `VentureX ${item.name} | Student Startup Pitching`, description: item.bio?.[0] || summary })),
  { route: '/about', title: 'About VentureX | E-Cell BMSIT&M', description: about.intro },
  { route: '/guide/pitch-video', title: 'How to Prepare a VentureX Startup Pitch Video | Student Guide', description: 'Prepare your VentureX startup pitch and video demonstration. Learn the confirmed team rules and what to present before the online preliminary round.' }
]

// Build temporary SSR bundle into node_modules/.cache/ssr-build to prerender React component tree
const ssrDir = path.resolve('node_modules/.cache/ssr-build')
await build({
  build: {
    ssr: 'src/App.jsx',
    outDir: ssrDir,
    emptyOutDir: true
  },
  logLevel: 'warn'
})

const appModulePath = path.join(ssrDir, 'App.js')
const { default: App } = await import('file://' + appModulePath.replace(/\\/g, '/'))

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
  const appHtml = renderToString(React.createElement(App, { initialPath: page.route }))
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  if (page.route === '/') {
    await writeFile(path.join(output, 'index.html'), html)
  } else {
    const dirTarget = path.join(output, page.route, 'index.html')
    const cleanTarget = path.join(output, `${page.route}.html`)
    await mkdir(path.dirname(dirTarget), { recursive: true })
    await mkdir(path.dirname(cleanTarget), { recursive: true })
    await writeFile(dirTarget, html)
    await writeFile(cleanTarget, html)
  }
}

const notFoundAppHtml = renderToString(React.createElement(App, { initialPath: '/404' }))
const notFoundHtml = setTag(template, /<title>[^<]*<\/title>/, '<title>Page not found | VentureX</title>')
  .replace('<div id="root"></div>', `<div id="root">${notFoundAppHtml}</div>`)
  .replace('</head>', '<meta name="robots" content="noindex" /></head>')
await writeFile(path.join(output, '404.html'), notFoundHtml)

if (siteUrl) {
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${escape(siteUrl + page.route)}</loc></url>`).join('')}</urlset>`)
  await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)
}
console.log(`Prerendered and hydrated ${pages.length} public routes${siteUrl ? ' with sitemap and canonical URLs' : ' (set SITE_URL for canonical URLs and sitemap)'}.`)
