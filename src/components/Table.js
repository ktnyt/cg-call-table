import React from 'react'
import injectSheet from 'react-jss'

import { List, WindowScroller } from 'react-virtualized'

import Entry from './Entry'

const Table = ({ table }) => (
  <WindowScroller>
    {({ height, scrollTop }) => (
      <List
        autoHeight
        width={600}
        height={height}
        rowCount={table.length}
        rowHeight={24}
        rowRenderer={({ key, index, style }) => (
          <div key={key} style={style}>
            <Entry even={index % 2 === 0} {...table[index]} />
          </div>
        )}
        scrollTop={scrollTop}
      />
    )}
  </WindowScroller>
)

export default Table
