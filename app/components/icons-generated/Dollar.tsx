import type {SVGProps} from 'react'
const SvgDollar = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path stroke="#1D9089" strokeLinecap="round" d="M12 2v20" />
    <path
      stroke="#1D9089"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
    />
  </svg>
)
export default SvgDollar
