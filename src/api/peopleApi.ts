import _axios from "../plugins/axios";
import config from './config';
// 用户列表
export function scenceUserPage(data) {
  return _axios({
    url: config.v5 + "/admin/scence-user/page",
    method: "get",
    params: data
  });
}
// 首页获取人员同行记录
export function peoplePassList() {
  return _axios({
    url: config.v5 + "/admin/people-pass",
    method: "get",
    params: {
      limit: 5,
      page: 1
    }
  });
}

//通过电话查看用户信息
export function queryUserPhone(phone: string) {
  return _axios({
    url: config.v5 + "/admin/scence-user/byPhone",
    method: "put",
    params: {
      phone
    }
  });
}

/***** 物业/用户 禁用恢复 ****** */
export function resetDisabledUser(data: object) {
  return _axios({
    url: config.v5 + "/admin/scence-user",
    method: "put",
    data
  });
}
//删除用户
export function deleteUser(data: object) {
  return _axios({
    url: config.v5 + "/admin/scence-user",
    method: "DELETE",
    data
  });
}

// 查看用户和物业人员的通行记录
export function getUserPropertyPass(params: object) {
  return _axios({
    url: config.v2 + "/admin/peoplePass",
    method: "get",
    params
  });
}
// 用户通行权限
export function getUserDevLink(params: object) {
  return _axios({
    url: config.v5 + "/admin/user-dev-link",
    method: "get",
    params
  });
}
//****办公成员相关****** */
// 添加办公成员
export function addPeople(data: Object) {
  return _axios({
    url: config.v5 + "/admin/scence-user/add",
    method: "post",
    data
  });
}
// 修改用户电话
export function updateUserPhone(data: object) {
  return _axios({
    url: config.v5 + "/admin/scence-user/phone",
    method: "put",
    data
  });
}

// 修改用户信息
export function updateUser(data: object) {
  return _axios({
    url: config.v5 + "/admin/scence-user",
    method: "put",
    data
  });
}
// 修改用户备注
export function updateUserNote(id: string, note: string) {
  return _axios({
    url: config.v5 + "/admin/usrUser/updateNote",
    method: "put",
    params: {
      id,
      note
    }
  });
}

//
export function getUserPass(params: object) {
  return _axios({
    url: config.v2 + "/admin/peoplePass",
    method: "get",
    params
  });
}
export function getCarPass(params: object) {
  return _axios({
    url: config.v5 + "/admin/car-pass/",
    method: "get",
    params
  });
}

// 获取办公成员的人脸库信息
export function getFaceList(params: object) {
  return _axios({
    url: config.v5 + "/admin/usr-dev-link",
    method: "get",
    params
  });
}

// 获取业主的人脸库信息
export function getOwnerFaceList(params: object) {
  return _axios({
    url: config.v5 + "/admin/usr-dev-link/by-scence-user-id",
    method: "get",
    params
  });
}

//获取目标人员通行记录 || 访客通行记录
export function getTargrtRecord(params: object) {
  return _axios({
    url: config.v5 + "/admin/people-pass/by-visit-id/",
    method: "get",
    params
  });
}

// 获取人员通行位置的搜索建议
export function getPassAddress(name: string) {
  return _axios({
    url: config.v5 + "/admin/building",
    method: "get",
    params: {
      name
    }
  });
}
// 修改办公成员的远程开门 车辆 访客权限
export function updateRoleHouse(data: object) {
  return _axios({
    url: config.v5 + "/admin/usrHouseLink",
    method: "put",
    data
  });
}
// 添加门禁权限
export function addPermission(data: object) {
  return _axios({
    url: config.v5 + "/admin/user-dev-link/addAll",
    method: "post",
    data
  });
}
// 添加门禁权限
export function addBuildingPer(data: object) {
  return _axios({
    url: config.v5 + "/admin/scence-user/addAll",
    method: "post",
    data
  });
}

/********* 物业人员 *********** */
// 添加物业人员
export function addPropert(data: object) {
  return _axios({
    url: config.v5 + "/admin/scence-user/propertyUser",
    method: "post",
    data
  });
}

// 改变物业人员的权限组
export function changeRoleGroup(authId: string, id: string) {
  return _axios({
    url: config.v5 + "/admin/scence-user/propertyUser/updateAuth",
    method: "put",
    params: {
      authId,
      id
    }
  });
}

// 查看物业人员
export function watchPropert(id: string) {
  return _axios({
    url: config.v5 + "/admin/usrUser/PropertyManager",
    method: "get",
    params: {
      id
    }
  });
}

/********** 获取权限组 ************/
export function getRoleGroup(name: string | null) {
  return _axios({
    url: config.v5 + "/admin/authorities/list",
    method: "get",
    params: {
      name
    }
  });
}

// 创建权限组
export function addRoleGroup(data: object) {
  return _axios({
    url: config.v5 + "/admin/authorities",
    method: "post",
    data
  });
}

// 删除权限组
export function deleteRoleGroup(id: string) {
  return _axios({
    url: config.v5 + "/admin/authorities",
    method: "delete",
    params: {
      id
    }
  });
}

