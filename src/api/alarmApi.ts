import _axios from "../plugins/axios";
import config from './config';
//修改告警管理

//修改告警管理
export function editStall(data: any) {
  return _axios({
    url:config.v5+ `/admin/usr-early-report/${data.id}/`,
    method: "patch",
    data
  });
}

//告警未读总数
export function alartTotle() {
  return _axios({
    url: config.v5+"/admin/usr-early-report/unread-count/",
    method: "get"
  });
}
