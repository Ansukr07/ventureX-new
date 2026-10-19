# UI and motion audit of the original export

Source: `C:/Users/archi/Downloads/mosbyfiles_clone`. Findings below come from the supplied HTML, component JavaScript, styles and decoded content. These are source-level findings, not a claim of browser validation. Missing resources are recorded explicitly.

## 1. Visual system and responsive geometry

The original base is dark: primary #191919, contrast #fdfaf7, secondary text #787a7f. The green mat and sunlight background in VentureX are custom additions, not evidenced in the supplied original homepage styling.

Typography uses Signifier Light for prose and tabs, Founders Grotesk X Condensed Bold for headings/logo-like text, and IBM Plex Mono for captions/navigation/metadata. Current VentureX aliases Signifier and Founders to other fonts, which changes tab width, line wrapping, title proportions and perceived spacing.

Root font sizes: 18px at >=1920px; 16px at >=1440px; 15px at >=1025px; 14px at <=1024px; 13px at <=768px; 12px at <=320px. Container gutters: 48px at >=1920, 34px at >=1440, 32px at >=1025, 30px at <=1024, 20px at <=768, 18px at <=480. All rem geometry must be evaluated with these sizes.

The hero occupies 100vh. Its content is centered on both axes with balanced text. Top padding is 1.875rem. Bottom padding is five stack offsets, or 3.5 offsets plus the small-group-height at aspect ratios <=2:1. Title font size is a container-width multiplier capped at 200px: .119 normally, .105 at aspect ratio <=2:1, .13 at <=1024px, .18 at <=768px, .23 at <=480px. Description is 50rem wide, capped by the container, and becomes 16px at <=480px.

The stack is not a fixed-width collection of headers. Its height is 80vh + 3.75rem*(group count-1). It overlaps the hero with margin-top -3.75rem*group count; at aspect ratio <=2:1 it additionally subtracts small-group-height and adds one offset. Desktop stack width is calc(90% - .1rem), mobile <=1024px is 100% of its containing region.

Small-group-height is 20vw normally, 15vw at aspect ratio <=2:1, 20vh at <=1024px, 15vh at <=480px. This influences unfolding and footer visibility, not just card height.

## 2. Hover, unfold, stacking and surface effects

Group heights are bottom-anchored: 80vh + offset*(groups remaining). Groups have z-index equal to group index. Each group contains a cover at z-index 100 and individual full-height linked sheets at negative page-index z-indices. Each sheet renders every tag slot; only its own tag is visible/clickable. Other slots preserve layout using dummy side geometry.

Perspective is 3000px. Group, inner, cover and sheet preserve 3D transforms. Transform origin is bottom. Cover and previous sheets move by translateY(1rem) rotateX(-3deg) when hovering a page. Later groups reduce their height by 1rem and rotateX(-3deg), with translateZ(2px*groupIndex). These operations expose physical layers; no clip-path color wipe is used.

Hovering the first page also fades in the cover's surface highlight: a #ffffff0d wash and 0 -1px 8px rgba(0,0,0,.15) shadow. It is not a permanent brightness filter on the selected sheet. Cover border radius is 4px 4px 0 0.

Most hover transforms, group heights, surface opacity and category-arrow rotation share .65s cubic-bezier(.33,1,.68,1). These transitions are enabled after loading. Global overflow:clip constrains moving layers.

Entering a sheet sets hovered group/page and clears unfolding; leaving clears hover. The rightmost 33% of the full sheet is a separate unfold hit area. Entering that area sets unfolding; leaving clears it. Later groups then use height 80vh-small-group-height+offset+offset*(groups remaining). Clicking a category to choose a persistent active group, as VentureX currently does, is not this original interaction.

Category arrows rotate 90 degrees when folded and 0 degrees when unfolded. The selected/hovered group's cover is considered unfolded; the last group is unfolded by default when nothing is hovered. Description begins at one group offset, has max-width 85vh and balanced wrapping. Description disappears <=480px; category label disappears <=768px.

## 3. Tabs and footer details

Tabs are 2.75rem tall; <=768px they are 2.25rem. Text is 1.625rem desktop, 1.25rem <=1024px, 15px <=480px. SVG side aspect ratio is 1.409. Left side uses scale(-1,1.01) translate(-1px), right side scaleY(1.01) translate(-1px), and margin-bottom:-1px closes seams. At <=768px and <=480px, negative tab and label margins compress the row. This is more specific than scaling every tab uniformly.

Theme ink is #000 for dark-themed pages, #fff otherwise. Original case colors: Wright #1E4BD7; Gill #D71E1E; Gehry #0C7866; Kahn #581E70; Pei #FFE927; Rudolph #000000; Colter #D71E1E; Sullivan #1E4BD7. Group cover color comes from its first case, not an independent approximate palette.

