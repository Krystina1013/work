import state from "./state";
import { ActionTree } from "vuex";
import stateType from './type';
import { getRoleList } from '@/api/user.ts'
import { alartTotle } from "@/api/alarmApi.ts"; //获取目标访客受访人信息

function selectRoute(route: Array<object>, role: Array<string>) {
  role = ['pageUpdate','pageLook',...role]
  const Route = [...route]
  const newRoute: Array<object> = Route.filter(ele => {
    let arr: Array<object> = []
    ele['children'].forEach((item: object) => {
      if (role.includes(item['name'] + 'Look')) {
        arr.push(item)
      }
    })
    ele['children'] = arr
    return ele['children'].length > 0
  })

  return newRoute
}

const action: ActionTree<stateType, any> = {
  SET_NAME({ commit, state: stateType }, name: string) {
    commit('SET_NAME', name)
  },

  SET_PASSWORD({ commit, state: stateType }, password: string) {
    commit('SET_PASSWORD', password)
  },

  SET_TOKEN({ commit, state: stateType }, token: string) {
    commit('SET_TOKEN', token)
  },

  SET_TOTAL({ commit, state: stateType }, total: number) {
    commit('SET_TOTAL', total)
  },

  SET_PERMISSIONLIST({ commit, state: stateType }, list: Array<object>) {
    let arr = ["alarmUpdate","alarmLook","firstAppearUpdate","firstAppearLook","realTimeMonitorUpdate","realTimeMonitorLook","videoBoxUpdate","videoBoxLook","cameraManageUpdate","cameraManageLook","captureUpdate","captureLook","identitySearchUpdate","identitySearchLook","importantPersonUpdate","importantPersonLook","chartUpdate","chartLook","listUpdate","listLook","access_cardUpdate","access_cardLook","passagewayUpdate","passagewayLook","ownerUpdate","ownerLook","propertyUpdate","propertyLook","caller Update","caller Look","managementUpdate","managementLook","strangerUpdate","strangerLook","focusUpdate","focusLook","carManageUpdate","carManageLook","carPassUpdate","carPassLook","carportUpdate","carportLook","_manageUpdate","_manageLook","issueUpdate","issueLook","managerUpdate","managerLook","rolePowerUpdate","rolePowerLook","communityUpdate","communityLook","warningLinkUpdate","warningLinkLook","infoUpdate","infoLook","personPassChartLook","carPassChartUpdate","carPassChartLook","visitorCarChartUpdate","visitorCarChartLook","visitorChartUpdate","visitorChartLook","stallUpdate","stallLook","argumentsStallUpdate","argumentsStallLook","moduleLook","moduleUpdate","monitorLook","monitorUpdate","classroomLook","classroomUpdate","laboratoryLook","laboratoryUpdate","libraryLook","libraryUpdate","statisticsLook","statisticsUpdate","attendanceManageLook","attendanceManageUpdate","companyLook","companyUpdate","officeSpaceChartLook","officeSpaceChartUpdate"];
    return new Promise((resolve, reject) => {
      // getRoleList().then((res: any) => {
        commit('SET_PERMISSIONLIST',arr )
        resolve(arr)
      // })
    })
  },

  SELECT_ROUTE({ commit, state: stateType }, obj: object) {
    return new Promise((res, rej) => {
      // const router = selectRoute(obj['route'], obj['role'])
      commit('SET_ROUTE', obj['route'])
      res(obj['route'])
    })
  },

  GET_WARNING({ commit, state: stateType }) {
    return new Promise((resolve, reject) => {
      alartTotle().then((res: any) => {
        commit('GET_WARNING', res.data.data)
        resolve(res)
      });
    })
  }
}
export default action;
