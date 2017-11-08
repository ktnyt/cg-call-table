import React, { Component } from 'react'
import { Client, middleware } from 'react-rest'

import Desktop from './Desktop'
import Mobile from './Mobile'

import Auth from 'Auth'

const API_HOST = process.env.REACT_APP_API_HOST

const auth = new Auth()

class App extends Component {
  state = { width: window.innerWidth, height: window.innerHeight }

  componentWillMount = () => {
     window.addEventListener('resize', event => {
       const width = window.innerWidth
       const height = window.innerHeight
       this.setState({ width, height })
     })
  }

  render = () => {
    const { width, height } = this.state
    const headers = auth.authorizationHeader()

    return (
      <Client base={API_HOST} middleware={[
          middleware.addHeadersMiddleware(headers),
          middleware.jsonMiddleware,
        ]}>
        {width >= 768 ? (
          <Desktop auth={auth} width={width} />
        ) : (
          <Mobile auth={auth} width={width} height={height} />
        )}
      </Client>
    )
  }
}

export default App
