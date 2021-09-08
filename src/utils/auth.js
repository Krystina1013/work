import {setCookie, getCookie, removeCookie } from "@/utils/cookie";

const TokenKey = 'User-Token'
const NameKey = 'username'
const PasswordKey ='password'
const CodeKey = 'codetype'
const Permission = 'PermissionList'
// const RoleKey = 'role'

export function getToken() {
  return getCookie(TokenKey)
}

export function setToken(token) {
  return setCookie(TokenKey, token)
}

export function removeToken() {
  return removeCookie(TokenKey)
}

export function getName() {
  return getCookie(NameKey)
}

export function setName(name) {
  return setCookie(NameKey, name, { expires: 365 })
}

export function removeName() {
  return removeCookie(NameKey)
}

export function getPassword() {
  return getCookie(PasswordKey)
}

export function setPassword(password) {
  return setCookie(PasswordKey, password, { expires: 365 })
}

export function removePassword() {
  return removeCookie(PasswordKey)
}

export function getCode(){
  return getCookie(CodeKey)
}

export function setCode(name) {
  return setCookie(CodeKey, name, { expires: 365 })
}

export function removeCode() {
  return removeCookie(CodeKey)
}

export function setPermission(list) {
  return setCookie(Permission, list)
}

export function getPermission() {
  return getCookie(Permission)
}

// export function setRole(role) {
//   return setCookie(RoleKey, role)
// }

// export function getRole() {
//   return getCookie(RoleKey)
// }

// export function removeRole() {
//   return removeCookie(RoleKey)
// }
