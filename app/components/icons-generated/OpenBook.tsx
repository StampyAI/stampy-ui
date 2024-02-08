import * as React from 'react'
import type {SVGProps} from 'react'
const SvgOpenBook = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke="#1D9089"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5h7a2 2 0 0 1 2 2v12H3zm9 2a2 2 0 0 1 2-2h7v14h-9zm0 0v13"
    />
    <path
      fill="#1D9089"
      fillRule="evenodd"
      d="M11 20a1 1 0 1 0 2 0h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7c-.768 0-1.47.289-2 .764A3 3 0 0 0 10 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1zM4 6v12h7V7a1 1 0 0 0-1-1zm9 1v11h7V6h-6a1 1 0 0 0-1 1"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgOpenBook
