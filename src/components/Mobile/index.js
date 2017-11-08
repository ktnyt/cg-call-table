import React, { Component } from 'react'
import { Endpoints } from 'react-rest'

import Table from './Table'
import Selector from './Selector'

import { toProp } from 'utils'

class Mobile extends Component {
  state = { selected: [] }

  handleChange = selected => this.setState({ selected })

  render = () => {
    const { width, height } = this.props
    const { selected } = this.state

    const caller = selected.map(toProp('id')).join(',')
    const callee = selected.map(toProp('id')).join(',')
    const union = selected.length === 1

    return (
      <Endpoints configs={{
          characters: { path: 'characters' },
          calltable: { path: 'calltable', params: { caller, callee, union } },
        }} render={({ characters, calltable }) => {
          if(!characters.data || !calltable.data) return null

          return (
            <div>
              <Table width={width} characters={characters.data} calltable={calltable.data} />
              <Selector width={width} height={height} characters={characters.data} onChange={selected => this.setState({ selected })} />
            </div>
          )
        }} />
    )
  }
}

export default Mobile
