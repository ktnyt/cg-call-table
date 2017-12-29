import React from 'react'
import injectSheet from 'react-jss'

const styles = theme =>  ({
  container: {
    margin: 'auto',
    width: theme.width,
  },
})

const View = ({ classes, children }) => (
  <div className={classes.container}>
    {children}
  </div>
)

export default injectSheet(styles)(View)
