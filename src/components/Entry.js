import React, { Fragment } from 'react'

import handlers from '../handlers'

const submitCalled = id => event => {
  event.preventDefault()
  const called = event.target.called.value
  handlers.calltable.edit(id, { called })
}

const Entry = ({ id, caller, callee, called, remark }) => (
  <Fragment>
    <div style={{ float: 'left' }}>{caller.name}</div>
    <div style={{ float: 'left' }}>{callee.name}</div>
    <div style={{ float: 'left' }}>
      <form onSubmit={submitCalled(id)}>
        <input type='text' name='called' defaultValue={called} />
      </form>
    </div>
  </Fragment>
)

export default Entry
