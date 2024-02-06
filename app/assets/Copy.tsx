
const Copy = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="50"
      width="72"
      viewBox="0 0 90 90"
      fill="none"
    >
      <g filter="url(#a)">
        <rect
          x="44"
          y="23"
          width="40"
          height="48"
          rx="2"
          fill="#fff"
          shape-rendering="crispEdges"
        />
        <rect
          x="43.5"
          y="22.5"
          width="45"
          height="47"
          rx="5.5"
          stroke="#DFE3E9"
          shape-rendering="crispEdges"
        />
        <path d="M68 55H74" stroke="#788492" stroke-linecap="round" />
        <path
          d="M69.5 52.5H67C65.6193 52.5 64.5 53.6193 64.5 55V55C64.5 56.3807 65.6193 57.5 67 57.5H69.5"
          stroke="#788492"
          stroke-linecap="round"
        />
        <path
          d="M72.5 57.5L75 57.5C76.3807 57.5 77.5 56.3807 77.5 55V55C77.5 53.6193 76.3807 52.5 75 52.5L72.5 52.5"
          stroke="#788492"
          stroke-linecap="round"
        />
        <rect
          x="64"
          y="37"
          width="8"
          height="3"
          rx="1.5"
          stroke="#788492"
          stroke-linecap="round"
        />
        <path
          d="M60 39C60 38.4477 60.4477 38 61 38H64V39H61V57H63C63.2761 57 63.5 57.2239 63.5 57.5C63.5 57.7761 63.2761 58 63 58H61C60.4477 58 60 57.5523 60 57V39Z"
          fill="#788492"
        />
        <path
          d="M72 39H75V50.5C75 50.7761 75.2239 51 75.5 51C75.7761 51 76 50.7761 76 50.5V39C76 38.4477 75.5523 38 75 38H72V39Z"
          fill="#788492"
        />
      </g>
      <defs>
        <filter
          id="a"
          x="0"
          y="0"
          width="216"
          height="128"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="16" />
          <feGaussianBlur stdDeviation="20" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.686275 0 0 0 0 0.717647 0 0 0 0 0.760784 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1156_12852"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1156_12852"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
export const CopyIcon = Copy;
