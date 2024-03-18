import type {SVGProps} from 'react'
const SvgOpenBook = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="#1D9089"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4.5h6.5A2.5 2.5 0 0 1 12 7v12a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5M14.5 4.5H21a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.5.5h-8.5a.5.5 0 0 1-.5-.5V7a2.5 2.5 0 0 1 2.5-2.5M12 6v14.5"
    />
  </svg>
)
export default SvgOpenBook
