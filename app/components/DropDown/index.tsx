import {ReactNode, useState} from 'react'
import {ChevronRight} from '~/components/icons-generated'
import './dropdown.css'

interface DropDownProps {
  title: string
  children: ReactNode
}

export default function DropDown({title, children}: DropDownProps) {
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
      <div className={`drop-down-content ${isOpen ? 'open' : ''}`}>{children}</div>
    </div>
  )
}
