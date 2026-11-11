// VentureX participant ID card (from "venturex id thingy.zip" / Asset 1.svg).
// Inlined as JSX instead of <img> so the text renders with the site's loaded
// fonts: Elegance (same face as the original EleganceNaturalValentine) and
// Lil Grotesk standing in for Gottak, which is not shipped with the site.
export default function IdCard({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 402.89 577.53"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {/* Card body + white inner border */}
      <rect width="402.89" height="577.53" rx="15.23" ry="15.23" fill="#2b5a48" />
      <rect x="5.61" y="8.46" width="391.67" height="562.61" rx="15.23" ry="15.23" fill="#2b5a48" stroke="#fff" strokeMiterlimit="10" />
      {/* Top clip slot */}
      <rect x="142.04" y="18.86" width="118.81" height="10.81" rx="5.4" ry="5.4" fill="#fff" />

      {/* Bottom blue band + script wordmark (Elegance matches the original font) */}
      <rect x="28.17" y="441.01" width="346.55" height="106.95" transform="translate(404.08 988.49) rotate(-180)" fill="#699ad1" />
      <text transform="translate(55.34 526.61) scale(.97 1)" fill="#fff" fontFamily="Elegance, Georgia, serif" fontSize="100.6">
        <tspan x="0" y="0" letterSpacing="-.07em">V</tspan>
        <tspan x="37.93" y="0" letterSpacing="0em">e</tspan>
        <tspan x="75.76" y="0" letterSpacing="-.03em">n</tspan>
        <tspan x="118.01" y="0" letterSpacing="0em">t</tspan>
        <tspan x="140.65" y="0" letterSpacing="-.01em">u</tspan>
        <tspan x="184.41" y="0" letterSpacing="0em">r</tspan>
        <tspan x="217.51" y="0" letterSpacing="-.04em">e</tspan>
        <tspan x="251.71" y="0" letterSpacing="0em">X</tspan>
      </text>

      {/* Yellow participant band */}
      <rect x="28.04" y="38.38" width="345.93" height="70.56" fill="#f1c65d" />
      <text transform="translate(43.2 89.72) scale(1.06 1)" fill="#fff" fontFamily="'Lil Grotesk', Arial, sans-serif" fontWeight="700" fontSize="40.93" letterSpacing="-.06em">
        PARTICIPANT 204
      </text>

      {/* Pink details panel */}
      <rect x="28.04" y="124.68" width="344.82" height="296.91" fill="#da82aa" />
      <text transform="translate(39.78 315.99)" fill="#fff" fontFamily="'Lil Grotesk', Arial, sans-serif" fontWeight="700" fontSize="46.62" letterSpacing="-.05em">
        <tspan x="0" y="0">Name</tspan>
        <tspan x="0" y="39.79">Surname</tspan>
      </text>
      <text transform="translate(38.12 405.26)" fill="#fff" fontFamily="'Lil Grotesk', Arial, sans-serif" fontWeight="700" fontSize="37.05" letterSpacing="-.05em">
        Team Name
      </text>

      {/* "pitch win build" ticker with up/down markers */}
      <text transform="translate(205.19 162.5)" fill="#fff" fontFamily="'Lil Grotesk', Arial, sans-serif" fontWeight="700" fontSize="25.54" letterSpacing="-.04em">
        pitch win build
      </text>
      <g fill="#fff">
        <rect x="202.26" y="145.37" width="160.71" height="19.66" opacity=".25" />
        <rect x="201.76" y="145.69" width="1" height="22.29" />
        <rect x="362.46" y="143.77" width="1" height="21.58" />
        <polygon points="199.15 173.77 202.26 166.79 205.36 173.77" />
        <polygon points="366.07 137.95 362.96 144.93 359.86 137.95" />
      </g>
    </svg>
  )
}
