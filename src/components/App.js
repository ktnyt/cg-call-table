import React, { Component } from 'react'
import { Client, Endpoints } from 'react-rest'

import Filters from './Filters'
import Table from './Table'

const API_HOST = process.env.REACT_APP_API_HOST

class App extends Component {
  state = { callers: [], callees: [], called: '', remark: '', width: window.innerWidth }

  componentWillMount = () => {
     window.addEventListener("resize", this.handleResize)
  }

  handleResize = event => {
    const width = window.innerWidth
    this.setState({ width })
  }

  render = () => {
    const { callers, callees, called, remark, width } = this.state

    const caller = callers.join(',')
    const callee = callees.join(',')

    return (
      <Client url={API_HOST}>
        <Endpoints specs={{
            characters: { path: 'characters', fetchOnMount: true },
            calltable: { path: 'calltable', fetchOnMount: true, params: { caller, callee, called, remark } },
          }} render={({ characters, calltable }) => {
            if(!characters.data || !calltable.data) return null

            const addable = callers.length === 1 && callees.length === 1 && called.length

            const handleAdd = event => {
              if(addable) {
                const caller = callers[0]
                const callee = callees[0]

                calltable.handlers.add({
                  caller,
                  callee,
                  called,
                  remark,
                })
              }
            }

            return (
              <div>
                <Filters
                  width={width}
                  onCallerChange={callers => this.setState({ callers })}
                  onCalleeChange={callees => this.setState({ callees })}
                  onCalledChange={called => this.setState({ called })}
                  onRemarkChange={remark => this.setState({ remark })}
                  addable={addable}
                  handleAdd={handleAdd}
                  />
                <Table
                  width={width}
                  callers={callers}
                  callees={callees}
                  called={called}
                  remark={remark}
                  characters={characters}
                  calltable={calltable}
                  />
              </div>
            )
          }} />
      </Client>
    )
  }
}

export default App
