import type {SVGProps} from 'react'
const SvgPlaneSend = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} fill="none" {...props}>
    <g filter="url(#plane-send_svg__a)">
      <rect width={48} height={48} fill="#1D9089" rx={6} shapeRendering="crispEdges" />
    </g>
    <path
      stroke="#fff"
      strokeLinecap="square"
      strokeLinejoin="round"
      d="M31.084 18.127a.5.5 0 0 0-.695-.58l-13.2 6.154a.5.5 0 0 0-.04.885l2.61 1.518.933 3.116a.5.5 0 0 0 .814.229l1.572-1.416 4.128 2.4a.5.5 0 0 0 .735-.306z"
    />
    <defs>
      <filter
        id="plane-send_svg__a"
        width={128}
        height={128}
        x={-40}
        y={-24}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={16} />
        <feGaussianBlur stdDeviation={20} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.12549 0 0 0 0 0.172549 0 0 0 0 0.34902 0 0 0 0.05 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1470_2875" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_1470_2875" result="shape" />
      </filter>
    </defs>
  </svg>
)
export default SvgPlaneSend