// 修改全选组信息
export function updateRoleGroup(data: object) {
  return _axios({
    url: config.v5 + "/admin/authorities",
    method: "put",
    data
  });
}
/********* 关注人员 *********** */

// 创建关注人员
export function addFocusPeople(data: object) {
  return _axios({
    url: config.v5 + "/admin/usr-focus-personnel/",
    method: "post",
    data
  });
}

// 通过id获取权限组信息
export function getGroupInfoById(id: string) {
  return _axios({
    url: config.v5 + "/admin/authorities/byId",
    method: "get",
    params: {
      id
    }
  });
}

//修改关注人员
export function editFocusPeople(data: Object) {
  return _axios({
    url: config.v5 + `/admin/usr-focus-personnel/${data["id"]}/`,
    method: "patch",
    data
  });
}

// 删除关注人员
export function deleteFocusPeople(id: string) {
  return _axios({
    url: config.v5 + `/admin/usr-focus-personnel/${id}/`,
    method: "delete"
  });
}

// 获取关注人员类别
export function getType() {
  return _axios({
    url: config.v5 + "/admin/usr-focus-personnel-type/",
    method: "get"
  });
}

//添加关注人员类别
export function addType(data: Object) {
  return _axios({
    url: config.v5 + "/admin/usr-focus-personnel-type/",
    method: "post",
    data
  });
}

//删除关注人员类别
export function deleteType(id: any) {
  return _axios({
    url: config.v5 + `/admin/usr-focus-personnel-type/${id}/`,
    method: "delete"
  });
}

/********* 楼控 *********** */

// 获取楼控
export function getFloorControl(params: Object) {
  return _axios({
    url: config.v5 + "/admin/hsHouse/view",
    method: "get",
    params
  });
}

//修改入住人员信息
export function editHotelStaff(data: Object) {
  return _axios({
    url: config.v5 + `/admin/scence-user/student`,
    method: "put",
    data
  });
}
//批量设置通行时间
export function editPasstime(data: Object) {
  return _axios({
    url: config.v5 + `/admin/scence-user/passTime`,
    method: "put",
    data
  });
}
//批量设置是否禁止工作日通行
export function editRestDayPass(data: Object) {
  return _axios({
    url: config.v5 + `/admin/scence-user/restDayPass`,
    method: "put",
    data
  });
}

// 解绑人脸
export function deleteFace(data) {
  return _axios({
    url: config.v5 + "/admin/usr-dev-link",
    method: "delete",
    data
  });
}

// 上传人脸
export function uploadFace(data) {
  return _axios({
    url: config.v5 + "/admin/scence-user/upFace",
    method: "put",
    data
  });
}
// 修改用户过期时间
export function userHouseUpdate(data) {
  return _axios({
    url: config.v5 + "/admin/user-office-link/update",
    method: "put",
    data
  });
}


// 考勤 
export function getAttendanceGroup() {
  return _axios({
    url: config.v5 + "/admin/attendance-group",
    method: "get",

  });
}
export function attendanceGroup(data) {
  return _axios({
    url: config.v5 + "/admin/attendance-group",
    method: "post",
    data
  });
}
export function attendanceGroupDelete(data) {
  return _axios({
    url: config.v5 + "/admin/attendance-group",
    method: "delete",
    data
  });
}
export function attendanceGroupUpdate(data) {
  return _axios({
    url: config.v5 + "/admin/attendance-group",
    method: "put",
    data
  });
}
//考勤组的用户
export function attendanceGroupinGroup(params) {
  return _axios({
    url: config.v5 + "/admin/attendance-group/inGroup",
    method: "get",
    params
  });
}
//没在考勤组的用户
export function attendanceGroupOutGroup(params) {
  return _axios({
    url: config.v5 + "/admin/attendance-group/outGroup",
    method: "get",
    params
  });
}
//创建考勤计划
export function attendanceGroupPlan(data) {
  return _axios({
    url: config.v5 + "/admin/attendance-group/plan",
    method: "post",
    data
  });
}
//删除考勤计划
export function attendanceGroupPlanDelete(data) {
  return _axios({
    url: config.v5 + "/admin/attendance-group/plan",
    method: "delete",
    data
  });
}
//自定义考勤计划列表
export function attendanceGroupPlanScence() {
  return _axios({
    url: config.v5 + "/admin/attendance-group/plan/scence",
    method: "get",
  });
}
//法定节假日考勤计划列表
export function attendanceGroupPlanSystem() {
  return _axios({
    url: config.v5 + "/admin/attendance-group/plan/system",
    method: "get",
  });
}
//考勤节假日日期数据
export function attendanceGroupPlanTotal(params) {
  return _axios({
    url: config.v5 + "/admin/attendance-group/plan/total",
    method: "get",
    params
  });
}

// export const searchPoliceByParams = async (param: any) => {
//   const { data } = await request.post(`/v5/policeperson/getbyparam`, param)
//   return data
// }

// 住户列表
export function getPeople(params: Object) {
  return _axios({
    url: config.v5 + "/admin/scence-user/page",
    method: "get",
    params
  });
}