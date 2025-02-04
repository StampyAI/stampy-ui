import type {SVGProps} from 'react'
const SvgBuoy = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <circle cx="12" cy="12" r="5" stroke="#1D9089"/>
    <circle cx="12" cy="12" r="9" stroke="#1D9089"/>
    <path d="M3.5 12H7M17 12H20.5" stroke="#1D9089"/>
    <path d="M12 16.5V20" stroke="#1D9089"/>
    <path d="M12 4V7.5" stroke="#1D9089"/>
    </svg>
)
export default SvgBuoy