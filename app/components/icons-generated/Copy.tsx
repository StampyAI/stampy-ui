import * as React from 'react'
import type {SVGProps} from 'react'
const SvgCopy = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="#788492"
      strokeLinecap="round"
      d="M12 19h6M13.5 16.5H11A2.5 2.5 0 0 0 8.5 19v0a2.5 2.5 0 0 0 2.5 2.5h2.5M16.5 21.5H19a2.5 2.5 0 0 0 2.5-2.5v0a2.5 2.5 0 0 0-2.5-2.5h-2.5"
    />
    <rect width={8} height={3} x={8} y={1} stroke="#788492" strokeLinecap="round" rx={1.5} />
    <path
      fill="#788492"
      d="M4 3a1 1 0 0 1 1-1h3v1H5v18h2a.5.5 0 0 1 0 1H5a1 1 0 0 1-1-1zM16 3h3v11.5a.5.5 0 0 0 1 0V3a1 1 0 0 0-1-1h-3z"
    />
  </svg>
)
export default SvgCopy
