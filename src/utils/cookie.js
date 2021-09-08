import Cookies from "js-cookie";

const namespace = "lenfocus-access-v1";
const saveCookie = [`${namespace}-username`,`${namespace}-codetype`,`${namespace}-password`]; // 退出时不清除cookie的key

export function setCookie(cookieName, data, property) {
  return Cookies.set(`${namespace}-${cookieName}`, data, property);
}

export function getCookie(cookieName) {
  return Cookies.get(`${namespace}-${cookieName}`);
}

export function removeCookie(cookieName) {
  return Cookies.remove(`${namespace}-${cookieName}`);
}

export function clearCookie() {
  for (const name in Cookies.get()) {
    if (saveCookie.includes(name)) {
      continue;
    }
    Cookies.remove(name);
  }
}


// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus) => Cookies.set(sidebarStatusKey, sidebarStatus)