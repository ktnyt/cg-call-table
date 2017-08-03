const buildParams = params => {
  if(!params) return ''

  const keys = Object.keys(params)

  if(keys.length === 0) return ''

  return `?${keys.map(key => `${key}=${params[key]}`).join('&')}`
}

class Handlers {
  before = o => o
  after = o => o

  constructor(client, path) {
    this.client = client
    this.path = path
  }

  clone = (decorate=false) => {
    const cloned = new Handlers(this.client, this.path)
    if(decorate) {
      cloned.before = this.before
      cloned.after = this.after
    }
    return cloned
  }

  internal = {
    browse: params => this.before(this.client.browse(this.path + buildParams(params))).then(this.after).then(this.callback),
    read: identifier => this.before(this.client.read(`${this.path}/${identifier}`)).then(this.after).then(this.callback),
    edit: (identifier, body) => this.before(this.client.edit(`${this.path}/${identifier}`, { body })).then(this.fetch).then(this.after).then(this.callback),
    add: body => this.before(this.client.add(this.path, { body })).then(this.fetch).then(this.after).then(this.callback),
    destroy: identifier => this.before(this.client.destroy(`${this.path}/${identifier}`)).then(this.fetch).then(this.after).then(this.callback),
    wipe: params => this.before(this.client.destroy(this.path + buildParams(params))).then(this.fetch).then(this.after).then(this.callback),
    create: body => this.before(this.client.add(this.path, { body })).then(this.after).then(this.callback),
    replace: (identifier, body) => this.before(this.client.replace(`${this.path}/${identifier}`, { body })).then(this.fetch).then(this.after).then(this.callback),
  }

  decorate = (before, after) => {
    this.before = data => {
      before(data)
      return data
    }
    this.after = data => {
      after(data)
      return data
    }
    return this
  }

  bindIdentifier = identifier => {
    if(identifier.length) {
      delete this.browse
      delete this.add
      delete this.wipe
      this.read = () => this.internal.read(identifier)
      this.edit = body => this.internal.edit(identifier, body)
      this.destroy = () => this.internal.destroy(identifier)
      this.replace = body => this.internal.replace(identifier, body)
      this.fetch = (f=o=>o) => this.internal.read(identifier).then(f)
    }
    return this
  }

  bindParams = params => {
    this.browse = options => this.internal.browse({...params, ...options})
    this.wipe = options => this.internal.wipe({...params, ...options})
    this.fetch = (f=o=>o) => this.internal.browse(params).then(f)
    return this
  }

  bindCallback = callback => {
    this.callback = data => {
      callback(data)
      return data
    }
    return this
  }

  browse = this.internal.browse
  read = this.internal.read
  edit = this.internal.edit
  add = this.internal.add
  destroy = this.internal.destroy
  wipe = this.internal.wipe
  create = this.internal.create
  replace = this.internal.replace
  fetch = f => this.browse().then(f)
}

export default Handlers
