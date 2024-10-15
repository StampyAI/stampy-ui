import type {SVGProps} from 'react'
const SvgPuzzlePieces = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={80} height={80} fill="none" {...props}>
    <path
      fill="url(#puzzle_pieces_svg__a)"
      d="M8 15.571A2.57 2.57 0 0 1 10.571 13H32.43A2.57 2.57 0 0 1 35 15.571V22h-2.571a4.5 4.5 0 1 0 0 9H35v6a3 3 0 0 0 3 3h21.429A2.57 2.57 0 0 1 62 42.571V64.43A2.57 2.57 0 0 1 59.429 67H10.57A2.57 2.57 0 0 1 8 64.429z"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      fill="#fff"
      fillOpacity={0.8}
      stroke="#fff"
      d="M45 28.5h.5v-6.929c0-1.145.926-2.071 2.066-2.071h21.868c1.14 0 2.066.926 2.066 2.071V43.43a2.07 2.07 0 0 1-2.066 2.071H47.623c-1.173 0-2.123-.887-2.123-2v-7h-3.01a3.995 3.995 0 0 1-3.99-4c0-2.21 1.788-4 3.99-4z"
    />
    <defs>
      <linearGradient
        id="puzzle_pieces_svg__a"
        x1={93.5}
        x2={114.696}
        y1={121}
        y2={-17.003}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4DA7A6" />
        <stop offset={1} stopColor="#A6D9D7" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgPuzzlePieces
