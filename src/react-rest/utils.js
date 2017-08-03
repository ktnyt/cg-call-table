export const sortedKeys = object => Object.keys(object).sort()
export const sortedValues = object => Object.keys(object).sort().map(key => object[key])

export const zip = (a, b) => a.length > b.length ? b.map((d, i) => [a[i], d]) : a.map((c, i) => [c, b[i]])
export const arrayEq = (a, b) => zip(a, b).map(([c, d]) => c === d).reduce((p, c) => p && c, true)
export const keysEq = (a ,b) => arrayEq(Object.keys(a), Object.keys(b))
export const valuesEq = (a, b) => arrayEq(sortedValues(a), sortedValues(b))
export const objectEq = (a, b) => keysEq(a, b) && valuesEq(a, b)
