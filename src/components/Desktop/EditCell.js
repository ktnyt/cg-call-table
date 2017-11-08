import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Endpoint } from 'react-rest'

import Editable from './Editable'

import { getStyle } from 'utils'

const characterShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
})

class EditCell extends Component {
  static propTypes = {
    entry: PropTypes.shape({
      id: PropTypes.string,
      caller: characterShape,
      callee: characterShape,
      called: PropTypes.string,
      remark: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    handlers: PropTypes.object.isRequired,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    onDelete: o => o,
  }

  handleCalledChange = handlers => called => {
    if(called.length) {
      handlers.edit({ called })
    }
  }

  handleBlur = handlers => event => {
    if(event.target.value.length === 0) {
      handlers.destroy(this.props.entry.id).then(() => this.props.onDelete())
    }
  }

  render = () => {
    const { entry, index, width, handlers } = this.props
    const { id, caller, callee, called, remark } = entry

    const callerStyle = getStyle(width, caller, index)
    const calleeStyle = getStyle(width, callee, index)

    console.log(called)

    return (
      <div style={{ margin: 'auto', width }}>
        <div style={callerStyle}>{caller.name}</div>
        <div style={calleeStyle}>{callee.name}</div>
        <Editable style={calleeStyle} value={called} onChange={called => handlers.edit(id, { called })} onBlur={this.handleBlur(handlers)} />
        <Editable style={calleeStyle} value={remark} onChange={remark => handlers.edit(id, { remark })} />
      </div>
    )
  }
}

export default EditCell
