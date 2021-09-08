import _axios from "../plugins/axios";
import config from './config';
/*******左侧办公室接口*********/
// 获取左侧树形结构办公室列表
export function getHouseTreeData() {
  return _axios({
    url:config.v5+'/admin/building-group',
    method: 'get'
  })
}
export function getZoom(params) {
  return _axios({
    url:config.v5+'/admin/office',
    method: 'get',
    params
  })
}
// 左侧树形结构添加分组
export function addHouseGroup(data: Object) {
  return _axios({
    url:config.v5+'/admin/building-group',
    method: 'post',
    data
  })
}
// 左侧树形结构删除分组
export function deleteHouseGroup(id: string) {
  return _axios({
    url:config.v5+ '/admin/building-group',
    method: 'delete',
    params: {
      id
    }
  })
}
// 左侧树形结构修改分组
export function updateHouseGroup(data: Object) {
  return _axios({
    url:config.v5+ '/admin/building-group',
    method: 'put',
    data
  })
}
// 左侧树形结构修改顺序排序
export function updateOrderHouseGroup(data: Object) {
  return _axios({
    url:config.v5+ '/admin/building-group/order',
    method: 'put',
    data
  })
}

// 创建单元楼
export function addBuilding(data: object) {
  return _axios({
    url:config.v5+ '/admin/building',
    method: 'post',
    data
  })
}

// 修改单元楼
export function updateBuilding(data: object) {
  return _axios({
    url:config.v5+ '/admin/building',
    method: 'put',
    data
  })
}

// 删除单元楼
export function deleteBuilding(id: string) {
  return _axios({
    url:config.v5+ '/admin/building',
    method: 'delete',
    params: {
      id
    }
  })
}

// 获取单元楼单位
export function getUnitList(type: string = 'group') {
  return _axios({
    url:config.v5+ '/admin/unit',
    method: 'get',
    params: {
      type
    }
  })
}

// 增加单元楼单位
export function addUnit(name: string, type: string) {
  return _axios({
    url:config.v5+ '/admin/unit',
    method: 'post',
    data: {
      name,
      type
    }
  })
}

// 删除单元楼单位
export function deleteUnit(id: string) {
  return _axios({
    url:config.v5+ '/admin/unit',
    method: 'delete',
    params: {
      id
    }
  })
}

/*******门禁卡管理*********/
// 门禁卡启用与禁用
export function changeCardStstus(status: string, id: string) {
  return _axios({
    url:config.v5+ '/admin/door-card/update',
    method: 'put',
    params: {
      id,
      status
    }
  })
}
// 创建门禁卡
export function createCard(form: object) {
  return _axios({
    url:config.v5+ '/admin/door-card/insert',
    method: 'post',
    data: {
      ...form
    }
  })
}
// 门禁卡过期时间修改
export function cardvalidDateChange(params: object) {
  return _axios({
    url:config.v5+ '/admin/door-card/update',
    method: 'put',
    params
  })
}
// 获取指定门禁卡的同行记录
export function theCardPassList(params: object) {
  return _axios({
    url:config.v2+ '/admin/peoplePass',
    method: 'get',
    params: {
      ...params,
      limit: 10
    }
  })
}
// 获取对应办公室下的门禁卡信息
export function getCardListByHouseId(houseId: string) {
  return _axios({
    url:config.v5+ '/admin/door-card/userId',
    method: 'get',
    params: {
      houseId
    }
  })
}

// 删除门禁卡
export function deleteDoorCard(Arr: Array<string>) {
  return _axios({
    url:config.v5+ '/admin/door-card/delete',
    method: 'delete',
    data:  Arr
    
  })
}

//***********办公室管理********** */
// 通过关键字查询办公室列表 搜索建议框
export function searchSuggestHouse(keys: string) {
  return _axios({
    url:config.v5+ '/admin/hsHouse/byKey',
    method: 'get',
    params: {
      keys
    }
  })
}
// 添加办公室
export function addHouse(data: object) {
  return _axios({
    url:config.v5+ '/admin/office',
    method: 'post',
    data
  })
}
// 修改办公室状态/备注
export function updateStatusNote(data: object) {
  return _axios({
    url:config.v5+ '/admin/office',
    method: 'put',
    data
  })
}
// 获取当前场景下的单元楼
export function searchHouse() {
  return _axios({
    url:config.v5+ '/admin/building',
    method: 'get',
  })
}
// 获取当前场景下出入口
export function getInoutList() {
  return _axios({
    url:config.v5+ '/admin/enter-exit',
    method: 'get'
  })
}
// 添加出入口
export function creatPassageway(data: object) {
  return _axios({
    url:config.v5+ '/admin/enter-exit',
    method: 'post',
    data
  })
}

//修改出入口
export function editPassageway(data: object) {
  return _axios({
    url:config.v5+ '/admin/enter-exit',
    method: 'put',
    data
  })
}


// 获取特定办公室下的注册人员
export function getRegisterPeople(officeId: string) {
  return _axios({
    url:config.v5+ '/admin/user-office-link/links',
    method: 'get',
    params: {
      officeId
    }
  })
}
// 获取特定办公室下的注册人员--某个人
export function getRegisterPerson(id: string) {
  return _axios({
    url:config.v5+ '/admin/user-office-link/links',
    method: 'get',
    params: {
      id
    }
  })
}


// 根据办公室id查询办公室信息(已删除的也能查出来)
export function getRegisterHouse(params:object) {
  return _axios({
    url:config.v5+ '/admin/hsHouse/by-id',
    method: 'get',
    params
  })
}

// 删除特定办公室下的某个注册人员
export function deleteTheHousePeople(id:string,houseId: string, userId: string,scenceUserId:string) {
  return _axios({
    url:config.v5+ '/admin/user-office-link',
    method: 'delete',
    // params: {
    //   id,
    //   houseId,
    //   userId,
    //   scenceUserId
    // }
    data: [id]
  })
}

// 通过用户id获取办公室列表信息
export function getHouseListByUserId(userId: string) {
  return _axios({
    url:config.v5+ '/admin/hsHouse/byUserId',
    method: 'get',
    params: {
      userId
    }
  })
}
// 批量门禁卡续期
export function updateCardDate(ids:any,date:any) {
  return _axios({
    url:config.v5+ `/admin/door-card/batchUpdate?ids=${ids}&date=${date}`,
    method: 'put',
  })
}

// 通道口--列表
export function getPassageway(params:any={}) {
  return _axios({
    url:config.v5+ `/admin/passageway`,
    method: 'get',
    params
  })
}
export function getPassagewayInfo(params:any) {
  return _axios({
    url:config.v5+ `/admin/passageway/offices`,
    method: 'get',
    params
  })
}
// 通道口--增加
export function addPassageway(data:any) {
  return _axios({
    url:config.v5+ `/admin/passageway`,
    method: 'post',
    data
  })
}
// 通道口--修改
export function updatePassageway(data:any) {
  return _axios({
    url:config.v5+ `/admin/passageway`,
    method: 'put',
    data
  })
}
// 通道口--删除
export function deletePassageway(data:any) {
  return _axios({
    url:config.v5+ `/admin/passageway`,
    method: 'delete',
    data
  })
}

// 会议室--列表
export function allMeetingRoomTime(params:any) {
  return _axios({
    url:config.v5 + "/admin/meeting/allMeetingRoomTime",
    method: 'get',
    params
  })
}
// 会议室--添加
export function addMeeting(data:any) {
  return _axios({
    url:config.v5+ `/admin/meeting`,
    method: 'post',
    data
  })
}
// 会议室--修改
export function updateMeeting(data:any) {
  return _axios({
    url:config.v5+ `/admin/meeting`,
    method: 'put',
    data
  })
}
// 会议室--删除
export function delateMeeting(data:any) {
  return _axios({
    url:config.v5+ `/admin/meeting`,
    method: 'delete',
    data
  })
}
// 会议室--某个会议的时间
export function searchMeetingRoomTime(data:any) {
  return _axios({
    url:config.v5+ `/admin/meeting/searchMeetingRoomTime`,
    method: 'post',
    data
  })
}
// 会议室--获取某个会议信息
export function getOneMeeting(params:any) {
  return _axios({
    url:config.v5+ `/admin/meeting/getOneMeeting`,
    method: 'get',
    params
  })
}