# Original website reference

Reference folder: `C:/Users/archi/Downloads/mosbyfiles_clone`

## Export structure

70 files. This is a compiled, server-rendered Nuxt/Vue export, not the original editable Vue project. `js/` and `css/` are byte-identical copies of the corresponding `_nuxt/` files. There are 23 unique JavaScript bundles and three external CSS files. `index.html` also contains 19 inline style blocks and a 4,108-entry Nuxt serialized data table. No package manifest or source maps are supplied.

## Where behavior lives

- `js/CVQ6qitU.js`: homepage, Stack, StackGroup, StackCover, StackPage, WindRose and TheFooter.
- `js/BQSbx6GL.js`: Tag and TagSide, including the exact SVG tab outline and light/dark ink selection.
- `index.html`: homepage component CSS, including all stack geometry, transform states, responsive conditions, and server-rendered content.
- `js/DwAQhwlc.js`: Vue/Nuxt runtime and third-party libraries, shared stack state, routing, header, popup viewers, application setup, and GSAP page transition classes.
- `js/DhJT0uft.js`: case page, folder tabs, biography sheet, scrapbook, hero, next-case widget and overscroll interaction.
- `js/DD2_rTkE.js`: About page, five-second gallery transitions, scroll-triggered signature drawing.
- `js/D3iFUQhO.js`: Storyblok rich text rendering.
- `js/Dk1ebuKD.js`: homepage hero.
- `js/A27gjFwd.js`: scrapbook item positioning.
- `js/Sz9w4L3V.js`: photos, masks and image-popup references.
- `js/KkgrjUyW.js`: project notes.
- `js/SuH0pq7q.js`: nested photo stacks and paperclips.
- `js/0eBZ_iB7.js`: full and partial paperclips.
- `js/BFRn0ABL.js`: audio player, fetched waveform peaks and audio notes.
- `js/CUA8o-zW.js`: video thumbnails and popups.
- `js/CgSn0dTW.js`: PDF thumbnail and popup.
- `js/BoNK1NP1.js`: film reel video trigger.
- `js/BD3Ss7CD.js`: decorative ruler.
- `js/B8UBCeH6.js`: SEO.
- `js/-sEFxvpp.js`: keyboard-toggled debug grid.
- `js/DQCW61vn.js`: default layout and console credit.
- `js/CPQiCxXM.js`: missing component fallback.
- `js/CyQ-klJm.js`, `js/DXSC0uEf.js`: error pages.

## Exact hover mechanism

The original does not swap a single card background or reveal a clipped color overlay. Each group contains a separate cover and a full-size linked sheet for each architect. Every sheet renders the full row of tab slots, with only its own tab visible. This aligns the tabs while preserving sheet order.

The stack has perspective `3000px`. Groups and sheets preserve 3D transforms and use a bottom transform origin. The cover has z-index 100; sheets use negative page indices. Hovering page N rotates the cover and sheets before N with `translateY(1rem) rotateX(-3deg)`, exposing the selected sheet underneath. Later groups also rotate by -3 degrees, reduce their height by 1rem, and translateZ by twice their group index. Transitions take `.65s cubic-bezier(.33,1,.68,1)`.

Shared state includes `isHovered`, `isUnfolded`, `hoverGroupId`, `hoverPageId`, `isLocked`, `transitionGroupId`, and `transitionPageId`. Entering a sheet sets hover group/page and clears unfold state; leaving resets hover. A separate hit area occupying the rightmost 33% of each sheet sets unfold state. Unfolding changes the heights of later groups using the small-group-height variable. Navigation locks interaction until its transition finishes.

Baseline variables: group height 80vh, group offset 3.75rem, tab height 2.75rem, tab aspect ratio 1.409, radius 4px. Small-group height changes with aspect ratio and responsive breakpoints. The last cover displays the footer by default. Wind roses track the cursor angle.

Opening a case uses a GSAP Flip transition lasting 1.5 seconds with power3.inOut, rotates its folder cover to -180 degrees, and staggers the title, peer tabs and scrapbook. Returning home, moving between cases, and opening About have distinct transitions.

## Content and assets

The embedded payload contains global settings, home, all eight case stories, four stack groups, 34 scrapbook items, 77 photo components, 27 notes, 29 paperclip components, 21 stacks, four videos, two PDFs, two audio components and seven wind roses. It retains 109 distinct Storyblok asset URLs. The eight architects are Frank Lloyd Wright, Irving Gill, Frank Gehry, Louis Kahn, I. M. Pei, Paul Rudolph, Mary Colter and Louis Sullivan. The About module exists, but its story is not in this homepage payload.

Original local fonts are Signifier Light and Founders Grotesk X Condensed Bold. IBM Plex Mono is imported remotely. Local SVGs include the tab-related branding assets, scale and studio logo; image files contain texture/decorative and social/favicon assets.

## Export limitations

`CJ-JK7VA.js` and `DuhkIXXy.js` are imported by scrapbook components but absent from both bundle directories. These imports provide transform and dragging helpers. Other media and lazy-loaded resources are referenced without complete local copies. The export cannot be assumed to run completely offline or provide the original source project.

## Implication for VentureX

The current React implementation uses one face and a color overlay per group. Matching the reference hover requires separate ordered sheets, bottom-origin 3D transforms, and coordinated hover/unfold state. The recent color-reveal fix does not reproduce that original mechanism. Use this reference for subsequent implementation while retaining intentional VentureX branding choices.


## Deep UI and motion audit

See `reference-analysis/UI_AND_MOTION_AUDIT.md` for exact responsive geometry, all route transition sequences, scrolling/header behavior, popup animations, per-item scrapbook data and export limitations. Readable source extracts and decoded stories are saved beside it. The footer shift described above applies only at aspect ratio >=2:1. Missing CSS extends beyond the two JavaScript helpers: case, About and scrapbook component styles are absent.
