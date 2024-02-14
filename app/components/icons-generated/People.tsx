import type {SVGProps} from 'react'
const SvgPeople = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={72} height={72} fill="none" {...props}>
    <path
      fill="url(#people_svg__a)"
      d="M22.5 35.429c5.503 0 9.964-4.478 9.964-10s-4.46-10-9.964-10c-5.503 0-9.964 4.477-9.964 10s4.461 10 9.964 10"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      fill="url(#people_svg__b)"
      d="M22.5 40.429c-10.234 0-18.68 7.636-19.911 17.505-.171 1.37.968 2.495 2.353 2.495h35.116c1.385 0 2.525-1.125 2.354-2.495-1.233-9.869-9.677-17.505-19.912-17.505"
      style={{
        mixBlendMode: 'multiply',
      }}
    />
    <path
      fill="#fff"
      fillOpacity={0.6}
      stroke="#A6D9D7"
      d="M57.678 25.429c0 5.248-4.239 9.5-9.464 9.5s-9.465-4.252-9.465-9.5 4.24-9.5 9.465-9.5 9.464 4.251 9.464 9.5Zm-28.88 32.567c1.201-9.62 9.435-17.067 19.416-17.067s18.214 7.447 19.415 17.067c.128 1.028-.727 1.933-1.857 1.933H30.656c-1.13 0-1.986-.905-1.858-1.933Z"
    />
    <defs>
      <linearGradient
        id="people_svg__a"
        x1={42.429}
        x2={-6.541}
        y1={60.429}
        y2={44.478}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4DA7A6" />
        <stop offset={1} stopColor="#D3F2F0" />
      </linearGradient>
      <linearGradient
        id="people_svg__b"
        x1={42.429}
        x2={-6.541}
        y1={60.429}
        y2={44.478}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4DA7A6" />
        <stop offset={1} stopColor="#D3F2F0" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgPeople
