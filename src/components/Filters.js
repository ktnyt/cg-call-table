import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DebouncedInput from './DebouncedInput'
import Filter from './Filter'

import { onEnter } from 'utils'

import { filterStyle, buttonStyle, disabledButtonStyle, getMarginStyle, inherit } from 'styles'

class Filters extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    onCallerChange: PropTypes.func.isRequired,
    onCalleeChange: PropTypes.func.isRequired,
    onCalledChange: PropTypes.func.isRequired,
    onRemarkChange: PropTypes.func.isRequired,
    handleAdd: PropTypes.func.isRequired,
  }

  render = () => {
    const {
      width,
      onCallerChange,
      onCalleeChange,
      onCalledChange,
      onRemarkChange,
      addable,
      handleAdd,
    } = this.props

    const marginStyle = getMarginStyle(width)

    const handleCalledChange = ({ target: { value: called } }) => onCalledChange(called)
    const handleRemarkChange = ({ target: { value: remark } }) => onRemarkChange(remark)

    return (
      <div>
        <div style={marginStyle}></div>
        <Filter placeholder='呼ぶ側' style={filterStyle} onChange={onCallerChange} onKeyPress={onEnter(handleAdd)} />
        <Filter placeholder='呼ばれる側' style={filterStyle} onChange={onCalleeChange} onKeyPress={onEnter(handleAdd)} />
        <DebouncedInput type='text' delay={100} placeholder='呼び方' style={filterStyle} onChange={handleCalledChange} onKeyPress={onEnter(handleAdd)} />
        <DebouncedInput type='text' delay={100} placeholder='備考' style={filterStyle} onChange={handleRemarkChange} onKeyPress={onEnter(handleAdd)} />
        <div style={marginStyle}>
          <button style={addable ? buttonStyle : disabledButtonStyle} disabled={!addable} onClick={handleAdd}>
            <i className='material-icons' style={inherit}>add</i>
          </button>
        </div>
      </div>
    )
  }
}

export default Filters
