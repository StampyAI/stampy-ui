import * as React from 'react'
const SvgUndo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 -960 960 960"
    {...props}
  >
    <path
      d="M280-200v-80h284q63 0 109.5-40T720-420t-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420t-69.5 157T564-200z"
      className="undo_svg__gray"
    />
  </svg>
)
export default SvgUndo
