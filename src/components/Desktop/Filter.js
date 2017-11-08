import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Endpoints } from 'react-rest'
import { flatten, mapToProp } from 'utils'

import DebouncedInput from './DebouncedInput'

class Filter extends Component {
  state = { data: [] }

  static propTypes = {
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: event => event,
  }

  render = () => {
    const { onChange, ...props } = this.props

    return (
      <Endpoints configs={{
          characters: { path: 'characters' },
          units: { path: 'units' },
        }} render={({ characters, units }) => {
          const handleChange = ({ target: { value: search } }) => {
            if(!search.length) onChange([])
            Promise.all([
              characters.handlers.browse({ search }).then(mapToProp('id')),
              units.handlers.browse({ search }).then(mapToProp('members')).then(flatten),
            ]).then(flatten).then(onChange)
          }
          return (
            <DebouncedInput type='text' delay={100} {...props} onChange={handleChange} />
          )
        }} />
    )
  }
}

export default Filter
