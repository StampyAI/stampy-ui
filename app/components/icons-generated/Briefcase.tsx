import type {SVGProps} from 'react'
const SvgBriefcase = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={80} height={80} fill="none" {...props}>
    <path
      fill="url(#briefcase_svg__a)"
      d="M5.714 21.518c0-1.627 1.535-2.947 3.429-2.947h61.714c1.894 0 3.429 1.32 3.429 2.947v41.25c0 1.627-1.535 2.946-3.429 2.946H9.143c-1.894 0-3.429-1.319-3.429-2.946z"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      fill="#fff"
      fillOpacity={0.8}
      stroke="#7AC0BE"
      d="M25.714 19.071a3.357 3.357 0 0 0 3.358-3.357 5.214 5.214 0 0 1 5.214-5.214h11.428a5.214 5.214 0 0 1 5.215 5.214 3.357 3.357 0 0 0 3.357 3.357h17.143a2.357 2.357 0 0 1 2.357 2.358v15.12c0 1.083-.74 2.026-1.788 2.277-19.516 4.66-43.139 4.762-63.974-.017a2.34 2.34 0 0 1-1.81-2.282V21.429a2.357 2.357 0 0 1 2.358-2.358zm10-3.857a1.929 1.929 0 1 0 0 3.857h8.572a1.929 1.929 0 1 0 0-3.857z"
    />
    <defs>
      <linearGradient
        id="briefcase_svg__a"
        x1={74.574}
        x2={1.987}
        y1={65.421}
        y2={26.024}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#17736E" />
        <stop offset={1} stopColor="#7AC0BE" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgBriefcase
