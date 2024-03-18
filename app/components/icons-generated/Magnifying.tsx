import type {SVGProps} from 'react'
const SvgMagnifying = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      fill="#AFB7C2"
      fillRule="evenodd"
      d="M10.044 10.706a5.5 5.5 0 1 1 .662-.662.5.5 0 0 1 .148.102l3.5 3.5a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1-.102-.148M11 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgMagnifying
