# VentureX design direction

Source: [`src/assets/moodboard.png`](src/assets/moodboard.png)

## Brand idea

VentureX is a pitch competition where student led startups meet venture capital investors. The visual identity should feel ambitious, energetic, and internet native: the excitement of a new idea meeting the credibility of a serious stage. Use strong editorial hierarchy and playful digital graphics without making essential event information hard to read.

## Visual style

- **Bold digital editorial:** Large, compressed display type, oversized wordmarks, graphic cropping, and high contrast color blocks.
- **Retro computer language:** Pixel grids, a desktop window frame, square controls, and an oversized pixel cursor evoke early web interfaces.
- **Energetic accents:** Sharp starbursts and circular shapes add momentum. Use these as focal points around key messages, not behind long text.
- **Layered but structured:** Repeat `VENTUREX` as a low contrast pattern, overlap a few graphic elements, and keep the core content aligned to a clear grid.
- **Mostly square geometry:** Crisp edges and modular blocks fit the pixel and window motifs. Reserve softer curves for circles and starbursts.

## Color palette

The first four values are labeled directly in the moodboard.

| Role | Hex | Use |
| --- | --- | --- |
| Electric blue | `#0186EF` | Main brand field, hero sections, prominent links and graphics |
| Acid yellow | `#F4FF9C` | High energy highlights, stars, selected emphasis, primary CTA against navy |
| Deep navy | `#00192F` | Headlines, body text, dark sections, outlines |
| White | `#FFFFFF` | Main page canvas, negative space, content surfaces |

The board also uses a pale blue pixel grid and a light lavender window bar. Their exact values are **not labeled**; treat them as supporting accents sampled from the asset if needed, rather than fixed brand colors. Keep text contrast strong: navy on white or yellow, and white or yellow on navy. Avoid yellow text on white and small yellow text on blue.

## Typography

These family names appear in the moodboard:

| Font | Suggested role | Character |
| --- | --- | --- |
| **HORIZON** | VentureX wordmark, main display headlines, large section titles | Wide, heavy, futuristic uppercase |
| **Josefin Sans** | Supporting headings, navigation, short labels | Geometric and clean with a distinctive editorial feel |
| **Glock Grotesk** | Body copy, UI labels, buttons, event details | Direct modern sans serif |
| **Cormorant Garamond** | Selective editorial accents, quotes, numbers, or short phrases | Elegant serif contrast |

Use HORIZON sparingly at large sizes; its weight and width need breathing room. Keep body copy in a legible sans serif and reserve Cormorant Garamond for short accents. The moodboard names fonts but does not include font files or licensing information; verify availability and usage rights before implementation. If a named font is unavailable, choose a close substitute while preserving the roles above.

## Composition and components

- **Hero:** Let `VENTUREX` dominate the first view. Pair it with a concise explanation of the competition and a clear action for students or attendees.
- **Glass field:** Recreate the reference's straight grid of rounded, translucent cubes over a blue to lavender to white gradient. The hero renders this with WebGL; pointer proximity gently enlarges nearby cubes and changes their refraction and highlights. Keep the effect decorative and allow touch scrolling through the field.
- **Background pattern:** Build a sparse, light blue square grid with generous white space. It should frame content rather than reduce readability.
- **Graphic moments:** Use acid yellow starbursts over electric blue fields, repeated wordmark strips, and occasional cursor artwork to emphasize key moments.
- **Content containers:** A retro window frame can hold a featured pitch, event highlight, or call to action. Keep actual buttons recognizable and accessible.
- **Information sections:** Event date, location, eligibility, schedule, prizes, judges, and application details should use straightforward layouts and readable type. Let decorative motifs cluster around them instead of competing with them.
- **Responsive behavior:** Preserve the bold type and blocks on mobile, but reduce decorative overlap and keep the primary action visible without horizontal scrolling.

## Practical design tokens

```css
:root {
  --color-blue: #0186ef;
  --color-yellow: #f4ff9c;
  --color-navy: #00192f;
  --color-white: #ffffff;
}
```

## Overall tone

Confident, inventive, and student driven. The site should feel like a launchpad for early stage ideas and a credible invitation to investors. Prioritize clear application and event information within the expressive visual system.
