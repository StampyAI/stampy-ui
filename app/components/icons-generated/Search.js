import * as React from 'react'
const SvgSearch = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    style={{
      enableBackground: 'new 0 0 512 512',
    }}
    xmlSpace="preserve"
    {...props}
  >
    <circle
      cx={206.5}
      cy={207.5}
      r={202.5}
      style={{
        fill: '#e0ffff',
      }}
    />
    <path
      d="M509.7 498.3 360.5 349.1c34.3-37 54.6-86.5 54.6-141.1 0-114.9-93.1-208-208-208S0 93.1 0 208s93.1 208 207.1 208c54.5 0 104.1-21.2 141.2-55.5l149.2 149.2c2.4 1.5 4.4 2.3 5.6 2.3s4.1-.8 5.7-2.3c4-3.2 4-8.2.9-11.4zM207.1 400c-105.9 0-192-86.1-192-192s86.1-192 192-192 192 86.1 192 192-85.2 192-192 192z"
      style={{
        fill: '#333',
      }}
    />
  </svg>
)
export default SvgSearch