The footer exists only in the last cover. Its children retain 3D transforms and the footer uses translateZ(1px). It has 3.75rem vertical gap, .75rem uppercase mono text, 8.75rem scale graphic, centered year, and 2.5rem studio logo. Year hides <=768px. Selected wind roses hide <=480px according to content flags. Roses are images up to 5rem wide and follow mouse direction using atan2 relative to each image center, plus a 45-degree net correction. They are not static generated compass symbols.

Only at aspect ratio >=2:1 does a folded cover translate the footer down by small-group-height. This condition was missing from the initial reference summary.

## 4. Loading choreography

Initial state hides hero title, description and stack and moves the fixed header above the viewport. After app resolution, a GSAP timeline with power4.out moves the stack from yPercent -50 to 0. Groups start at yPercent 200 and scale 1.75, animate for .5s, stagger .015s, and clear transform/scale afterward. SplitText creates character masks. Title characters rise from yPercent 100 and opacity 0 over .9s, beginning .4s plus .2s per line. Description rises 2rem and fades in over .65s at .9s. ScrollTrigger refreshes 300ms after app resolution.

## 5. Navigation transition matrix

| Trigger | Source-defined choreography |
| --- | --- |
| Home to case | Other groups move down 120%, .1s stagger; hero fades/moves down; unselected sheets are hidden. GSAP Flip reparents the chosen folder over 1.5s power3.inOut. Cover rotates to -180deg. Shadow appears at .25s and fades from .6s; title starts .65s, peer tags .85s, scrapbook 1s. |
| Case to home | Scrapbook drops 50vh over .2s, then a 1.5s Flip returns the folder while cover closes. Title characters leave with .035s stagger. Other groups return from 120% over .9s with .1s stagger; descriptions and category fade back separately. |
| Cases within same group | Page-turn: old cover closes, new cover opens over .75s; titles move horizontally 150% with opposing stagger; scrapbook drops/rises 50vh. Front shadow fades in then out. |
| Next group/case | Desktop departure scrolls to bottom over 1.25s unless already overscrolling; folder moves -75vh over .35s. Arrival starts at 60vh: title scale .666, folder and sheet rise .6s, peer tags stagger -.05s. |
| Previous group | Scroll to top, freeze, title exits left; folder descends toward viewport bottom over .65s. Arrival uses .65s character entrance with .025s stagger, 1s folder rise and 10rem sheet rise. |
| Mobile next case | Folder and widget leave -100vh over .35s. Incoming title characters enter from -100%, folder rises from viewport bottom over 1s, sheet rises 10rem. |
| Home to About | Hero moves -50vh; stack origin becomes top, scales 1.75 and drops 60%, .75s power3.inOut. |
| About entry | Main and close rise from 60vh over 1s; gallery counter-moves -60vh; inner/image wrappers animate opposing 100% offsets; text fades from .3s. |
| About exit | Reverse gallery/main motions over .75s; text fades over .3s. |
| Case to About | Save scroll, freeze, case content exits -100vw, sheet -10vw, scrapbook -100vw over roughly 1s. |
| About to case | Restore saved scroll; case content enters from -100vw, title -50vw, sheet -10vw and scrapbook -100vw. |
| About to home | Scroll top; hero returns from -50vh; stack returns from 60%; groups return from 200% and scale 1.75 with .015s stagger. |

Route selection chooses page-turn for same-group cases, folder-next for later groups or overscroll, folder-prev for earlier groups. Navigation and stack interaction are locked during transitions. These cannot be reproduced faithfully using one generic page fade.

## 6. Scrolling and headers

Lenis uses lerp .075 and GSAP's ticker; lag smoothing is disabled. Each scroll updates ScrollTrigger. Freeze stops Lenis and intercepts wheel, touchmove and scroll-related keys, allowing explicitly exempt nested areas. Unfreeze removes those listeners. Transitions coordinate scroll restoration and freezing.

Fixed header uses #191919cc, backdrop blur 100px, 1px translucent border, 3.75rem height and z-index 1000. Visible transition is .65s; hiding .325s, both cubic-bezier(.33,1,.68,1), using translateY(-100%). It hides on About; on case pages it hides on downward scrolling past 300px and returns on upward scroll. It also hides at the document bottom. A case subheader uses the opposite visibility state. Navigation opacity changes .8 to 1 over .65s.

The next-case widget becomes eligible after actualScroll >300px. Desktop overscroll starts within 100px of the bottom. Positive wheel/touch increments are clamped to 100 per event and accumulate to a 2000-unit progress target; reverse input resets progress. The action progress moves from -100% to 0; case content shifts up to -5vh over .5s. On completion, navigation starts after 350ms. This is deliberate extra scroll input, not simply reaching the end once.

