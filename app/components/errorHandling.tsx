import {Component, ErrorInfo} from 'react'

type Props = {title: string; children: JSX.Element[]}
type State = {hasError: boolean}
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h4>Error loading &quot;{this.props.title}&quot;</h4>
    }
    return this.props.children
  }
}
