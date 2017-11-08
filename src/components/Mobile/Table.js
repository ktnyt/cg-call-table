import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, WindowScroller } from 'react-virtualized'

import Icon from './Icon'

import { findPropValue } from 'utils'

const cellHeight = 64

class Table extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    characters: PropTypes.array.isRequired,
    calltable: PropTypes.array.isRequired,
  }

  render = () => {
    const { width, characters, calltable } = this.props

    const getCharacter = findPropValue(characters, 'id')

    const table = calltable.map(({ id, caller, callee, called, remark }) => ({
      id,
      caller: getCharacter(caller),
      callee: getCharacter(callee),
      called,
      remark,
    }))

    const renderer = ({ key, index, style }) => {
      if(index === table.length) {
        return (<div key={key} style={style}></div>)
      }

      const { caller, callee, called } = table[index]

      return (
        <div key={key} style={style}>
          <Icon size={cellHeight - 6} selected character={caller} />
          <div style={{ float: 'left', width: width - cellHeight * 2 - 2, height: cellHeight }}>
            <div className={`bubble ${caller.type}`} style={{
                width: width - cellHeight * 2 - 4 - 15,
                height: cellHeight - 4,
                margin: '2px 0',
                borderRadius: 5,
                position: 'relative',
                left: 15,
              }}>
              <p>{called}</p>
            </div>
          </div>
          <Icon size={cellHeight - 6} selected character={callee} />
        </div>
      )
    }

    return (
      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <List
            autoHeight
            width={width}
            height={height}
            rowCount={table.length + 1}
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
