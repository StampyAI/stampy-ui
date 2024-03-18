import type {SVGProps} from 'react'
const SvgBot = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="#1D9089"
      strokeLinecap="square"
      strokeLinejoin="round"
      d="M3 4.5a.5.5 0 0 0-.5.5v14a.5.5 0 0 0 .5.5h18a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5z"
    />
    <path stroke="#1D9089" strokeLinecap="round" d="M8 9v2M15.5 9v2" />
    <path
      fill="#1D9089"
      d="M7.646 4.354 8 4.707 8.707 4l-.353-.354zM6.354 1.646a.5.5 0 1 0-.708.708zm2 2-2-2-.708.708 2 2zM16.354 4.354 16 4.707 15.293 4l.353-.354zm1.292-2.708a.5.5 0 0 1 .708.708zm-2 2 2-2 .708.708-2 2z"
    />
    <circle cx={18} cy={2} r={1} fill="#1D9089" />
    <circle cx={6} cy={2} r={1} fill="#1D9089" />
  </svg>
)
export default SvgBot
