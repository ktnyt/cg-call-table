import React from 'react'
import { Endpoint } from 'react-rest'
import { mapToProp } from 'utils'

import DebouncedInput from './DebouncedInput'

const Filter = ({ onChange, placeholder='', style={} }) => (
  <Endpoint name='characters' path='characters' render={({ characters }) => (
      <DebouncedInput type='text' delay={100} placeholder={placeholder} style={style} onChange={
          ({ target: { value: search } }) => search.length ? characters.handlers.browse({ search }).then(mapToProp('id')).then(onChange) : onChange([])
      } />
    )} />
)

export default Filter
