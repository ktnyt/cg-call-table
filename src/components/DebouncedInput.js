import React, { Component } from 'react'

export class DebouncedInput extends Component {
  state = { handler: false }

  handleDebounce = (fn, delay) => event => {
    event.persist()
    if(this.state.handler) { clearTimeout(this.state.handler) }
    const handler = setTimeout(() => fn(event), delay)
    this.setState({ handler })
  }

  render = () => {
    const {
      delay,
      onChange,
      ...props,
    } = this.props
    return (<input onChange={this.handleDebounce(onChange, delay ? delay : 1000)} {...props} />)
  }
}

export default DebouncedInput
