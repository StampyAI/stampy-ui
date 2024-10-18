import type {SVGProps} from 'react'
const SvgBook = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={80} height={80} fill="none" {...props}>
    <path
      fill="url(#book_svg__a)"
      d="M6 23a3 3 0 0 1 3-3h62a3 3 0 0 1 3 3v40a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <mask id="book_svg__b" fill="#fff">
      <path
        fillRule="evenodd"
        d="M13.995 15.071a2 2 0 0 0-1.995 2V58a2 2 0 0 0 2 2h52a2 2 0 0 0 2-2V17.071a2 2 0 0 0-1.995-2l-19.988-.054a6 6 0 0 0-6.017 6 6 6 0 0 0-6.017-6z"
        clipRule="evenodd"
      />
    </mask>
    <path
      fill="#fff"
      fillOpacity={0.8}
      fillRule="evenodd"
      d="M13.995 15.071a2 2 0 0 0-1.995 2V58a2 2 0 0 0 2 2h52a2 2 0 0 0 2-2V17.071a2 2 0 0 0-1.995-2l-19.988-.054a6 6 0 0 0-6.017 6 6 6 0 0 0-6.017-6z"
      clipRule="evenodd"
    />
    <path
      fill="#7AC0BE"
      d="M12 17.071h-1zm1.995-2 .002 1zM12 58h1zm28 2v-1zm26 0v1zm2-2h-1zm0-40.929h-1zm-1.995-2 .003-1zm-19.988-.054.002-1zm-12.034 0 .003 1zM13 17.07a1 1 0 0 1 .997-1l-.005-2a3 3 0 0 0-2.992 3zM13 58V17.071h-2V58zm1 1a1 1 0 0 1-1-1h-2a3 3 0 0 0 3 3zm26 0H14v2h26zm0 2h26v-2H40zm26 0a3 3 0 0 0 3-3h-2a1 1 0 0 1-1 1zm3-3V17.071h-2V58zm0-40.929a3 3 0 0 0-2.992-3l-.005 2a1 1 0 0 1 .997 1zm-2.992-3-19.989-.054-.005 2 19.989.054zm-19.989-.054a7 7 0 0 0-7.019 7h2a5 5 0 0 1 5.014-5zm-12.033 2a5 5 0 0 1 5.014 5h2a7 7 0 0 0-7.02-7zm-19.989.054 19.99-.055-.006-2-19.99.055z"
      mask="url(#book_svg__b)"
    />
    <defs>
      <linearGradient
        id="book_svg__a"
        x1={74}
        x2={2.669}
        y1={66}
        y2={27.223}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#1A817C" />
        <stop offset={1} stopColor="#A6D9D7" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgBook
