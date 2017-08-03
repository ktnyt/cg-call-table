export const width = 720
export const cellWidth = width / 4
export const cellHeight = 24
export const marginWidth = innerWidth => (innerWidth - width) / 2

export const fontSize = '0.8em'

export const cellColor = {
  cute: ['#f8adcc', '#fcc9de'],
  cool: ['#9ab3ff', '#ccdaff'],
  pasn: ['#fee3b3', '#feeccc'],
  rest: ['#d9d9d9', '#eaeaea'],
}

export const getCellColor = (character, index) => cellColor[character.type][index % 2]

export const buttonStyle = {
  float: 'left',
  border: 'solid 1px #ccc',
  backgroundColor: '#eee',
  cursor: 'pointer',
  padding: 5,
  width: cellHeight,
  height: cellHeight,
  color: '#555',
  fontSize,
}

export const disabledButtonStyle = {
  ...buttonStyle,
  opacity: .4,
  cursor: 'not-allowed',
}

export const getCellStyle = (character, index) => ({
  float: 'left',
  border: 'none',
  backgroundColor: getCellColor(character, index),
  padding: 3,
  width: cellWidth - 6,
  height: cellHeight - 6,
  fontSize,
})

export const filterStyle = {
  float: 'left',
  border: 'solid 1px #ccc',
  padding: 3,
  width: cellWidth - 8,
  height: cellHeight - 8,
  fontSize,
}

export const getMarginStyle = innerWidth => ({
  float: 'left',
  border: 'none',
  width: marginWidth(innerWidth),
  height: cellHeight - 6,
})

export const inherit = {
  color: 'inherit',
  fontSize: 'inherit',
}
