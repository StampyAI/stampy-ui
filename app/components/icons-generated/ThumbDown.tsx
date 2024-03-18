import type {SVGProps} from 'react'
const SvgThumbDown = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      stroke="#1D9089"
      d="M5 2h6v6.58l-1.304 2.027-.362 2.63a.9.9 0 0 1-.288.545.84.84 0 0 1-.56.218h-.057c-.341 0-.668-.14-.91-.39a1.36 1.36 0 0 1-.376-.943V10H3.714c-.454 0-.89-.188-1.211-.521A1.81 1.81 0 0 1 2 8.222v-3.11c0-.826.317-1.616.88-2.2A2.95 2.95 0 0 1 5 2ZM14 8a1 1 0 0 1-1 1h-2V2h2a1 1 0 0 1 1 1z"
    />
  </svg>
)
export default SvgThumbDown
