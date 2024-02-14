import type {SVGProps} from 'react'
const SvgEclipseIndividual = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={320} height={224} fill="none" {...props}>
    <g filter="url(#eclipse-individual_svg__a)">
      <ellipse cx={160} cy={62.358} fill="#1A817C" rx={40} ry={40.231} />
    </g>
    <path
      fill="#fff"
      d="M166 54.312c0 3.333-2.686 6.035-6 6.035s-6-2.702-6-6.035 2.686-6.034 6-6.034 6 2.701 6 6.034m-2 0c0 2.222-1.791 4.023-4 4.023s-4-1.8-4-4.023 1.791-4.023 4-4.023 4 1.801 4 4.023M170 76.44c1.105 0 2-.901 2-2.012 0-6.666-5.373-12.07-12-12.07s-12 5.404-12 12.07c0 1.11.895 2.011 2 2.011zm-10-12.07c-4.838 0-8.873 3.455-9.8 8.046q-.198.977-.2 2.012h20q-.002-1.036-.2-2.012c-.927-4.59-4.962-8.046-9.8-8.046"
    />
    <path
      stroke="#A6D9D7"
      d="M239.5 62.358c0 44.165-35.596 79.963-79.5 79.963s-79.5-35.798-79.5-79.963 35.596-79.962 79.5-79.962 79.5 35.798 79.5 79.962Z"
    />
    <path
      stroke="#A6D9D7"
      d="M279.5 62.358c0 66.384-53.505 120.194-119.5 120.194S40.5 128.742 40.5 62.358C40.5-4.025 94.005-57.835 160-57.835S279.5-4.025 279.5 62.358Z"
    />
    <path
      stroke="#A6D9D7"
      d="M319.5 62.358c0 88.603-71.413 160.425-159.5 160.425S.5 150.961.5 62.358 71.913-98.067 160-98.067 319.5-26.245 319.5 62.358Z"
    />
    <defs>
      <filter
        id="eclipse-individual_svg__a"
        width={128}
        height={128.462}
        x={96}
        y={14.127}
        filterUnits="userSpaceOnUse"
      >
        <feFlood result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={16} />
        <feGaussianBlur stdDeviation={12} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.12549 0 0 0 0 0.172549 0 0 0 0 0.34902 0 0 0 0.2 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1264_4864" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_1264_4864" result="shape" />
      </filter>
    </defs>
  </svg>
)
export default SvgEclipseIndividual
