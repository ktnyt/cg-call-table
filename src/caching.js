import handlers from './handlers'

const dictify = data => data.map(({ id, ...rest }) => ({ [id]: rest })).reduce((prev, next) => ({ ...prev, ...next }))

handlers.characters.bind(data => localStorage.setItem('characters', JSON.stringify(dictify(data))))
handlers.character_readings.bind(data => localStorage.setItem('character_readings', JSON.stringify(data)))
handlers.calltable.bind(data => localStorage.setItem('calltable', JSON.stringify(data)))

const getItem = key => {
  const item = localStorage.getItem(key)
  if(item) {
    return JSON.parse(item)
  }
  return null
}

export const getCache = () => {
  return {
    characters: getItem('characters'),
    character_readings: getItem('character_readings'),
    calltable: getItem('calltable'),
  }
}
