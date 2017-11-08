import Auth0Lock from 'auth0-lock'

const AUTH0_CLIENT = process.env.REACT_APP_AUTH0_CLIENT
const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN

class Auth {
  constructor() {
    this.lock = new Auth0Lock(AUTH0_CLIENT, AUTH0_DOMAIN, { language: 'ja' })

    this.lock.on('authenticated', ({ idToken, idTokenPayload: { sub, exp } }) => {
      localStorage.setItem('id_token', idToken)
      localStorage.setItem('expires_at', exp)
      localStorage.setItem('identity', sub)
    })
  }

  isAuthenticated = () => {
    const id_token = localStorage.getItem('id_token')
    const expires_at = localStorage.getItem('expires_at')
    const identity = localStorage.getItem('identity')

    if(id_token === null || expires_at === null || identity === null || expires_at * 1000 < Date.now()) {
      return false
    }

    return true
  }

  authorizationHeader = () => {
    return this.isAuthenticated() ? ({
      Authorization: `Bearer ${this.getToken()}`
    }) : {}
  }

  getToken = () => {
    return this.isAuthenticated() ? localStorage.getItem('id_token') : undefined
  }

  getIdentity = () => {
    return this.isAuthenticated() ? localStorage.getItem('identity') : undefined
  }

  login = () => this.lock.show()

  logout = () => {
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('identity')
  }
}

export default Auth
