import _axios from "../plugins/axios";
import config from './config';
// 首页获取车辆通行记录
export function carPassList(params) {
  return _axios({
    url:config.v5+ '/admin/car-pass',
    method: 'get',
    params
  })
}

//车辆用户查询
export function queryCarPhone(phone) {
  return _axios({
    url:config.v5+ '/admin/scence-user/like-by-phone/',
    method: 'get',
    params: {
      phone
    }
  })
}

//单个添加或批量添加接口
export function addCar(data) {
  return _axios({
    url:config.v5+ '/admin/usr-car/batch-add/',
    method: 'post',
    data
  })
}

//修改车辆
export function editCar(data) {
  return _axios({
    url:config.v5+ '/admin/usr-car',
    method: 'put',
    data
  })
}

//获取目标车辆通行记录
export function getTargrtRecord(params) {
  return _axios({
    url:config.v5+ '/admin/car-pass/',
    method: 'get',
    params
  })
}

// 通过id获取用户/物业的车辆信息
export function getUserPropertyCar(id: string) {
  return _axios({
    url:config.v5+ '/admin/usr-car/byUserId',
    method: 'get',
    params: {
      id
    }
  })
}

export function getvisitUser(id: string) {
  return _axios({
    url:config.v5+ '/admin/usr-visit-car/get-one/',
    method: 'get',
    params: {
      id
    }
  })
}

//获取受邀人信息
export function getOwnerUser(params: object) {
  return _axios({
    url:config.v3+ '/admin/visitor/links',
    method: 'get',
    params
  })
}

export function getCarRecord(id: string) {
  return _axios({
    url:config.v5+ '/admin/usr-car/get-one',
    method: 'get',
    params: {
      id
    }
  })
}


/*******左侧办公室接口*********/
// 获取左侧树形结构办公室列表
export function getHouseTreeData() {
  return _axios({
    url:config.v5+ '/admin/car-space-group',
    method: 'get'
  })
}

// 左侧树形结构添加分组 批量添加
export function addHouseGroups(data: Object) {
  return _axios({
    url:config.v5+ '/admin/car-space-group/batch-create',
    method: 'post',
    data
  })
}

// 左侧树形结构添加分组 手动添加
export function addHouseGroup(data: Object) {
  return _axios({
    url:config.v5+ '/admin/car-space-group',
    method: 'post',
    data
  })
}

// 左侧树形结构修改分组
export function updateHouseGroup(data: Object) {
  return _axios({
    url:config.v5+ `/admin/car-space-group/${data['id']}/`,
    method: 'patch',
    data
  })
}

// 左侧树形结构删除分组
export function deleteHouseGroup(id: string) {
  return _axios({
    url:config.v5+ `/admin/car-space-group/${id}/`,
    method: 'delete',
  })
}

/*******车位管理*********/
// 获取车位列表
export function getStall() {
  return _axios({
    url:config.v5+ '/admin/car-space-type/',
    method: 'get'
  })
}

// 添加车位
export function addStall(data: any) {
  return _axios({
    url:config.v5+ '/admin/car-space/',
    method: 'post',
    data
  })
}

//修改车位
export function editStall(data: any) {
  return _axios({
    url:config.v5+ `/admin/car-space/${data.id}/`,
    method: 'patch',
    data
  })
}

// 通过用户id查询车位信息
export function getCarStallByUserId(userList:Array<string>) {
  return _axios({
    url:config.v5+ '/admin/car-space/search-user',
    method: 'get',
    params: {
      userList
    }
  })
}

//查询车牌
export function querycarno(params: any) {
  return _axios({
    url:config.v5+ '/admin/usr-car',
    method: 'get',
    params
  })
}

//新增绑定车牌
export function addcarno(data: any) {
  return _axios({
    url:config.v5+ `/admin/car-space/${data.id}/add-card`,
    method: 'post',
    data
  })
}

//删除绑定车牌
export function deleteCarno(data: any) {
  return _axios({
    url:config.v5+ `/admin/car-space/${data.id}/delete-card/`,
    method: 'delete',
    data
  })
}


//批量新增车位
export function batchStall(data: any) {
  return _axios({
    url:config.v5+ `/admin/car-space/batch-create`,
    method: 'post',
    data
  })
}
