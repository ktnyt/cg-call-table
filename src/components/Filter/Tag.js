import React, { Component } from 'react'

class Tag extends Component {
  size = () => ({ width: this.container.clientWidth, height: this.container.clientHeight })

  render = () => {
    const {
      text,
      onRemove,
    } = this.props

    return (
      <div ref={div => { this.container = div }} style={{
        float: 'left',
        padding: '0 4px 4px 0',
        }}>
        <div style={{
          float: 'left',
          backgroundColor: '#ebf5ff',
          color: '#007eff',
          border: '1px solid #c2e0ff',
          borderRadius: 2,
          display: 'inline-block',
          fontSize: '12px',
        }}>
          <div style={{
            padding: '2px 4px',
            display: 'inline-block',
            cursor: 'pointer',
            borderBottomLeftRadius: 2,
            borderTopLeftRadius: 2,
            borderRight: '1px solid #c2e0ff',
            fontSize: '12px',
          }} onClick={onRemove}>
            ✕
          </div>
          <div style={{
            padding: 2,
            display: 'inline-block',
            fontSize: '12px',
          }}>{text}</div>
        </div>
      </div>
    )
  }
}

export default Tag
