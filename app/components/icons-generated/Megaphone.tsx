import type {SVGProps} from 'react'
const SvgMegaphone = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={80} height={80} fill="none" {...props}>
    <path
      fill="#fff"
      fillOpacity={0.8}
      stroke="#7AC0BE"
      d="M9.5 26a2.5 2.5 0 0 1 2.5-2.5h22.5v25H12A2.5 2.5 0 0 1 9.5 46z"
    />
    <path
      fill="url(#megaphone_svg__a)"
      d="M6 33a3 3 0 0 1 3-3v12a3 3 0 0 1-3-3z"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      fill="#fff"
      fillOpacity={0.8}
      stroke="#7AC0BE"
      d="M34.5 48.648V23.352l34.655-12.44a2.5 2.5 0 0 1 3.345 2.352v45.472a2.5 2.5 0 0 1-3.345 2.353z"
    />
    <path
      fill="url(#megaphone_svg__b)"
      d="M73 42.653A7 7 0 0 0 73 30z"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      fill="#fff"
      fillOpacity={0.8}
      stroke="#7AC0BE"
      d="M24.713 64.612 20.642 48.5H31.5V64a2.5 2.5 0 0 1-2.5 2.5h-1.864a2.5 2.5 0 0 1-2.424-1.888Z"
    />
    <defs>
      <linearGradient
        id="megaphone_svg__a"
        x1={9.013}
        x2={4.937}
        y1={41.925}
        y2={41.545}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#17736E" />
        <stop offset={1} stopColor="#7AC0BE" />
      </linearGradient>
      <linearGradient
        id="megaphone_svg__b"
        x1={77.017}
        x2={71.61}
        y1={42.574}
        y2={41.937}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#17736E" />
        <stop offset={1} stopColor="#7AC0BE" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgMegaphone
