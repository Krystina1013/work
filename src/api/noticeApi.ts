import _axios from "../plugins/axios";
import config from './config';
//通知发布
export function postMessage(data) {
  return _axios({
    url: config.v5+'/admin/hs-notice/',
    method: 'post',
    data
  })
}
