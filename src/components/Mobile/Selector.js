import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Icon from './Icon'

import { findPropValue, split } from 'utils'

const filterTrue = (selected, characters) => Object.keys(selected).sort().filter(id => selected[id]).map(findPropValue(characters, 'id'))

const Minimized = ({ width, selected, onClick=e=>e }) => (
  <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      overflowY: 'hidden',
      overflowX: 'scroll',
      width,
      height: 64,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      cursor: 'pointer',
    }} onClick={onClick}>
    <div style={{
        width: selected.length * 70,
        height: 64,
      }}>
      {selected.map(character => (
        <Icon key={character.id} character={character} selected={true} size={64} />
      ))}
    </div>
  </div>
)

class Selector extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    characters: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: o=>o,
  }

  constructor(props) {
    super(props)
    const { characters } = this.props
    const selected = {}
    characters.forEach(character => { selected[character.id] = false })
    const minimized = false
    this.state = { minimized, selected }
  }

  render = () => {
    const { width, height, characters, onChange } = this.props
    const { minimized, selected } = this.state

    const handleClick = ({ id }) => event => {
      const flag = selected[id]
      const next = { ...selected, [id]: !flag }
      this.setState({ selected: next })
      onChange(filterTrue(next, characters))
    }

    const n = (width - (width % 72) ) / 72 - 1

    return minimized ? (
      <Minimized width={width} onClick={e => this.setState({ minimized: false })} selected={filterTrue(selected, characters)} />
    ) : (
      <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width,
          height,
          margin: 'auto',
          overflow: 'scroll',
          backgroundColor: 'white',
        }}>
        <div><i className='material-icons' onClick={e => this.setState({ minimized: true })}>close</i></div>
        <table style={{ width: '100%', height: '100%' }}>
          <tbody>
            {split(characters, n).map((row, index) => (
              <tr key={index}>
                {row.map((character, index) => (
                  <td key={index}>
                    <Icon character={character} selected={selected[character.id]} onClick={handleClick(character)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Selector