## 7. Scrapbook geometry and materials

Decoded content preserves individual transforms and responsive overrides: x/y, reversed axes, width, rotation, stacking, transform origin and top/bottom spacing. Scrapbook parent x uses calc(positionX*1.1% - measuredWidth*positionX/100); y similarly compensates measured height. Nested photos use their own transforms. Responsive keys include mobile_lg, mobile_md and mobile_sm, but the helper that maps them to breakpoints is missing.

There are 34 scrapbook parents and many individually draggable children. Original layouts contain photos, notes, attached paperclips, stacked images, PDFs, video thumbnails, film reels, ruler and audio cards. Simple two-column image pairs lose these relationships. Notes have individual color, size, mask and marks variants; paperclips have full/partial paths and custom colors.

Paper overlay is inset 1px, sized calc(100%-2px), background-size 110% 110%, plus-lighter blend at .4 opacity. Marks use difference blend at opacity 1. Exact note masks, sizing and other component surfaces cannot be recovered from absent component CSS alone.

Per-case bottom spacing (lg/md/sm, rem): Wright 30/35/35, Gill 100/115/90, Gehry 105/105/105, Kahn 85/85/85, Pei 90/80/80, Rudolph 150/140/150, Colter 95/90/90, Sullivan 120/110/110. This spacing is content-specific.

## 8. Image and media interactions

Clicking a non-decorative photo opens an in-app popup. If inside a stack, the entire stack moves to the viewer; otherwise the actual image moves. GSAP Flip preserves its old geometry and animates .6s power3.inOut with scale enabled. Attached paperclip scale compensates for the new width. Masked original photos reveal over .4s with .2s delay. Closing returns the same object to its parent and reverses the mask reveal; it is not a new browser tab.

Popup background is #000000d9. Main desktop padding is 8rem vertically with a 14rem sidebar; <=768px layout stacks with 1.5rem gap and a fixed top-right close button. Image containment retains aspect ratio. Source/description appears in a #1e4bd7 callout. Background entry takes .7s; overall leave .65s. Close button scales from .5; callout moves 1rem and fades .15s. Before leave, backdrop fades .1s and starts the viewer return animation. Outside click closes the popup. Opening freezes scrolling; closing unfreezes it.

Video embeds open in the popup at 16:9. PDF uses an embedded PDF renderer and scrollable region. Inline audio fetches waveform data, normalizes abs(sample)/128 with an exponent, and renders WaveSurfer bars (1.5px width/gap, 2px radius, 20px height), play/pause and duration. The separate audio popup is only a placeholder in this export; do not assume a finished UI there.

Close-button hover scales the circle .97 and icon 1.03; pressed icon scales 1.2 over .325s. Its exported background is literal red, which may be an original/export anomaly rather than a desirable design choice.

## 9. About details

Gallery advances every 5000ms. Outgoing image goes to -110%, incoming comes from +110%, .6s power2.out; incoming z-index increments. Active caption follows the selected image. Signature draws its SVG path over 2.4s power5.inOut at top-bottom viewport intersection, with toggleActions play/none/none/reset. Close uses browser back if available, home otherwise. About's own layout CSS and story payload are missing, so its exact page layout is not verified.

## 10. Gaps, anomalies and implementation priorities

The dependency map names absent about.Cbj5gFVH.css, _slug_.DoQEXokL.css and all scrapbook component CSS files. Home, hero and grid CSS chunks are also absent as standalone files, but corresponding styles are embedded in the homepage HTML. The two transform/drag helpers are absent. Do not invent exact dragging bounds/inertia or case-sheet surface styling from these partial resources.

Other export details deserve validation before copying: the blue 50vh pseudo-element after the app, debug keyboard grid, literal red close button, placeholder audio popup, and missing media paths. No reduced-motion rule was found in the supplied styles; VentureX should retain its existing reduced-motion support.

Priority for matching the original: (1) rebuild separate sheet/cover hierarchy and hover/unfold state, (2) preserve exact fonts and responsive geometry, (3) add route-specific folder/page-turn transitions and scroll coordination, (4) use decoded scrapbook transforms and materials, (5) implement image/media popups and About choreography. Preserve intentional VentureX branding decisions independently.

## Evidence artifacts

- original-styles.css: readable extraction of all 19 inline style blocks and three CSS files, retaining media-query nesting.
- original-transitions.js: extracted transition classes from the main bundle, with line breaks for inspection. This is reference code, not an importable new application module.
- content-decoded.json: decoded global/home/case stories, including original per-item responsive settings and asset references. Global settings reference cases, so stories recur in the JSON.

No application behavior was changed during this audit. Browser validation remains necessary once missing resources are addressed or the behaviors are ported.
