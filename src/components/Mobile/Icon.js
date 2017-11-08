import React from 'react'

import Images from './Images'

import { getCellColor } from 'styles'

const Square = ({ children, size }) => (
  <div style={{
      position: 'relative',
      top: (size - (size / Math.sqrt(2))) / 2,
      left: (size - (size / Math.sqrt(2))) / 2,
      width: size / Math.sqrt(2),
      height: size / Math.sqrt(2),
      fontSize: '0.7em',
      textAlign: 'center',
      lineHeight: `${size / Math.sqrt(2)}px`,
      }}>
    <span style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        lineHeight: 'normal',
      }}>
      {children}
    </span>
  </div>
)

const Icon = ({ character, size=72, selected=false, onClick=e=>e }) => {
  const backgroundSize = size * (100 / 86)
  const ratio = size / 86
  const left = -7 * ratio
  const top = -5 * ratio

  const background = character.id in Images ? {
    backgroundImage: `url(${Images[character.id]})`,
  } : {
    backgroundColor: getCellColor(character, 0)
  }

  return (
    <div className={`circle active ${selected ? 'focus' : 'blur'}`} style={{
        float: 'left',
        width: size,
        height: size,
        border: `solid 3px ${getCellColor(character, 0)}`,
        ...background,
        backgroundSize,
        backgroundPosition: `${left}px ${top}px`,
        cursor: onClick ? 'pointer' : 'auto',
      }} onClick={onClick}>
      {Images.hasOwnProperty(character.id) ? null : <Square size={size}>{character.name}</Square>}
    </div>
  )
}

export default Icon
