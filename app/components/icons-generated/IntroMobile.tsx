import type {SVGProps} from 'react'
const SvgIntroMobile = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-20 -10 310 200" {...props}>
    <g mask="url(#intro-mobile_svg__mask0_2889_5101)">
      <circle cx={138.5} cy={138.5} r={62} stroke="#7AC0BE" />
      <circle cx={138.5} cy={138.5} r={88} stroke="#7AC0BE" />
      <circle cx={138.5} cy={138.5} r={113} stroke="#7AC0BE" />
      <circle cx={138.5} cy={138.5} r={138} stroke="#7AC0BE" />
      <g filter="url(#intro-mobile_svg__a)">
        <circle cx={138.5} cy={138.5} r={36.5} fill="#4DA7A6" />
      </g>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M136.892 149.311a1.308 1.308 0 1 0 2.614 0h10.459c.723 0 1.308-.585 1.308-1.307V129.7c0-.722-.585-1.307-1.308-1.307h-9.151a3.9 3.9 0 0 0-2.615.999 3.9 3.9 0 0 0-2.615-.999h-9.152c-.722 0-1.307.585-1.307 1.307v18.304c0 .722.585 1.307 1.307 1.307zm-9.152-18.303v15.688h9.152v-14.381c0-.722-.586-1.307-1.308-1.307zm11.766 1.307v14.381h9.152v-15.688h-7.844c-.722 0-1.308.585-1.308 1.307"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <filter
        id="intro-mobile_svg__a"
        width={121}
        height={121}
        x={78}
        y={94}
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
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.12549 0 0 0 0 0.172549 0 0 0 0 0.34902 0 0 0 0.1 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2889_5101" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_2889_5101" result="shape" />
      </filter>
    </defs>
  </svg>
)
export default SvgIntroMobile
