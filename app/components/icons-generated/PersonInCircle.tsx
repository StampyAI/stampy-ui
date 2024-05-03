import type {SVGProps} from 'react'
const SvgPersonInCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} fill="none" {...props}>
    <circle cx={20} cy={20} r={20} fill="#EDFAF9" />
    <path
      fill="#1D9089"
      fillRule="evenodd"
      d="M23 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-1 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0M25 27a1 1 0 0 0 1-1 6 6 0 0 0-12 0 1 1 0 0 0 1 1zm-5-6a5 5 0 0 0-5 5h10q0-.515-.1-1a5 5 0 0 0-4.9-4"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgPersonInCircle
