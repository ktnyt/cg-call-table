import React, { Component } from 'react'
import { Endpoints } from 'react-rest'

import Filters from './Filters'
import Table from './Table'

import { toProp } from 'utils'
import { buttonStyle, inherit } from 'styles'

class Desktop extends Component {
  state = {
    callers: [],
    callees: [],
    called: '',
    remark: '',
    authenticated: false,
  }

  componentWillMount = () => {
     this.handler = setInterval(() => {
       const authenticated = this.props.auth.isAuthenticated()
       if(authenticated !== this.state.authenticated) {
         this.setState({ authenticated })
       }
     }, 1)
  }

  componentWillUnmount = () => {
    clearInterval(this.handler)
  }

  render = () => {
    const { auth, width } = this.props

    const {
      callers,
      callees,
      called,
      remark,
      authenticated,
    } = this.state

    const caller = callers.join(',')
    const callee = callees.join(',')

    return (
      <Endpoints configs={{
          characters: { path: 'characters' },
          calltable: { path: 'calltable', params: { caller, callee, called, remark } },
          editors: { path: 'editors' }
        }} render={({ characters, calltable, editors }) => {
          if(!characters.data || !calltable.data || !editors.data) return null

          const editable = authenticated && (editors.data.map(toProp('id')).includes(auth.getIdentity()))

          if(authenticated && !editable) {
            alert('このアカウントには編集権限がありません。')
            auth.logout()
          }

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
              <button style={{ ...buttonStyle, position: 'absolute', top: 0, right: 0 }} onClick={auth.login}>
                <i style={inherit} className='material-icons'>mode_edit</i>
              </button>
              <Filters
                editable={editable}
                width={width}
                onCallerChange={callers => this.setState({ callers })}
                onCalleeChange={callees => this.setState({ callees })}
                onCalledChange={called => this.setState({ called })}
                onRemarkChange={remark => this.setState({ remark })}
                addable={addable}
                handleAdd={handleAdd}
                />
              <Table
                editable={editable}
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
    )
  }
}

export default Desktop
