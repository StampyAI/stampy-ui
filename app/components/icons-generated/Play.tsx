import type {SVGProps} from 'react'
const SvgPlay = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      fill="#788492"
      fillRule="evenodd"
      d="M3.517 1.124a1 1 0 0 1 1.017.03l9.5 6a1 1 0 0 1 0 1.691l-9.5 6A1 1 0 0 1 3 14V2a1 1 0 0 1 .517-.876M4 2v12l9.5-6z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgPlay
