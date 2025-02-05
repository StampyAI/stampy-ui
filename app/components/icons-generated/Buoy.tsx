import type {SVGProps} from 'react'
const SvgBuoy = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <circle cx={12} cy={12} r={5} stroke="#1D9089" />
    <circle cx={12} cy={12} r={9} stroke="#1D9089" />
    <path stroke="#1D9089" d="M3.5 12H7m10 0h3.5M12 16.5V20M12 4v3.5" />
  </svg>
)
export default SvgBuoy
