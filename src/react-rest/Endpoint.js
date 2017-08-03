import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Handlers from './Handlers'

import { objectEq } from './utils'

class Endpoint extends Component {
  state = { data: false }
  handlers = {}

  static propTypes = {
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),

    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    identifier: PropTypes.string,
    params: PropTypes.object,
    fetchOnMount: PropTypes.bool,
    suppressUpdate: PropTypes.bool,
    noPersist: PropTypes.bool,
  }

  static defaultProps = {
    identifier: '',
    params: {},
    fetchOnMount: false,
    suppressUpdate: false,
    noPersist: false,
  }

  static contextTypes = {
    rest: PropTypes.shape({
      client: PropTypes.object.isRequired,
      path: PropTypes.string.isRequired,
      start: PropTypes.func.isRequired,
      end: PropTypes.func.isRequired,
    }),
  }

  static childContextTypes = {
    rest: PropTypes.object.isRequired,
  }

  getChildContext = () => ({
    rest:{
      ...this.context.rest,
      path: this.props.noPersist ? this.context.rest.path : this.constructPath(),
    }
  })

  constructPath = () => {
    const { path: propsPath } = this.props
    const { path: contextPath } = this.context.rest

    return propsPath[0] === '/' ? propsPath : `${contextPath}/${propsPath}`
  }

  componentWillMount = () => {
    const { identifier, params, fetchOnMount } = this.props
    const { client, start, end } = this.context.rest
    const path = this.constructPath()

    this.handlers = new Handlers(client, path)
    .decorate(start, end)
    .bindParams(params)
    .bindIdentifier(identifier)
    .bindCallback(data => this.setState({ data }))

    if(fetchOnMount) this.handlers.fetch()
  }

  componentWillReceiveProps = (nextProps, nextContext) => {
    const {
      path: prevPath,
      identifier: prevIdentifier,
      params: prevParams,
    } = this.props

    const {
      path: nextPath,
      identifier: nextIdentifier,
      params: nextParams,
      suppressUpdate,
    } = nextProps

    const { client, start, end } = this.context.rest
    const path = this.constructPath()

    if(prevPath !== nextPath || prevIdentifier !== nextIdentifier || !objectEq(prevParams, nextParams)) {
      this.handlers = new Handlers(client, path)
      .decorate(start, end)
      .bindParams(nextParams)
      .bindIdentifier(nextIdentifier)
      .bindCallback(data => this.setState({ data }))

      if(!suppressUpdate) this.handlers.fetch(data => this.setState({ data }))
    }
  }

  render = () => {
    const { component, render, children, name } = this.props
    const { data } = this.state

    const handlers = this.handlers
    const props = { [name]: { data, handlers } }

    return (
      component ? (
        React.createElement(component, props)
      ) : render ? (
        render(props)
      ) : children ? (
        typeof children === 'function' ? (
          children(props)
        ) : !Array.isArray(children) || children.length ? (
          React.cloneElement(React.Children.only(children), props)
        ) : null
      ) : null
    )
  }
}

export default Endpoint
