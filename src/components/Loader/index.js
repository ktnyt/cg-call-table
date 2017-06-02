import React, { Component } from 'react'
import './loading.css'
import Cute from './cute.png'
import Cool from './cool.png'
import Pasn from './pasn.png'

const index = Math.floor(Math.random() * 3)

class Loader extends Component {
  render = () => {
    const img = [
      <img src={Cute} width={100} alt='' className='ld ld-spin' />,
      <img src={Cool} width={100} alt='' className='ld ld-heartbeat' />,
      <img src={Pasn} width={100} alt='' className='ld ld-bounce' />,
    ][index]

    return (
      <div hidden={!this.props.visible} style={{
          ...this.props.style,
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'white',
        }}>
        <div style={{
            position: 'absolute',
            top: (window.innerHeight - 100) / 2,
            right: (window.innerWidth - 100) / 2,
          }}>
          {img}
        </div>
      </div>
    )
  }
}

export default Loader
