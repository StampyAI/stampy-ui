import type {SVGProps} from 'react'
const SvgMicroscope = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={80} height={80} fill="none" {...props}>
    <path
      fill="url(#microscope_svg__a)"
      d="M19 74a3 3 0 0 1 3-3h36a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1H20a1 1 0 0 1-1-1z"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      fill="url(#microscope_svg__b)"
      fillRule="evenodd"
      d="m42.645 33.089 1.344 1.69a4.33 4.33 0 0 0 3.208 1.635l1.23.052a2.17 2.17 0 0 1 2.056 1.868l.164 1.15a12.08 12.08 0 0 1-2.66 9.405l-.272.33a2.17 2.17 0 0 1-2.95.372l-2.116-1.545a2 2 0 0 0-3.112 1.098l-3.269 12.2c-.565 2.11 1.054 4.165 3.175 3.686 8.37-1.892 15.598-8.653 18.113-18.04 3.06-11.416-1.862-22.956-11.218-27.908q-.004.24-.068.48z"
      clipRule="evenodd"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <rect
      width={21}
      height={3}
      x={22.248}
      y={41.596}
      fill="#fff"
      fillOpacity={0.8}
      stroke="#fff"
      rx={1.5}
      transform="rotate(15 22.248 41.596)"
    />
    <rect
      width={13}
      height={21}
      x={33.619}
      y={14.619}
      fill="#fff"
      fillOpacity={0.8}
      stroke="#fff"
      rx={1.5}
      transform="rotate(15 33.62 14.62)"
    />
    <path
      fill="#fff"
      fillOpacity={0.8}
      stroke="#fff"
      d="m30.887 35.628 6.761 1.812-.388 1.449a1.5 1.5 0 0 1-1.837 1.06l-3.864-1.035a1.5 1.5 0 0 1-1.06-1.837zM38.008 5.96a1.5 1.5 0 0 1 1.837-1.06l5.796 1.553a1.5 1.5 0 0 1 1.06 1.837l-2.458 9.176-8.693-2.33zM46.06 58.01l7.082 12.49H40.5V59.467c0-3.04 4.056-4.11 5.56-1.456Z"
    />
    <defs>
      <linearGradient
        id="microscope_svg__a"
        x1={85.5}
        x2={85.753}
        y1={81.286}
        y2={67.837}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4DA7A6" />
        <stop offset={1} stopColor="#A6D9D7" />
      </linearGradient>
      <linearGradient
        id="microscope_svg__b"
        x1={57.15}
        x2={106.589}
        y1={104.856}
        y2={15.299}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4DA7A6" />
        <stop offset={1} stopColor="#A6D9D7" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgMicroscope
