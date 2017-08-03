import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Handlers from './Handlers'

import { objectEq } from './utils'

const defaults = {
  identifier: '',
  params: {},
  fetchOnMount: false,
  suppressUpdate: false,
}

const constructPath = (path0, path1) => {
  return path0[0] === '/' ? path0 : `${path1}/${path0}`
}

class Endpoints extends Component {
  state = {}
  handlers = {}

  static propTypes = {
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),

    specs: PropTypes.object.isRequired,
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
    rest: {
      ...this.context.rest,
    }
  })

  constructor(props, context) {
    super(props, context)

    const { specs } = this.props

    const names = Object.keys(specs)

    const state = {}

    for(const name of names) {
      state[name] = false
    }

    this.state = state
  }

  componentWillMount = () => {
    const { specs } = this.props
    const { client, start, end, path: contextPath } = this.context.rest

    const names = Object.keys(specs)

    for(const name of names) {
      const {
        path: specPath,
        identifier,
        params,
        fetchOnMount,
      } = { ...defaults, ...specs[name] }

      const path = constructPath(specPath, contextPath)

      this.handlers[name] = new Handlers(client, path)
      .decorate(start, end)
      .bindParams(params)
      .bindIdentifier(identifier)
      .bindCallback(data => this.setState({ [name]: data }))

      if(fetchOnMount) this.handlers[name].fetch()
    }
  }

  componentWillReceiveProps = (nextProps, nextContext) => {
    const { specs: prevSpecs } = this.props
    const { specs: nextSpecs } = nextProps

    const { client, start, end, path: contextPath } = this.context.rest

    const names = Object.keys(nextSpecs)

    for(const name of names) {
      const {
        path: prevPath,
        identifier: prevIdentifier,
        params: prevParams,
      } = { ...defaults, ...prevSpecs[name] }

      const {
        path: nextPath,
        identifier: nextIdentifier,
        params: nextParams,
        suppressUpdate,
      } = { ...defaults, ...nextSpecs[name] }

      if(prevPath !== nextPath || prevIdentifier !== nextIdentifier || !objectEq(prevParams, nextParams)) {
        this.handlers[name] = new Handlers(client, constructPath(nextPath, contextPath))
        .decorate(start, end)
        .bindParams(nextParams)
        .bindIdentifier(nextIdentifier)
        .bindCallback(data => this.setState({ [name]: data }))

        if(!suppressUpdate) this.handlers[name].fetch()
      }
    }
  }

  render = () => {
    const { component, render, children } = this.props
    const props = {}

    const names = Object.keys(this.state)

    for(const name of names) {
      const data = this.state[name]
      const handlers = this.handlers[name]
      props[name] = { data, handlers }
    }

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

export default Endpoints
