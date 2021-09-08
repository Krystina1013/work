import _axios from "./../plugins/axios";
import config from './config';
// 获取注册设备
export function regDevice() {
  return _axios({
    url:config.v5+ '/admin/dev-manage/get-reg-dev/',
    method: 'get',
  })
}

// 获取注册信息
export function getRegData(devId) {
  return _axios({
    url:config.v5+ `/admin/usr-visitor-reg/${devId}/current/`,
    method: 'get',
  })
}

//模糊查询人名
export function getUserName(params) {
  return _axios({
    url:config.v5+ '/admin/scence-user/like-by-name/',
    method: 'get',
    params
  })
}

//genuine姓名 电话 证件类型查找
export function getUser(params) {
  return _axios({
    url:config.v5+ '/admin/scence-user/search-usr',
    method: 'get',
    params
  })
}

//获取指定办公室
export function getTargetHouse(params) {
  return _axios({
    url:config.v5+ '/admin/usrHouseLink/by-user-scence-id/',
    method: 'get',
    params
  })
}

//刷卡注册访客
export function addVisitor(data, devId) {
  return _axios({
    url:config.v5+ `/admin/usr-visitor-reg/${devId}/confirm/`,
    method: 'post',
    data
  })
}

//手动注册访客
export function addVisitorManual(data, devId) {
  return _axios({
    url:config.v5+ `/admin/usr-visitor-reg/${devId}/manual/`,
    method: 'post',
    data
  })
}

//取消注册
export function cancelVisitor(devId) {
  return _axios({
    url:config.v5+ `/admin/usr-visitor-reg/${devId}/cancel/`,
    method: 'delete'
  })
}
