import type {SVGProps} from 'react'
const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      fill="#788492"
      fillRule="evenodd"
      d="M11 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-1 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0M13 15a1 1 0 0 0 1-1 6 6 0 0 0-12 0 1 1 0 0 0 1 1zM8 9a5 5 0 0 0-5 5h10q0-.514-.1-1A5 5 0 0 0 8 9"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgPerson
