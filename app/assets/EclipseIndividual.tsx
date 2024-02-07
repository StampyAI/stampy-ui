interface EclipseIndividualProps {
  /**
   * Classname
   */
  classname: string
}
const EclipseIndividual = ({classname}: EclipseIndividualProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="320"
      height="224"
      viewBox="0 0 320 224"
      fill="none"
      className={classname}
    >
      <g filter="url(#filter0_d_1264_4864)">
        <ellipse cx="160" cy="62.3584" rx="40" ry="40.2312" fill="#1A817C" />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M166 54.3121C166 57.645 163.314 60.3468 160 60.3468C156.686 60.3468 154 57.645 154 54.3121C154 50.9793 156.686 48.2775 160 48.2775C163.314 48.2775 166 50.9793 166 54.3121ZM164 54.3121C164 56.5341 162.209 58.3353 160 58.3353C157.791 58.3353 156 56.5341 156 54.3121C156 52.0902 157.791 50.289 160 50.289C162.209 50.289 164 52.0902 164 54.3121Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M170 76.4393C171.105 76.4393 172 75.5387 172 74.4278C172 67.762 166.627 62.3584 160 62.3584C153.373 62.3584 148 67.762 148 74.4278C148 75.5387 148.895 76.4393 150 76.4393H170ZM160 64.37C155.162 64.37 151.127 67.8253 150.2 72.4162C150.069 73.0662 150 73.7389 150 74.4278H170C170 73.7389 169.931 73.0662 169.8 72.4162C168.873 67.8253 164.838 64.37 160 64.37Z"
        fill="white"
      />
      <path
        d="M239.5 62.3584C239.5 106.523 203.904 142.321 160 142.321C116.096 142.321 80.5 106.523 80.5 62.3584C80.5 18.1937 116.096 -17.604 160 -17.604C203.904 -17.604 239.5 18.1937 239.5 62.3584Z"
        stroke="#A6D9D7"
      />
      <path
        d="M279.5 62.3584C279.5 128.742 225.995 182.552 160 182.552C94.0047 182.552 40.5 128.742 40.5 62.3584C40.5 -4.0254 94.0047 -57.8352 160 -57.8352C225.995 -57.8352 279.5 -4.0254 279.5 62.3584Z"
        stroke="#A6D9D7"
      />
      <path
        d="M319.5 62.3583C319.5 150.961 248.087 222.783 160 222.783C71.9133 222.783 0.5 150.961 0.5 62.3583C0.5 -26.2446 71.9133 -98.0665 160 -98.0665C248.087 -98.0665 319.5 -26.2446 319.5 62.3583Z"
        stroke="#A6D9D7"
      />
      <defs>
        <filter
          id="filter0_d_1264_4864"
          x="96"
          y="14.1272"
          width="128"
          height="128.462"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="16" />
          <feGaussianBlur stdDeviation="12" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.12549 0 0 0 0 0.172549 0 0 0 0 0.34902 0 0 0 0.2 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1264_4864" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1264_4864"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
export const EclipseIndividualIcon = EclipseIndividual
