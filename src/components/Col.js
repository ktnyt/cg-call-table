import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'

const styles = theme => {
  const { padding } = theme.cell
  const width = theme.cell.width - padding * 2
  const height = theme.cell.height - padding * 2
  const fontSize = height / 1.5
  const backgroundColor = ({ type, even }) => theme.color[type][even ? 0 : 1]

  return {
    container: {
      float: 'left',
      padding,
      width,
      height,
      fontSize,
      backgroundColor,
    }
  }
}

const injector = injectSheet(styles)

injector.propTypes = {
  type: PropTypes.oneOf(['cute', 'cool', 'pasn', 'rest']).isRequired,
  even: PropTypes.bool,
}

injector.defaultProps = {
  even: false,
}

const Col = ({ type, even, classes, children }) => (
  <div className={classes.container}>{children}</div>
)

Col.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
}

export default injector(Col)
