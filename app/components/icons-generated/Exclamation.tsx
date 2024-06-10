import type {SVGProps} from 'react'
const SvgExclamation = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      fill="#D40000"
      d="M8.5 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M7.5 5v4a.5.5 0 0 0 1 0V5a.5.5 0 0 0-1 0"
    />
    <path
      fill="#D40000"
      fillRule="evenodd"
      d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12m0-1A5 5 0 1 0 8 3a5 5 0 0 0 0 10"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgExclamation
