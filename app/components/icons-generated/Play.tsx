import type {SVGProps} from 'react'
const SvgPlay = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} fill="none" {...props}>
    <path
      stroke="#fff"
      strokeLinecap="square"
      strokeLinejoin="round"
      d="M8.267 3.577A.5.5 0 0 0 7.5 4v24a.5.5 0 0 0 .767.423l19-12a.5.5 0 0 0 0-.846z"
    />
  </svg>
)
export default SvgPlay
