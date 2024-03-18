import type {SVGProps} from 'react'
const SvgBoxArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      fill="#1D9089"
      d="M9.636 2a.545.545 0 0 0 0 1.09h2.502L7.614 7.615a.545.545 0 1 0 .772.772l4.523-4.524v2.502a.545.545 0 1 0 1.091 0V2.545A.545.545 0 0 0 13.454 2z"
    />
    <path
      fill="#1D9089"
      d="M12.364 8c.3 0 .545.244.545.545v4.91a.545.545 0 0 1-.545.545H2.545A.545.545 0 0 1 2 13.454V3.637c0-.3.244-.545.545-.545h4.91a.545.545 0 0 1 0 1.09H3.09v8.728h8.727V8.545c0-.3.244-.545.546-.545"
    />
  </svg>
)
export default SvgBoxArrow
