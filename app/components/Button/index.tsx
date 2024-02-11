import {ReactNode} from 'react'
import './button.css'

type ButtonProps = {
    action?: string | (() => void)
    children?: ReactNode
    className?: string
}
const Button = ({children, action, className}: ButtonProps) => {
    const classNamea = "button " + (className||"")
    if (typeof(action) === 'string') {
        return <a href={action} className={classNamea}>{children}</a>
    }
    return <button className={classNamea} onClick={action}>{children}</button>
}

export default Button
