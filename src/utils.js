export const flatten = array => array.reduce((prev, curr) => [...prev, ...curr], [])
export const mapToProp = prop => array => array.map(element => element[prop])
export const findPropValue = (array, prop) => value => array.find(element => element[prop] === value)
export const onEnter = fn => event => { if(event.key === 'Enter') fn(event) }

export const palette = {
  cute: ['#F8ADCC', '#FCC9DE'],
  cool: ['#9AB3FF', '#CCDAFF'],
  pasn: ['#FEE3B3', '#FEECCC'],
  rest: ['#D9D9D9', '#EAEAEA']
}

export const getStyle = (width, character, index) => ({
  width: (width / 4) - 6,
  height: 30 - 6,
  float: 'left',
  padding: 3,
  fontSize: '1rem',
  border: 'none',
  backgroundColor: getColor(character, index),
})

export const getColor = (character, index) => palette[character.type][index % 2]
