import {Component} from 'react'
import PropTypes from 'prop-types'

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
  }

  constructor(props: {children: JSX.Element[]; title: string}) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h4>Error loading &quot;{this.props.title}&quot;</h4>
    }
    return this.props.children
  }
}
