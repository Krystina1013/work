import stateType from "./type";
import { getToken, getName, getPassword, getPermission } from '@/utils/auth'
const state: stateType = {
  name: getName(),
  password: getPassword(),
  token: getToken(),
  permissionList: [],
  router: [],
  total: 0,
  record: 0,
  buildName :''
}
export default state
