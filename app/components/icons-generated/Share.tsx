import type {SVGProps} from 'react'
const SvgShare = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <circle cx={18} cy={5} r={3} stroke="#788492" />
    <circle cx={18} cy={19} r={3} stroke="#788492" />
    <circle cx={6} cy={12} r={3} stroke="#788492" />
    <path stroke="#788492" d="m8.5 10.5 7-3m-7 6 7 3" />
  </svg>
)
export default SvgShare
