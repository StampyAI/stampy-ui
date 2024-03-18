import type {SVGProps} from 'react'
const SvgChatbot = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="#1D9089"
      strokeLinejoin="round"
      d="M21.5 5a.5.5 0 0 0-.5-.5H3a.5.5 0 0 0-.5.5v14a.5.5 0 0 0 .5.5h1.495c-.016.711-.068 1.208-.136 1.554-.085.432-.184.564-.213.592a.5.5 0 0 0 .354.854c2.164 0 3.284-1.53 3.852-3H21a.5.5 0 0 0 .5-.5z"
    />
  </svg>
)
export default SvgChatbot
