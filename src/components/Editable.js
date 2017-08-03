import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Editable extends Component {
  state = { value: '' }

  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: '',
    onChange: event => event,
  }

  componentWillMount = () => {
    const { value } = this.props
    this.setState({ value })
  }

  componentWillReceiveProps = nextProps => {
    const { value: nextValue } = nextProps
    const { value: currValue } = this.props

    if(nextValue !== currValue) {
      this.setState({ value: nextValue })
    }
  }

  handleOnChange = event => {
    const { onChange } = this.props
    const { value } = event.target
    this.setState({ value })
    onChange(event)
  }

  render = () => {
    const props = this.props
    const { value } = this.state

    return (
      <input type='text' {...props} onChange={this.handleOnChange} value={value} />
    )
  }
}

export default Editable
