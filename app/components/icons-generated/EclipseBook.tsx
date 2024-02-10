import type {SVGProps} from 'react'
const SvgEclipseBook = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={1056} height={348} fill="none" {...props}>
    <mask
      id="eclipse-book_svg__a"
      width={1056}
      height={348}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <rect width={1056} height={348} fill="#1A817C" rx={6} />
    </mask>
    <g mask="url(#eclipse-book_svg__a)">
      <path
        stroke="#7AC0BE"
        d="M869.5 175.233c0 53.365-42.762 96.616-95.5 96.616s-95.5-43.251-95.5-96.616 42.762-96.617 95.5-96.617 95.5 43.251 95.5 96.617Z"
      />
      <path
        stroke="#7AC0BE"
        d="M909.5 175.233c0 75.713-60.671 137.081-135.5 137.081s-135.5-61.368-135.5-137.081c0-75.714 60.671-137.082 135.5-137.082S909.5 99.52 909.5 175.233Z"
      />
      <path
        stroke="#7AC0BE"
        d="M949.5 175.233c0 98.061-78.579 177.546-175.5 177.546s-175.5-79.485-175.5-177.546C598.5 77.171 677.079-2.314 774-2.314s175.5 79.485 175.5 177.547Z"
      />
      <path
        stroke="#7AC0BE"
        d="M989.5 175.233c0 120.41-96.488 218.011-215.5 218.011s-215.5-97.601-215.5-218.011S654.988-42.779 774-42.779s215.5 97.602 215.5 218.012Z"
      />
      <path
        stroke="#7AC0BE"
        d="M1029.5 174.221c0 142.758-114.397 258.477-255.5 258.477S518.5 316.979 518.5 174.221 632.897-84.256 774-84.256s255.5 115.719 255.5 258.477Z"
      />
      <g filter="url(#eclipse-book_svg__b)">
        <ellipse cx={774} cy={175.233} fill="#4DA7A6" rx={56} ry={56.651} />
      </g>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M772 191.419c0 1.117.895 2.023 2 2.023s2-.906 2-2.023h16c1.105 0 2-.906 2-2.024V161.07a2.01 2.01 0 0 0-2-2.023h-14a5.94 5.94 0 0 0-4 1.545 5.94 5.94 0 0 0-4-1.545h-14c-1.105 0-2 .905-2 2.023v28.325c0 1.118.895 2.024 2 2.024zm-14-28.326v24.279h14v-22.256a2.01 2.01 0 0 0-2-2.023zm18 2.023v22.256h14v-24.279h-12c-1.105 0-2 .906-2 2.023"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <filter
        id="eclipse-book_svg__b"
        width={160}
        height={161.302}
        x={694}
        y={110.581}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={16} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.12549 0 0 0 0 0.172549 0 0 0 0 0.34902 0 0 0 0.1 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1264_4885" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_1264_4885" result="shape" />
      </filter>
    </defs>
  </svg>
)
export default SvgEclipseBook
