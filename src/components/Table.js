import React from 'react'
import { withTheme } from 'react-jss'
import { List, WindowScroller } from 'react-virtualized'

import Entry from './Entry'

const Table = ({ theme, table }) => (
  <WindowScroller>
    {({ height, scrollTop }) => (
      <List
        autoHeight
        width={theme.width}
        height={height}
        rowCount={table.length}
        rowHeight={theme.cell.height}
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

export default withTheme(Table)
