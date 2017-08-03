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

class AddCell extends Component {
  static propTypes = {
    caller: characterShape,
    callee: characterShape,
    index: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onAdd: PropTypes.func.isRequired,
  }

  render = () => {
    const { caller, callee, index, width, onAdd } = this.props

    const callerStyle = getStyle(width, caller, index)
    const calleeStyle = getStyle(width, callee, index)

    const body = { caller: caller.id, callee: callee.id, called: '', remark: '' }

    return (
      <div style={{ margin: 'auto', width, cursor: 'pointer' }}>
        <div style={callerStyle}>{caller.name}</div>
        <div style={calleeStyle}>{callee.name}</div>
        <div style={calleeStyle} onClick={event => onAdd(body)}>呼称を追加</div>
        <div style={calleeStyle}></div>
      </div>
    )
  }
}

export default AddCell
