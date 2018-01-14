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
    this.unbind_characters = handlers.characters.bind(characters => this.setState({ characters }))
    handlers.characters.browse()

    this.unbind_units = handlers.units.bind(units => this.setState({ units }))
    handlers.units.browse()

    this.unbind_calltable = handlers.calltable.bind(calltable => this.setState({ calltable }))
    handlers.calltable.browse()

    window.onresize = () => this.setState({ width: window.innerWidth })
  }

  componentWillUnmount = () => {
    this.unbind_calltable()
    this.unbind_units()
    this.unbind_characters()
  }

  render = () => {
    const {
      characters,
      units,
      calltable,
      caller,
      callee,
      called,
      remark,
      width,
    } = this.state

    const ready = [characters, units, calltable].filter(data => data === null).length === 0

    if(!ready) return null

    const filterReading = (value, collection) => collection.filter(entry => entry.readings.filter(reading => reading.match(value)).length > 0)
    const filterCharacters = value => filterReading(value, characters).map(entry => entry.id).sort()
    const filterUnits = value => filterReading(value, units).map(unit => unit.members).reduce((p, n) => ([ ...p, ...n ]), [])

    const callers = [ ...filterCharacters(caller), ...filterUnits(caller) ]
    const callees = [ ...filterCharacters(callee), ...filterUnits(callee) ]

    const filtered = calltable
    .filter(entry => callers.includes(entry.caller))
    .filter(entry => callees.includes(entry.callee))
    .filter(entry => entry.called.match(called))
    .filter(entry => entry.remark.match(remark))
    .map(({ id, caller, callee, called, remark }) => ({
      id,
      caller: characters.find(character => character.id === caller),
      callee: characters.find(character => character.id === callee),
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
