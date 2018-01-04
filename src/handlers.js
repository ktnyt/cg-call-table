import shortid from 'shortid'

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json;charset=utf-8',
}

const readRequest = (base, path, options={}) => {
  const url = new URL(path, base)
  if(Object.keys(options).length !== 0) {
    url.search = new URLSearchParams(options)
  }
  return new Request(url, { method: 'GET', headers })
}

const writeRequest = method => (base, path, object) => {
  const body = JSON.stringify(object)
  return new Request(new URL(path, base), { method, headers, body })
}

const postRequest = writeRequest('POST')
const patchRequest = writeRequest('PATCH')
const putRequest = writeRequest('PUT')
const deleteRequest = writeRequest('DELETE')

class Handlers {
  constructor(base, path, options) {
    this.base = base
    this.path = path
    this.options = options
    this.bound = {}
  }

  bind = f => {
    const id = shortid.generate()
    this.bound[id] = f
    return () => {
      delete this.bound[id]
    }
  }

  handleResponse = response => response.json().then(data => {
    Object.keys(this.bound).forEach(key => {
      this.bound[key](data)
    })
  })

  browse = () => fetch(readRequest(this.base, this.path, this.options)).then(this.handleResponse)
  read = pk => fetch(readRequest(this.base, `${this.path}/${pk}`)).then(r => this.browse())
  edit = (pk, body) => fetch(patchRequest(this.base, `${this.path}/${pk}`, body)).then(r => this.browse())
  add = body => fetch(postRequest(this.base, this.path, body)).then(r => this.browse())
  destroy = (pk, body) => fetch(deleteRequest(this.base, `${this.path}/${pk}`)).then(r => this.browse())
  replace = (pk, body) => fetch(putRequest(this.base, `${this.path}/${pk}`, body)).then(r => this.browse())
}

const base = 'https://api.imascg.moe'
const characters = new Handlers(base, 'characters')
const character_readings = new Handlers(base, 'characters/readings')
const units = new Handlers(base, 'units')
const unit_readings = new Handlers(base, 'units/readings')
const calltable = new Handlers(base, 'calltable')

export default {
  characters,
  character_readings,
  units,
  unit_readings,
  calltable,
}
