// export default url
import _axios from "../plugins/axios";
import config from './config';
export function login(data: Object) {
  return _axios({
    url:config.v5+ "/open/admin/login",
    method: "post",
    data
  });
}

// 获取用户权限
export function getRoleList() {
  return _axios({
    url:config.v5+ "/admin/usr-user-role-link",
    method: "get"
  });
}

// 获取用户权限
// export function getAuthCode(params: object) {
//   return _axios({
//     url:config.v5+ "/admin/open/auth-code",
//     method: "get",
//     params
//   });
// }

// 获取用户权限
export function getAuthCode(params: object) {
  return _axios({
    url:config.v5+ "/admin/hs-scence/typeByCode",
    method: "get",
    params
  });
}

// 导出列表公用
export function exportList(url:string) {
  return _axios({
    url:url,
    method: "get",
    responseType: "blob"
  });
}

//  反馈
export function feedback(data: Object) {
  return _axios({
    url:config.v5+ "/admin/feedback",
    method: "post",
    data
  });
}
