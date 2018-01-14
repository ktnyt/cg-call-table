import handlers from './handlers'

const version = '1.0.0'

handlers.characters.bind(data => localStorage.setItem('characters', JSON.stringify(data)))
handlers.units.bind(data => localStorage.setItem('units', JSON.stringify(data)))
handlers.calltable.bind(data => localStorage.setItem('calltable', JSON.stringify(data)))

const getItem = key => {
  const item = localStorage.getItem(key)
  if(item) {
    return JSON.parse(item)
  }
  return null
}

export const getCache = () => {
  const cacheVersion = localStorage.getItem('version')
  if(cacheVersion !== version) {
    return {
      characters: null,
      units: null,
      calltable:null,
    }
    localStorage.setItem('version', version)
  }
  return {
    characters: getItem('characters'),
    units: getItem('units'),
    calltable: getItem('calltable'),
  }
}
