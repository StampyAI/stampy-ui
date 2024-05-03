import type {SVGProps} from 'react'
const SvgBotSmall = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      stroke="#788492"
      strokeLinecap="square"
      strokeLinejoin="round"
      d="M2 4.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5z"
    />
    <path stroke="#788492" strokeLinecap="round" d="M5.5 7.5v1M10.5 7.5v1" />
    <path
      fill="#788492"
      d="m5.146 4.354.354.353L6.207 4l-.353-.354zm-.792-2.208a.5.5 0 1 0-.708.708zm1.5 1.5-1.5-1.5-.708.708 1.5 1.5zM10.854 4.354l-.354.353L9.793 4l.353-.354zm.792-2.208a.5.5 0 0 1 .708.708zm-1.5 1.5 1.5-1.5.708.708-1.5 1.5z"
    />
    <circle cx={12} cy={2.5} r={1} fill="#788492" />
    <circle cx={4} cy={2.5} r={1} fill="#788492" />
  </svg>
)
export default SvgBotSmall
