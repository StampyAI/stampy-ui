import {useState} from 'react'
import './dropdown.css'
import {ChevronRight} from '../icons-generated'

interface DropDownProps {
  title: string
  content: JSX.Element
}

export default function DropDown({title, content}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="drop-down">
      <button onClick={() => setIsOpen(!isOpen)} className="drop-down-header">
        <p className="large-bold teal-500">{title}</p>
        <ChevronRight
          height={24}
          width={24}
          className={`${isOpen ? 'rotate-90' : ''} drop-down-chevron`}
        />
      </button>
      <div className={`drop-down-content ${isOpen ? 'open' : ''}`}>{content}</div>
    </div>
  )
}
