import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class DebouncedInput extends Component {
  handler = false

  static propTypes = {
    delay: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    delay: 1000,
    onChange: () => {}
  }

  handleDebounce = event => {
    const { delay, onChange } = this.props
    event.persist()
    if(this.handler) clearTimeout(this.handler)
    this.handler = setTimeout(() => onChange(event), delay)
  }

  render = () => {
    const {
      delay,
      onChange,
      ...props,
    } = this.props

    return (<input {...props} onChange={this.handleDebounce}  />)
  }
}

export default DebouncedInput
