import React, { Component } from 'react'
import { ThemeProvider } from 'react-jss'

import View from './components/View'
import Filters from './components/Filters'
import Table from './components/Table'

import handlers from './handlers'
import { getCache } from './caching'

const theme = width => ({
  pallete: {
    cute: ['#f8adcc', '#fcc9de'],
    cool: ['#9ab3ff', '#ccdaff'],
    pasn: ['#fee3b3', '#feeccc'],
    rest: ['#80fba2', '#b4fcc4'],
  },
  full: width < 600 ? false : true,
  compact: width < 450 ? true : false,
  width: width < 450 ? width : width < 600 ? 450 : 600,
  cell: {
    padding: 3,
    width: Math.min(width / 3, 150),
    height: 24,
  },
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...getCache(),
      caller: '',
      callee: '',
      called: '',
      remark: '',
      width: window.innerWidth,
    }
  }

  componentWillMount = () => {
    this.unbind_characters = handlers.characters.bind(data => {
      const characters = data.map(({ id, ...rest }) => ({ [id]: rest })).reduce((prev, next) => ({ ...prev, ...next }))
      this.setState({ characters })
    })
    handlers.characters.browse()

    this.unbind_character_readings = handlers.character_readings.bind(character_readings => this.setState({ character_readings }))
    handlers.character_readings.browse()

    this.unbind_units = handlers.units.bind(data => {
      const units = data.map(({ id, ...rest }) => ({ [id]: rest })).reduce((prev, next) => ({ ...prev, ...next }))
      this.setState({ units })
    })
    handlers.units.browse()

    this.unbind_unit_readings = handlers.unit_readings.bind(unit_readings => this.setState({ unit_readings }))
    handlers.unit_readings.browse()

    this.unbind_calltable = handlers.calltable.bind(calltable => this.setState({ calltable }))
    handlers.calltable.browse()

    window.onresize = () => this.setState({ width: window.innerWidth })
  }

  componentWillUnmount = () => {
    this.unbind_characters()
    this.unbind_character_readings()
    this.unbind_calltable()
  }

  render = () => {
    const {
      characters,
      character_readings,
      units,
      unit_readings,
      calltable,
      caller,
      callee,
      called,
      remark,
      width,
    } = this.state

    const ready = [characters, character_readings, units, unit_readings, calltable].filter(data => data === null).length === 0

    if(!ready) return null

    const filterReading = (value, readings) => readings.filter(entry => entry.reading.match(value)).map(entry => entry.id)
    const filterCharacters = value => filterReading(value, character_readings).sort()
    const filterUnits = value => filterReading(value, unit_readings).map(unit => units[unit].members).reduce((p, n) => ([ ...p, ...n ]))

    const callers = [ ...filterCharacters(caller), ...filterUnits(caller) ]
    const callees = [ ...filterCharacters(callee), ...filterUnits(callee) ]

    const filtered = calltable
    .filter(entry => callers.includes(entry.caller))
    .filter(entry => callees.includes(entry.callee))
    .filter(entry => entry.called.match(called))
    .filter(entry => entry.remark.match(remark))
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
    const changeRemark = event => this.setState({ remark: event.target.value })
    const handleClick = event => {
      event.preventDefault()
      const caller = callers[0]
      const callee = callees[0]
      const called = event.target.called.value
      const remark = theme.full ? event.target.remark.value : ''

      const message = `${characters[caller].name} ${characters[callee].name} ${called}の呼称を追加しますか？`
      if(window.confirm(message)) {
        handlers.calltable.add({
          caller,
          callee,
          called,
          remark,
        })
      }
    }

    return (
      <ThemeProvider theme={theme(width)}>
        <View>
          <Filters
            onChangeCaller={changeCaller}
            onChangeCallee={changeCallee}
            onChangeCalled={changeCalled}
            onChangeRemark={changeRemark}
            onClick={handleClick}
          />
          <Table table={filtered} />
        </View>
      </ThemeProvider>
    )
  }
}

export default App
