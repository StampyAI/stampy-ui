import type {SVGProps} from 'react'
const SvgDonateHeart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={27}
    fill="none"
    viewBox="0 2 24 24"
    {...props}
  >
    <g transform="scale(.3)">
      <path
        fill="url(#donate_heart_svg__a)"
        d="M71.428 52.143 55.582 54.49c-1.812.269-3.463-1.197-4.305-2.824C48.331 45.973 38.407 41.43 30 41.43H8.714a3 3 0 0 0-3 3V58.6a3 3 0 0 0 3 3h18.684a3 3 0 0 1 .896.137l18.766 5.87a3 3 0 0 0 1.608.052l29.044-7.1c1.343-.328 2.33-1.54 2.134-2.909-.732-5.107-4.023-6.135-8.418-5.507"
      />
      <path
        fill="#fff"
        fillOpacity={0.8}
        stroke="#7AC0BE"
        strokeWidth={3}
        d="M49.35 34.026c2.576 3.003 5.933 5.174 8.908 7.098q.685.442 1.337.869M49.35 34.026l9.97 8.385m-9.97-8.385c-3.128-3.646-4.601-7.353-4.563-11.351.045-4.354 3.59-7.89 7.892-7.89 2.803 0 4.843 1.312 6.166 2.585l.347-.36-.347.36c.64.616 1.67.616 2.31 0 1.323-1.273 3.364-2.584 6.167-2.584 4.301 0 7.847 3.535 7.892 7.887.04 4-1.432 7.704-4.563 11.35-2.577 3.006-5.935 5.178-8.91 7.102q-.685.44-1.335.868M49.35 34.026l11.33 8.385m-1.085-.418-.275.418m.275-.418-.275.418m.275-.418a.74.74 0 0 0 .81 0m-1.085.418c.413.27.947.27 1.36 0m-.274-.418.274.418m-.274-.418.274.418"
      />
      <rect
        width={20.429}
        height={30.429}
        x={3.357}
        y={36.214}
        fill="#fff"
        fillOpacity={0.8}
        stroke="#7AC0BE"
        rx={2.5}
      />
      <defs>
        <linearGradient
          id="donate_heart_svg__a"
          x1={80.312}
          x2={31.837}
          y1={67.693}
          y2={16.85}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#17736E" />
          <stop offset={1} stopColor="#7AC0BE" />
        </linearGradient>
      </defs>
    </g>
  </svg>
)
export default SvgDonateHeart
