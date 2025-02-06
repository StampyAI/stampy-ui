import type {SVGProps} from 'react'
const SvgBuoy = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <circle cx={12} cy={12} r={5.5} stroke="#1D9089" />
    <circle cx={12} cy={12} r={10.5} stroke="#1D9089" />
    <path stroke="#1D9089" d="M2 12h4.5m11 0H22M12 17.5v5M12 2v4.5" />
  </svg>
)
export default SvgBuoy
