import React from 'react'
import injectSheet, { withTheme } from 'react-jss'

import handlers from '../handlers'

const styles = theme => ({
  container: {
    float: 'left',
    padding: theme.cell.padding,
    width: theme.cell.width - theme.cell.padding * 2,
    height: theme.cell.height - theme.cell.padding * 2,
    fontSize: (theme.cell.height - theme.cell.padding * 2) / 1.5,
  },
  input: {
    border: 'none',
    width: '100%',
    height: '100%',
    fontSize: 'inherit',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    '&:focus': {
      outline: 'none',
    },
  },
})

const submitCalled = id => event => {
  event.preventDefault()
  const called = event.target.called.value
  handlers.calltable.edit(id, { called })
}

const Entry = ({ classes, theme, even, id, caller, callee, called, remark }) => (
  <div>
    <div style={{ backgroundColor: theme.pallete[caller.type][even ? 0 : 1] }} className={classes.container}>{caller.name}</div>
    <div style={{ backgroundColor: theme.pallete[callee.type][even ? 0 : 1] }} className={classes.container}>{callee.name}</div>
    <div style={{ backgroundColor: theme.pallete[callee.type][even ? 0 : 1] }} className={classes.container}>
      <form onSubmit={submitCalled(id)}>
        <input className={classes.input} type='text' name='called' defaultValue={called} />
      </form>
    </div>
  </div>
)

export default injectSheet(styles)(withTheme(Entry))
