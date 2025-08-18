import type {SVGProps} from 'react'
const SvgDonate = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      fill="url(#donate_svg__a)"
      d="m21.429 15.643-4.754.704c-.544.08-1.04-.359-1.292-.827-.884-1.728-3.86-3.091-6.383-3.091H2.614a.547.547 0 0 0-.543.542v4.609c0 .296.247.543.543.543H8.22q.138 0 .27.032l5.629 2.127c.256.08.533.084.782.016l8.414-2.13c.402-.099.699-.462.64-.873-.22-1.532-1.207-1.84-2.526-1.652"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <rect
      width={6.129}
      height={9.129}
      x={1.007}
      y={10.864}
      fill="#fff"
      fillOpacity={0.8}
      stroke="#1D9089"
      strokeWidth={0.5}
      rx={0.75}
    />
    <g stroke="#1D9089" strokeLinecap="round">
      <path strokeWidth={0.5} d="M18 4v10" />
      <path
        strokeLinejoin="round"
        strokeWidth={0.5}
        d="M20.5 5.5h-3.75a1.75 1.75 0 0 0 0 3.5h2.5a1.75 1.75 0 0 1 0 3.5H15"
      />
    </g>
    <defs>
      <linearGradient
        id="donate_svg__a"
        x1={24.093}
        x2={9.551}
        y1={20.308}
        y2={5.055}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#17736E" />
        <stop offset={1} stopColor="#1D9089" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgDonate
