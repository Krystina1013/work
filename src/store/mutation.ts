import stateType from "./type";
import state from "./state";
import { MutationTree } from "vuex";
import { setToken, setPassword, setName, setPermission } from '@/utils/auth'

const mutation: MutationTree<stateType> = {
  SET_TOKEN: (state, token: string) => {
    state.token = token
    setToken(token)
  },

  SET_PASSWORD: (state, password: string) => {
    state.password = password
    setPassword(password)
  },

  SET_NAME(state: stateType, name: string) {
    state.name = name
    setName(name)
  },
  SET_PERMISSIONLIST(state: stateType, list: Array<object>) {
    state.permissionList = list
    setPermission(list.join('---'))
  },
  SET_ROUTE(state: stateType, router: Array<object>) {
    state.router = router
  },
  SET_TOTAL(state: stateType, total: number) {
    state.total = total
  },
  GET_WARNING(state: stateType, record: number) {
    state.record = record
  },
  SET_BUILDNAME(state: stateType, buildName: string) {
    state.buildName = buildName
  },
}
export default mutation;
