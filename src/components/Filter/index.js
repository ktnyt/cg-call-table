import React, { Component } from 'react'
import _ from 'lodash'

import Tag from './Tag'

const firstOverflow = (widths, width) => _.findIndex(_.range(0, widths.length).map(index => _.sum(_.slice(widths, 0, index + 1))), sum => sum >= width)

const lastOverflow = (widths, width, start=0) => {
  const first = firstOverflow(_.slice(widths, start), width)
  return first < 0 ? start : lastOverflow(widths, width, start + first)
}

const computeOverflows = (widths, width, start=0) => {
  const first = firstOverflow(_.slice(widths, start), width)
  return first < 0 ? [] : [start + first, ...computeOverflows(widths, width, start + first)]
}

class Filter extends Component {
  state = { values: [], widths: [], suggestions: [], suggested: 0, focused: false }

  tagRefs = []

  componentDidMount = () => {
    if(this.props.focusOnMount) {
      this.refs.input.focus()
    }
  }

  componentDidUpdate = (props, state) => {
    if(!_.isEqual(state.values, this.state.values)) {
      this.setState({ widths: this.tagRefs.filter(_.isObject).map(tag => tag.size().width) })
      this.props.onChange(this.state.values)
    }

    if(!_.isEqual(state.widths, this.state.widths) && !_.includes(this.state.widths, -1)) {

    }
  }

  addValue = value => {
    const { values, widths } = this.state

    if(_.isArray(value)) {
      const list = value.filter(item => !_.includes(values, item))
      this.setState({
        values: _.concat(values, list),
        widths: _.concat(widths, _.times(list.length, () => -1)),
        suggestions: [],
        suggested: 0,
      })
    } else {
      if(_.includes(values, value)) return
      this.setState({
        values: [...values, value],
        widths: [...widths, -1],
        suggestions: [],
        suggested: 0,
      })
    }
  }

  popValue = () => {
    const { values, widths } = this.state
    this.setState({
      values: _.slice(values, 0, values.length - 1),
      widths: _.slice(widths, 0, widths.length - 1),
      suggested: 0,
    })
  }

  removeValue = index => {
    const { values, widths } = this.state
    this.setState({
      values: [..._.slice(values, 0, index), ..._.slice(values, index + 1, values.length)],
      widths: [..._.slice(widths, 0, index), ..._.slice(widths, index + 1, widths.length)],
    })
  }

  moveUp = () => {
    const { suggested } = this.state
    if(suggested > 0) this.setState({ suggested: suggested - 1 })
  }

  moveDown = () => {
    const { suggestions, suggested } = this.state
    if(suggested < suggestions.length - 1) this.setState({ suggested: suggested + 1 })
  }

  handleOnRemove = index => this.removeValue(index)

  handleOnKeyDown = event => {
    const { target: { value } } = event

    switch(event.keyCode) {
    case 13:
    case 9:
      const { suggestions, suggested } = this.state

      if(suggestions.length) {
        event.preventDefault()
        this.addValue(suggestions[suggested].value)
        this.refs.input.value = ''
      }
      break
    case 8:
      if(!value.length) {
        event.preventDefault()
        this.popValue()
      }
      break
    case 38:
      this.moveUp()
      break
    case 40:
      this.moveDown()
      break
    case 80:
      if(event.ctrlKey) this.moveUp()
      break
    case 78:
      if(event.ctrlKey) this.moveDown()
      break
    default:
      break
    }
  }

  handleOnChange = event => this.props.suggest(event.target.value)
  .then(list => _.slice(list.filter(item => !_.includes(this.state.values, item.value)), 0, 10))
  .then(suggestions => this.setState({ suggestions }))

  handleOnHover = suggested => this.setState({ suggested })

  handleOnClick = suggested => {
    this.addValue(this.state.suggestions[suggested].value)
    this.refs.input.value = ''
    this.refs.input.focus()
  }

  render = () => {
    const {
      width,
      minWidth,
      minHeight,
      placeholder,
    } = this.props

    const {
      values,
      widths,
      suggestions,
      suggested,
      focused,
    } = this.state

    const suggesting = focused && suggestions.length
    const computing = _.includes(widths, -1)

    const overflows = computeOverflows(widths, width - 14)
    const lastRowWidth = _.sum(_.slice(widths, _.last(overflows))) + 14

    const rows = overflows.length + 1 + (lastRowWidth < (width - minWidth) ? 0 : 1)
    const computedHeight = rows * 28 + 2
    const height = _.max([minHeight - 2, computedHeight])

    const inputWidth = lastRowWidth < width - minWidth ? width - lastRowWidth : width - 14

    const tags = values.map((text, index) => (
      <Tag
        ref={tag => this.tagRefs[index] = tag}
        key={index}
        text={text}
        onRemove={event => event.preventDefault() || this.handleOnRemove(index)}
      />
    ))

    const ordinary_style = {
      width: width - 10,
      clear: 'left',
      padding: 4,
      cursor: 'pointer',
      color: 'black',
      backgroundColor: 'white',
      fontSize: '12px',
      borderTop: '1px solid #ccc',
    }

    const selected_style = {
      width: width - 10,
      clear: 'left',
      padding: 4,
      cursor: 'pointer',
      color: 'white',
      backgroundColor: '#3085e6',
      fontSize: '12px',
      borderTop: '1px solid #ccc',
    }

    const list = suggestions.map((suggestion, index) => (
      <div
        key={index}
        onMouseOver={event => this.handleOnHover(index)}
        onClick={event => this.handleOnClick(index)}
        style={index === suggested ? selected_style : ordinary_style}>
        {suggestion.label}
      </div>
    ))

    return (
      <div style={{
        width: width - 6,
        height: height,
        float: 'left',
        position: 'relative',
        overflow: computing ? 'hidden' : 'visible',
        padding: '4px 0 0 4px',
        border: '1px solid #ccc',
        boxShadow: `0 0 1px rgba(0, 0, 0, 0.4) inset${suggesting ? ', 0 0 2px rgba(0, 0, 0, 0.4)' : ''}`,
        zIndex: 'inherit',
      }}>
        {tags}
        <input
          ref='input'
          className='disable_focus'
          type='text'
          placeholder={placeholder}
          onKeyDown={this.handleOnKeyDown}
          onChange={this.handleOnChange}
          onFocus={e => this.setState({ focused: true })}
          onBlur={e => this.setState({ focused: false })}
          style={{
            opacity: computing ? 0 : 1,
            width: inputWidth,
            height: 16,
            clear: 'left',
            padding: '4px 4px 4px 0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            border: 0,
            fontSize: '12px',
            verticalAlign: 'top',
          }} />
        <div style={{
          width: width - 2,
          position: 'absolute',
          top: height + 4,
          left: -1,
          overflow: 'scroll',
          borderLeft: '1px solid #ccc',
          borderBottom: '1px solid #ccc',
          borderRight: '1px solid #ccc',
          borderBottomLeftRadius: 3,
          borderBttomRightRadius: 3,
          boxShadow: suggesting ? '0 2px 2px rgba(0, 0, 0, 0.4)' : 'none',
        }}>
          {list}
        </div>
      </div>
    )
  }
}

export default Filter
