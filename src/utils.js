export const flatten = array => array.reduce((prev, curr) => [...prev, ...curr], [])
export const toProp = prop => element => element[prop]
export const mapToProp = prop => array => array.map(toProp(prop))
export const findPropValue = (array, prop) => value => array.find(element => element[prop] === value)
export const onEnter = fn => event => { if(event.key === 'Enter') fn(event) }
export const split = (array, n) => array.reduce(([head, ...tail], curr) => head.length === n ? [[curr], head, ...tail] : [[...head, curr], ...tail], [[]]).reverse()
