import React, { Component } from 'react'
import { ThemeProvider } from 'react-jss'
import { Client, Endpoint, middleware } from 'react-rest-client'
import { List, WindowScroller } from 'react-virtualized'

import Col from './components/Col'

const width = 800
const cellHeight= 30

const styles = {
  row: {
    width,
  },
  col: {
    float: 'left',
    width: width / 4,
    fontSize: 12,
  },
  input: {
    border: 'none',
    width: '100%',
  }
}

const theme = {
  color: {
    cute: ['#f8adcc', '#fcc9de'],
    cool: ['#9ab3ff', '#ccdaff'],
    pasn: ['#fee3b3', '#feeccc'],
    rest: ['#80fba2', '#b4fcc4'],
  },
  cell: {
    padding: 3,
    width: 200,
    height: 24,
  },
}

const CalltableItem = ({ caller, callee, called, remark, onSubmit }) => (
  <div style={styles.row}>
    <Col type={caller.type}>{caller.name}</Col>
    <Col type={callee.type}>{callee.name}</Col>
    <Col type={callee.type}>{called}</Col>
    <Col type={callee.type}>{remark}</Col>
  </div>
)

class Frame extends Component {
  render = () => (
    <Client base='https://api.imascg.moe' middleware={[middleware.handleJson()]}>
      <React.Fragment>
        <Endpoint path='characters'>
          <Endpoint path='readings'>
            {null}
          </Endpoint>
        </Endpoint>
        <Endpoint path='units'>
          <Endpoint path='readings'>
            {null}
          </Endpoint>
        </Endpoint>
        <Endpoint path='calltable'>
          {null}
        </Endpoint>
      </React.Fragment>
    </Client>
  )
}

class App extends Component {
  state = { caller: '', callee: '', called: '' }

  render = () => (
    <ThemeProvider theme={theme}>
      <Client base='https://api.imascg.moe' middleware={[middleware.handleJson()]}>
        <Endpoint path='characters' render={characters => (
          <div style={{ width, margin: 'auto' }}>
            <Frame />
            <Endpoint path='readings' render={readings => readings.response ? (
              <div></div>
            ) : null} />
            <Endpoint path='/calltable' options={this.state} render={calltable => {
              if(!characters.response || !calltable.response) {
                return null
              }

              const mapped = calltable.response.data.map(entry => ({
                ...entry,
                caller: characters.response.data.find(character => character.id === entry.caller),
                callee: characters.response.data.find(character => character.id === entry.callee),
              }))

              return (
                <WindowScroller>
                {({ height, scrollTop }) => (
                  <List
                    autoHeight
                    width={width}
                    height={height}
                    scrollTop={scrollTop}
                    rowCount={mapped.length}
                    rowHeight={theme.cell.height}
                    rowRenderer={({ index, key, style }) => (({ caller, callee, called, remark }, even) => (
                      <div key={key} style={style}>
                        <Col type={caller.type} even={even}>{caller.name}</Col>
                        <Col type={callee.type} even={even}>{callee.name}</Col>
                        <Col type={callee.type} even={even}>{called}</Col>
                        <Col type={callee.type} even={even}>{remark}</Col>
                      </div>
                    ))(mapped[index], index % 2 === 0)}
                  />
                )}
                </WindowScroller>
              )
            }} />
          </div>
        )} />
      </Client>
    </ThemeProvider>
  )
}

export default App
