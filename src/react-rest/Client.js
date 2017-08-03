import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { createClient } from 'fetch-plus'
import plusJson from 'fetch-plus-json'

class Counter {
  count = 0

  increment = fn => {
    this.count += 1
    fn(this.count)
  }

  decrement = fn => {
    this.count -= 1
    fn(this.count)
  }
}

class Client extends Component {
  state = { active: 0 }

  counter = new Counter()

  static propTypes = {
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    url: PropTypes.string.isRequired,
    headers: PropTypes.object,
  }

  static defaultProps = {
      headers: {},
    }

  static contextTypes = {
    rest: PropTypes.object,
  }

  static childContextTypes = {
    rest: PropTypes.object.isRequired,
  }

  handleStart = arg => {
    this.counter.increment(active => this.setState({ active }))
    return arg
  }

  handleEnd = arg => {
    this.counter.decrement(active => this.setState({ active }))
    return arg
  }

  getChildContext = () => {
    const { url, headers } = this.props

    const client = createClient(url, { headers }, [plusJson()])

    return {
      rest: {
        ...this.context.rest,
        client,
        path: '',
        start: this.handleStart,
        end: this.handleEnd,
      }
    }
  }

  render = () => {
    const { component, render, children } = this.props

    return (
      component ? (
        React.createElement(component)
      ) : render ? (
        render()
      ) : children ? (
        typeof children === 'function' ? (
          children()
        ) : !Array.isArray(children) || children.length ? (
          React.cloneElement(React.Children.only(children))
        ) : null
      ) : null
    )
  }
}

export default Client
