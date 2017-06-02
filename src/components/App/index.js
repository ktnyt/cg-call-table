import React, { Component } from 'react'
import DocumentEvents from 'react-document-events'
import _ from 'lodash'
import delay from 'timeout-as-promise'
import 'whatwg-fetch'

import Table from '../Table'
import Filter from '../Filter'
import Loader from '../Loader'
import DebouncedInput from '../DebouncedInput'

const post = (url, obj) => fetch(url, { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(obj) })
const and = (...conds) => conds.reduce((a, b) => a && b)

const API_HOST = process.env.REACT_APP_API_HOST

class App extends Component {
  state = {
    idols: [],
    table: [],
    cache: [],
    loading: true,
    margin: { group: 34, normal: 34 },
    width: window.innerWidth,
    height: window.innerHeight,
    callers: [],
    callees: [],
    pcalled: '',
  }

  componentWillMount = () => {
    const p_idols = fetch(`${API_HOST}/core/idols`)
    .then(res => res.json(), error => console.error(error))
    .then(idols => this.setState({ idols }))

    const p_table = fetch(`${API_HOST}/calltable/`)
    .then(res => res.json(), error => console.error(error))
    .then(table => this.setState({ cache: table, table }))

    Promise.all([delay(2000), p_idols, p_table]).then(values => this.setState({ loading: false }))
  }

  inTable = (data, field) => {
    const { table } = this.state
    if(!table.length) return []
    if(!(field in table[0])) return data
    const target = table.map(item => item[field])
    return data.map(({ label, value }) => ({ label, value: _.intersection(value, target) })).filter(({ value }) => value.length)
  }

  search = field => query => {
    if(query.length) {
      const p_characters = fetch(`${API_HOST}/core/search/characters/${query}`)
      .then(res => res.json(), error => console.error(error))
      .then(data => data.map(name => ({ label: name, value: [name] })), error => console.error(error))

      const p_units = fetch(`${API_HOST}/core/search/units/${query}`)
      .then(res => res.json(), error => console.error(error))
      .then(units => post(`${API_HOST}/core/units`, units), error => console.error(error))
      .then(res => res.json(), error => console.error(error))
      .then(data => _.map(data, (value, label) => ({ label, value })), error => console.error(error))

      return Promise.all([p_characters, p_units]).then(_.flattenDeep).then(data => this.inTable(data, field))
    } else {
      return new Promise((resolve, reject) => resolve([]))
    }
  }

  handleOnChangeGroup = group => post(`${API_HOST}/calltable/`, group)
  .then(res => res.json(), error => console.error(error))
  .then(table => this.setState({ table }), error => console.error(error))

  handleOnChangeCaller = callers => this.setState({ callers })
  handleOnChangeCallee = callees => this.setState({ callees })
  handleOnChangeCalled = event => this.setState({ pcalled: event.target.value })
  handleOnResizeGroup = height => this.setState({ margin: { group: height, normal: this.state.margin.normal } })
  handleOnResizeNormal = height => this.setState({ margin: { group: this.state.margin.group, normal: height } })
  handleWindowResize = event => this.setState({ width: window.innerWidth, height: window.innerHeight })

  render = () => {
    const {
      idols,
      table,
      loading,
      margin,
      width,
      height,
      callers,
      callees,
      pcalled,
    } = this.state

    const filtered = table.filter(({ caller, callee, called }) => and(
      _.includes(callers, caller) || !callers.length,
      _.includes(callees, callee) || !callees.length,
      called.match(RegExp(pcalled)) || !called.length,
    ))

    return (
      <div style={{ width, height, overflow: 'hidden', position: 'fixed' }}>
        <div style={{ width: 720, margin: 'auto' }}>
          <div style={{ float: 'left', position: 'relative', zIndex: 2 }}>
            <Filter
              width={720}
              minWidth={90}
              placeholder='アイドル追加'
              focusOnMount
              suggest={this.search('group')}
              onResize={this.handleOnResizeGroup}
              onChange={this.handleOnChangeGroup} />
          </div>
          <div style={{ float: 'left', position: 'relative', zIndex: 1 }}>
            <Filter
              width={240}
              minWidth={30}
              minHeight={this.state.margin.normal}
              placeholder='Caller'
              suggest={this.search('caller')}
              onResize={this.handleOnResizeNormal}
              onChange={this.handleOnChangeCaller} />
            <Filter
              width={240}
              minWidth={30}
              minHeight={this.state.margin.normal}
              placeholder='Callee'
              suggest={this.search('callee')}
              onResize={this.handleOnResizeNormal}
              onChange={this.handleOnChangeCallee} />
              <div style={{
                width: 234,
                height: this.state.margin.normal - 2,
                float: 'left',
                position: 'relative',
                padding: '4px 0 0 4px',
                border: '1px solid #ccc',
                boxShadow: '0 0 1px rgba(0, 0, 0, 0.4) inset',
                zIndex: 'inherit',
              }}>
                <DebouncedInput
                  delay={500}
                  className='disable_focus'
                  type='text'
                  placeholder='Called'
                  onChange={this.handleOnChangeCalled}
                  style={{
                    width: 226,
                    height: 16,
                    clear: 'left',
                    padding: '4px 4px 4px 0',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    border: 0,
                    fontSize: '12px',
                    verticalAlign: 'top',
                  }} />
              </div>
            </div>
          <div style={{ position: 'relative', zIndex: 0 }}>
            <Table width={720} height={height - (margin.group + margin.normal)} idols={idols} table={filtered} />
          </div>
          <Loader style={{ zIndex: 3 }} visible={loading} />
          <DocumentEvents target={window} onResize={this.handleWindowResize} />
        </div>
      </div>
    )
  }
}

export default App
