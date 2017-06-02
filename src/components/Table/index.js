import React, { Component } from 'react'
import { List } from 'react-virtualized'

const palette = {
  cute: ['#F8ADCC', '#FCC9DE'],
  cool: ['#9AB3FF', '#CCDAFF'],
  pasn: ['#FEE3B3', '#FEECCC'],
  rest: ['#D9D9D9', '#EAEAEA']
}

const types = {
  キュート: 'cute',
  クール: 'cool',
  パッション: 'pasn',
}

class Table extends Component {
  render = () => {
    const {
      width,
      height,
      idols,
      table,
    } = this.props

    const get_idol = name => idols.find(idol => idol.name === name)
    const get_type = name => get_idol(name) ? types[get_idol(name).type] : 'rest'
    const get_color = (name, index) => palette[get_type(name)][index % 2]

    const common = {
      width: (width / 3) - 6,
      float: 'left',
      padding: 3,
    }

    const columns = table.map(({ caller, callee, called }, index) => [
      <div key='caller' style={{ ...common, backgroundColor: get_color(caller, index) }}>{caller}</div>,
      <div key='callee' style={{ ...common, backgroundColor: get_color(callee, index) }}>{callee}</div>,
      <div key='called' style={{ ...common, backgroundColor: get_color(callee, index) }}>{called}</div>,
    ])

    const renderer = ({ key, index, isScrolling, isVisible, style }) => (
      <div key={key} style={{ ...style, height: 30 }}>{columns[index]}</div>
    )

    return <List width={width} height={height} rowCount={table.length} rowHeight={30} rowRenderer={renderer} />
  }
}

export default Table
