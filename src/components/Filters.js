import React, { Component, Fragment } from 'react'
import injectSheet from 'react-jss'

const style = theme => ({
  container: {
    float: 'left',
    padding: theme.cell.padding,
    border: 'solid 1px #ccc',
    width: theme.cell.width - theme.cell.height / 2 - theme.cell.padding * 2 - 2,
    height: theme.cell.height - theme.cell.padding * 2 - 2,
    fontSize: (theme.cell.height - theme.cell.padding * 2 - 2) / 1.5,
  },
  called: {
    float: 'left',
    padding: theme.cell.padding,
    border: 'solid 1px #ccc',
    width: theme.cell.width - theme.cell.padding * 2 - (theme.full ? 0 : theme.cell.height) - 2,
    height: theme.cell.height - theme.cell.padding * 2 - 2,
    fontSize: (theme.cell.height - theme.cell.padding * 2 - 2) / 1.5,
  },
  remark: {
    float: 'left',
    padding: theme.cell.padding,
    border: 'solid 1px #ccc',
    width: theme.cell.width - theme.cell.padding * 2 - theme.cell.height - 2,
    height: theme.cell.height - theme.cell.padding * 2 - 2,
    fontSize: (theme.cell.height - theme.cell.padding * 2 - 2) / 1.5,
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
  button: {
    float: 'left',
    border: 'solid 1px #ccc',
    backgroundColor: '#eee',
    cursor: 'pointer',
    padding: 0,
    width: theme.cell.height,
    height: theme.cell.height,
    color: '#555',
  },
})

class Filters extends Component {
  render = () => {
    const {
      classes,
      theme,
      onChangeCaller,
      onChangeCallee,
      onChangeCalled,
      onChangeRemark,
      onClick,
    } = this.props

    return (
      <Fragment>
        <div className={classes.container}>
          <input
            type='text'
            ref='caller'
            className={classes.input}
            tabIndex={1}
            placeholder='呼ぶ側'
            onChange={onChangeCaller}
          />
        </div>

        <button className={classes.button} tabIndex={6} onClick={event => {
          const caller = this.refs.caller.value
          const callee = this.refs.callee.value
          this.refs.caller.value = callee
          this.refs.callee.value = caller
          this.refs.caller.addEventListener('change', onChangeCaller)
          this.refs.callee.addEventListener('change', onChangeCallee)
          this.refs.caller.dispatchEvent(new Event('change'))
          this.refs.callee.dispatchEvent(new Event('change'))
        }}>
          <i style={{ fontSize: 18 }} className='material-icons'>swap_horiz</i>
        </button>
    
        <div className={classes.container}>
          <input
            type='text'
            ref='callee'
            className={classes.input}
            tabIndex={2}
            placeholder='呼ばれる側'
            onChange={onChangeCallee}
          />
        </div>
    
        <div className={classes.called}>
          <input
            type='text'
            ref='called'
            className={classes.input}
            tabIndex={3}
            placeholder='呼び方'
            onChange={onChangeCalled}
          />
        </div>
    
        {theme.full && (
          <div className={classes.remark}>
            <input
              type='text'
              ref='remark'
              className={classes.input}
              tabIndex={4}
              placeholder='備考'
              onChange={onChangeRemark}
            />
          </div>
        )}
    
        <button className={classes.button} tabIndex={5} onClick={event => {
          event.target.caller = this.refs.caller
          event.target.callee = this.refs.callee
          event.target.called = this.refs.called
          if(theme.full) {
            event.target.remark = this.refs.remark
          }
          onClick(event)
        }}>
          <i style={{ fontSize: 18 }} className='material-icons'>add</i>
        </button>
      </Fragment>
    )
  }
}

export default injectSheet(style)(Filters)
