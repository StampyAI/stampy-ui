import type {SVGProps} from 'react'
const SvgThumbUp = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      stroke="#1D9089"
      d="M11 14H5V7.42l1.304-2.027.362-2.63a.9.9 0 0 1 .288-.545.84.84 0 0 1 .56-.218h.057c.341 0 .668.14.91.39.24.25.376.59.376.943V6h3.429c.454 0 .89.188 1.211.521.322.334.502.785.503 1.257v3.11c0 .826-.317 1.617-.88 2.2A2.95 2.95 0 0 1 11 14ZM2 8a1 1 0 0 1 1-1h2v7H3a1 1 0 0 1-1-1z"
    />
  </svg>
)
export default SvgThumbUp
