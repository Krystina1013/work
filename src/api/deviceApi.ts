import _axios from "../plugins/axios";
import config from './config';
// 绑定设备
export function createDevice(data: object) {
  return _axios({
    url: config.v5 + '/admin/device-link/bind',
    method: 'post',
    data
  })
}

// 获取设备列表
export function getDeviceList(params: object) {
  return _axios({
    url: config.v2 + '/admin/dev-device-info/page-query',
    method: 'get',
    params
  })
}

// 通过编号查询设备类型
export function checkdeviceByNum(serialNum: string) {
  return _axios({
    url: config.v2 + '/admin/dev-device-info/query-type',
    method: 'get',
    params: {
      serialNum
    }
  })
}

export function editDeviceName(params: object) {
  return _axios({
    url: config.v2 + '/admin/dev-device-info',
    method: 'put',
    params
  })
}
