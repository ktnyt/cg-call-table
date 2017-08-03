import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, WindowScroller } from 'react-virtualized'
import Editable from './Editable'

import { cellHeight, getCellStyle, buttonStyle, getMarginStyle, inherit } from 'styles'

import { findPropValue } from 'utils'

class Table extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    characters: PropTypes.object.isRequired,
    calltable: PropTypes.object.isRequired,
  }

  render = () => {
    const { characters, calltable, width } = this.props

    const getCharacter = findPropValue(characters.data, 'id')

    const table = calltable.data.map(({ id, caller, callee, called, remark }) => ({
      id,
      caller: getCharacter(caller),
      callee: getCharacter(callee),
      called,
      remark,
    }))

    const renderer = ({ key, index, style }) => {
      const { id, caller, callee, called, remark } = table[index]

      const callerStyle = getCellStyle(caller, index)
      const calleeStyle = getCellStyle(callee, index)
      const marginStyle = getMarginStyle(width)

      const handleRemove = event => calltable.handlers.destroy(id)

      return (
        <div key={key} style={style}>
          <div style={marginStyle}></div>
          <div style={callerStyle}>{caller.name}</div>
          <div style={calleeStyle}>{callee.name}</div>
          <Editable style={calleeStyle} value={called} onChange={({ target: { value: called } }) => calltable.handlers.edit(id, { called })} />
          <Editable style={calleeStyle} value={remark} onChange={({ target: { value: remark } }) => calltable.handlers.edit(id, { remark })} />
          <div style={marginStyle}>
            <button style={buttonStyle} onClick={handleRemove}>
              <i className='material-icons' style={inherit}>delete</i>
            </button>
          </div>
        </div>
      )
    }

    return (
      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <List
            autoHeight
            width={window.innerWidth}
            height={height}
            rowCount={table.length}
            rowHeight={cellHeight}
            rowRenderer={renderer}
            scrollTop={scrollTop}
            />
        )}
      </WindowScroller>
    )
  }
}

export default Table
