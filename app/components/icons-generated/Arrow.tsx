import type {SVGProps} from 'react'
const SvgArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={13} fill="none" {...props}>
    <path
      fill="#788492"
      fillRule="evenodd"
      d="M1.896 4.271a.5.5 0 0 1 .708 0L6 7.668 9.396 4.27a.5.5 0 0 1 .708.708l-3.75 3.75a.5.5 0 0 1-.708 0l-3.75-3.75a.5.5 0 0 1 0-.708"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgArrow
