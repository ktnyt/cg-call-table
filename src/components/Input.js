import React from 'react'
import injectStyles from 'react-jss'

const Input = ({ classes, onSubmit, ...props }) => (
  <form onSubmit={onSubmit}>
    <input {...props} />
  </form>
)

export default injectStyles(Input)

