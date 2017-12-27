import React, { Fragment } from 'react'
import injectSheet from 'react-jss'

const Filters = ({ onChangeCaller, onChangeCallee, onChangeCalled }) => (
  <Fragment>
    <input type='text' onChange={onChangeCaller} />
    <input type='text' onChange={onChangeCallee} />
    <input type='text' onChange={onChangeCalled} />
  </Fragment>
)

export default Filters
