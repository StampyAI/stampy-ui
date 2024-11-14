import type {SVGProps} from 'react'
const SvgPeopleHelpSection = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={80} height={80} fill="none" {...props}>
    <path
      fill="url(#people_help_section_svg__a)"
      d="M53.572 39.365c6.114 0 11.071-4.975 11.071-11.111s-4.957-11.111-11.071-11.111c-6.115 0-11.072 4.974-11.072 11.11 0 6.137 4.957 11.112 11.072 11.112"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      fill="url(#people_help_section_svg__b)"
      d="M53.572 44.92c-11.372 0-20.755 8.486-22.124 19.45-.19 1.523 1.076 2.773 2.615 2.773H73.08c1.54 0 2.805-1.25 2.615-2.772-1.368-10.965-10.752-19.45-22.123-19.45"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      fill="#fff"
      fillOpacity={0.8}
      stroke="#7AC0BE"
      d="M35.572 28.254c0 5.862-4.735 10.611-10.572 10.611S14.43 34.116 14.43 28.254 19.163 17.643 25 17.643s10.572 4.749 10.572 10.61Zm-32.2 36.179C4.712 53.716 13.883 45.42 25 45.42s20.29 8.295 21.628 19.012c.147 1.18-.835 2.21-2.119 2.21H5.492c-1.284 0-2.267-1.03-2.12-2.21Z"
    />
    <defs>
      <linearGradient
        id="people_help_section_svg__a"
        x1={75.9}
        x2={21.188}
        y1={66.832}
        y2={48.749}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#17736E" />
        <stop offset={1} stopColor="#7AC0BE" />
      </linearGradient>
      <linearGradient
        id="people_help_section_svg__b"
        x1={75.9}
        x2={21.188}
        y1={66.832}
        y2={48.749}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#17736E" />
        <stop offset={1} stopColor="#7AC0BE" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgPeopleHelpSection
