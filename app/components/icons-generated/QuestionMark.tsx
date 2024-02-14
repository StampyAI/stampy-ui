import type {SVGProps} from 'react'
const SvgQuestionMark = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      fill="#788492"
      fillRule="evenodd"
      d="M8 13A5 5 0 1 0 8 3a5 5 0 0 0 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12M5.9 6.8a2.1 2.1 0 1 1 2.6 2.04v.36a.5.5 0 0 1-1 0v-.8a.5.5 0 0 1 .5-.5 1.1 1.1 0 1 0-1.1-1.1.5.5 0 0 1-1 0M8 11.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgQuestionMark
