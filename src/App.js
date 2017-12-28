import React, { Component, Fragment } from 'react'
import injectSheet, { ThemeProvider } from 'react-jss'

import Filters from './components/Filters'
import Table from './components/Table'

import handlers from './handlers'

const theme = {
  pallete: {
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

const styles = {
  container: {
    margin: 'auto',
    width: 600,
  },
}

class App extends Component {
  state = {
    characters: false,
    character_readings: false,
    calltable: false,
    caller: '',
    callee: '',
    called: '',
  }

  componentWillMount = () => {
    this.unbind_characters = handlers.characters.bind(data => {
      const characters = data.map(({ id, ...rest }) => ({ [id]: rest })).reduce((prev, next) => ({ ...prev, ...next }))
      this.setState({ characters })
    })
    handlers.characters.browse()

    this.unbind_character_readings = handlers.character_readings.bind(character_readings => this.setState({ character_readings }))
    handlers.character_readings.browse()

    this.unbind_calltable = handlers.calltable.bind(calltable => this.setState({ calltable }))
    handlers.calltable.browse()
  }

  componentWillUnmount = () => {
    this.unbind_characters()
    this.unbind_character_readings()
    this.unbind_calltable()
  }

  render = () => {
    const { classes } = this.props

    const {
      characters,
      character_readings,
      calltable,
      caller,
      callee,
      called,
    } = this.state

    const ready = !!characters && !!character_readings && !!calltable

    if(!ready) return null

    const callers = character_readings.filter(entry => entry.reading.match(caller)).map(entry => entry.id)
    const callees = character_readings.filter(entry => entry.reading.match(callee)).map(entry => entry.id)

    const filtered = calltable
    .filter(entry => callers.includes(entry.caller))
    .filter(entry => callees.includes(entry.callee))
    .filter(entry => entry.called.match(called))
    .map(({ id, caller, callee, called, remark }) => ({
      id,
      caller: characters[caller],
      callee: characters[callee],
      called,
      remark,
    }))

    const changeCaller = event => this.setState({ caller: event.target.value })
    const changeCallee = event => this.setState({ callee: event.target.value })
    const changeCalled = event => this.setState({ called: event.target.value })

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.container}>
          <Filters
            onChangeCaller={changeCaller}
            onChangeCallee={changeCallee}
            onChangeCalled={changeCalled}
          />
          <Table table={filtered} />
        </div>
      </ThemeProvider>
    )
  }
}

export default injectSheet(styles)(App)
