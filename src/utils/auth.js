import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserName = 'userName'
const FacoryId = "factoryId"

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getName() {
  return Cookies.get(UserName)
}

export function setName(name) {
  return Cookies.set(UserName, name)
}

export function removeName() {
  return Cookies.remove(UserName)
}

export function getFactory() {
  return Cookies.get(FacoryId)
}

export function setFactory(id) {
  return Cookies.set(FacoryId, id)
}

export function removeFactory() {
  return Cookies.remove(FacoryId)
}
