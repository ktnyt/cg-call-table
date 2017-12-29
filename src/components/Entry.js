import React, { Component } from 'react'
import injectSheet, { withTheme } from 'react-jss'
import moji from 'moji'

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

const converthk = str => moji(str).convert('ZK', 'HK').toString()
const convertzk = str => moji(str).convert('HK', 'ZK').toString()

class Input extends Component {
  constructor(props) {
    super(props)
    this.state = { value: undefined }
  }

  static defaultProps = {
    onChange: event => event,
  }

  render = () => {
    const { defaultValue, onChange, ...props } = this.props
    const value = this.state.value !== undefined ? this.state.value : defaultValue

    return (
      <input {...props} value={value} onChange={event => {
        onChange(event)
        this.setState({ value: event.target.value })
      }} />
    )
  }
}

class Entry extends Component {
  state = { deleted: false }

  render = () => {
    const { classes, theme, even, id, caller, callee, called, remark } = this.props
    const { deleted } = this.state

    if(deleted) {
      return null
    }

    const editCalled = event => {
      event.preventDefault()
      const value = convertzk(event.target.tagName === 'FORM' ? event.target.input.value : event.target.value)
  
      if(value.length === 0) {
        if(window.confirm('呼称を削除しますか？')) {
          handlers.calltable.destroy(id)
          this.setState({ deleted: true })
        } else {
          if(event.target.tagname === 'FORM') {
            event.target.input.value = called
          } else {
            event.target.value = called
          }
        }
      } else if(value !== called) {
        handlers.calltable.edit(id, { called: value })
      }
    }
  
    const editRemark = event => {
      event.preventDefault()
      const value = convertzk(event.target.tagName === 'FORM' ? event.target.input.value : event.target.value)
  
      if(value !== remark) {
        handlers.calltable.edit(id, { remark: value })
      }
    }
  
    return (
      <div>
        <div style={{ backgroundColor: theme.pallete[caller.type][even ? 0 : 1] }} className={classes.container}>
          {theme.compact ? converthk(caller.name) : caller.name}
        </div>
  
        <div style={{ backgroundColor: theme.pallete[callee.type][even ? 0 : 1] }} className={classes.container}>
          {theme.compact ? converthk(callee.name) : callee.name}
        </div>
  
        <div style={{ backgroundColor: theme.pallete[callee.type][even ? 0 : 1] }} className={classes.container}>
          <form onSubmit={editCalled}>
            <Input
              className={classes.input}
              type='text'
              name='input'
              defaultValue={theme.compact ? converthk(called) : called}
              onBlur={editCalled}
            />
          </form>
        </div>
  
        {theme.full &&
          <div style={{ backgroundColor: theme.pallete[callee.type][even ? 0 : 1] }} className={classes.container}>
            <form onSubmit={editRemark}>
              <Input
                className={classes.input}
                type='text'
                name='input'
                defaultValue={theme.compact ? converthk(remark) : remark}
                onBlur={editRemark}
              />
            </form>
          </div>
        }
      </div>
    )
  }
}

export default injectSheet(styles)(withTheme(Entry))
