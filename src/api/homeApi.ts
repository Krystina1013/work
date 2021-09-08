import _axios from "../plugins/axios";
import config from './config';

export function getScene(data: object) {
  return _axios({
    url: config.v5 + '/admin/hs-scence/info',
    method: 'get',
    data
  })
}

export function basicData(data: object) {
  return _axios({
    url: config.v5 + '/admin/home-page/Home/Page/count',
    method: 'get',
    data
  })
}

export function checkData(data: object) {
  return _axios({
    url: config.v5 + '/admin/attendance-record/screen/attendance',
    method: 'get',
    data
  })
}

// 首页t 设备数量
export function deviceData() {
  return _axios({
    url: config.v2 + '/admin/index/device_count',
    method: 'get',
  })
}

export function accessData() {
  return _axios({
    url: config.v2 + '/admin/index/peoples/pass',
    method: 'get',
  })
}

export function alarmData() {
  return _axios({
    url: config.v2 + '/admin/index/device_warn/7day',
    method: 'get',
  })
}