import type {SVGProps} from 'react'
const SvgPencil = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="#788492"
      strokeLinejoin="round"
      d="M4.23 15.896a.5.5 0 0 0-.121.196l-1.583 4.75a.5.5 0 0 0 .632.632l4.75-1.583a.5.5 0 0 0 .196-.12l14.25-14.25a.5.5 0 0 0 0-.708l-3.167-3.167a.5.5 0 0 0-.707 0z"
    />
    <path stroke="#788492" d="m16.458 4.375 3.167 3.167" />
  </svg>
)
export default SvgPencil
