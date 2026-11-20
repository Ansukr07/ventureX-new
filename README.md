# VentureX website

VentureX is a student startup pitching and investor-connect event by E-Cell, BMS Institute of Technology & Management. The working SEO and registration plan is in [optimization.md](optimization.md).

## Develop

```sh
npm install
npm run dev
```

## Production build and search pages

The production build runs Vite and then `scripts/prerender.mjs`. The script builds a server bundle and prerenders the complete React component tree and page-specific metadata for each public route (`/`, `/about`, `/guide/pitch-video`, `/cases/<slug>`, and `404.html`) to static HTML in `dist`. On page load, React hydrates the prerendered markup with `hydrateRoot` in `src/main.jsx` for instant interactivity without layout shifts or content replacement.

Set `SITE_URL` to the final HTTPS origin when building for production. It must contain only the origin, without a path or trailing slash. Example: `SITE_URL=https://venturex.example npm run build` (PowerShell: `$env:SITE_URL='https://venturex.example'; npm run build`). This adds canonical URLs, `og:url`, `dist/sitemap.xml`, and `dist/robots.txt`. Do not set a placeholder domain in a deployed build.

Configure the host to serve the generated `index.html` file for each public route and the generated `404.html` with HTTP 404 for unknown routes. Verify direct visits to `/`, `/about`, and each `/cases/<slug>` after deployment. The host configuration is outside this repository and must be checked for the chosen provider.

Registration URL, exact registration deadline, Round 2 fee, submission requirements, and organizer contact details are TBA. The event year is 2026; the finale is listed for 30 December 2026. Replace the TBA information only after confirmation from the organizer.
