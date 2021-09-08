import _axios from "../plugins/axios";
import config from './config';
/****** 管理员 ***** */
// /修改管理员
export function updateManager(data: object) {
  return _axios({
    url:config.v5+ '/admin/scence-admin/update',
    method:'put',
    data
  })
}
// 添加/管理员
export function addManager(data: object) {
  return _axios({
    url:config.v5+ '/admin/scence-admin/insert',
    method: 'post',
    data
  })
}
// 管理员的禁用与恢复
export function manageStatus(status: string, id: object) {
  return _axios({
    url:config.v5+ '/admin/scence-admin/update',
    method: 'put',
    data: {
      id,
      status
    }
  })
}
// 管理员的重置密码
export function resetPassword(params: Object) {
  return _axios({
    url:config.v5+ '/admin/scence-admin/update',
    method: 'put',
    data:params
  })
}
/********* 获取角色列表 *********** */
export function getRoleList(name: string | null) {
  return _axios({
    url:config.v5+ '/admin/usrRole/list',
    method: 'get',
    params: {
      name
    }
  })
}

// 新建角色
export function addRole(data: object) {
  return _axios({
    url:config.v5+ '/admin/usrRole',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(data: object) {
  return _axios({
    url:config.v5+ '/admin/usrRole/updatePermission',
    method: 'put',
    data
  })
}

/********* 预警联系人 *********** */

//获取预警联系人
export function getWarning(params: Object) {
  return _axios({
    url:config.v5+ '/admin/usr-early-contact/',
    method: 'get',
    params
  })
}

export function addWarning(data: Object) {
  return _axios({
    url:config.v5+ '/admin/usr-early-contact/',
    method: 'post',
    data
  })
}

//修改预警联系人
export function editWarning(data: Object) {
  return _axios({
    url:config.v5+ `/admin/usr-early-contact/${data['id']}/`,
    method: 'patch',
    data
  })
}

// 删除预警联系人列表
export function deleteWarning(id: any) {
  return _axios({
    url:config.v5+ `/admin/usr-early-contact/${id}/`,
    method: 'delete',
  })
}

// 获取预警联系人分组
export function getGroup() {
  return _axios({
    url:config.v5+ '/admin/usr-early-group/',
    method: 'get',
  })
}

//添加预警联系人分组
export function addGroup(data: Object) {
  return _axios({
    url:config.v5+ '/admin/usr-early-group/',
    method: 'post',
    data
  })
}

//删除预警联系人分组
export function deleteGroup(id: any) {
  return _axios({
    url:config.v5+ `/admin/usr-early-group/${id}/`,
    method: 'delete'
  })
}

/********* 系统参数 *********** */
//添加车位分组
export function addArgumentsStall(data: Object) {
  return _axios({
    url:config.v5+ '/admin/car-space-type',
    method: 'post',
    data
  })
}

//修改车位分组
export function editArgumentsStall(data: Object) {
  return _axios({
    url:config.v5+ `/admin/car-space-type/${data['id']}/`,
    method: 'patch',
    data
  })
}

// 查询场景超级卡列表
export function getSuperCardList() {
  return _axios({
    url:config.v5+ '/admin/hsDoorCard/super',
    method: 'get'
  })
}

// 删除超级卡
export function deleteSuperCardById(id:string) {
  return _axios({
    url:config.v5+ '/admin/hsDoorCard/super',
    method: 'delete',
    params: {
      cardId: id
    }
  })
}

// 添加超级卡信息
export function addSuperCard(cardNo: string) {
  return _axios({
    url:config.v5+ '/admin/hsDoorCard/super',
    method: 'post',
    data: {
      cardNo
    }
  })
}
