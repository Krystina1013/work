import Vue from "vue";

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import "./plugins/axios";
import App from "./App.vue";

import router from "./router";
import store from "./store/index";

import "@/icons"; // icon
import "@/permission"; // permission control

import "./plugins/element.js";
import BaiduMap from "vue-baidu-map";
import vueJsonp from "vue-jsonp";
import echarts from "echarts";
import dataV from "@jiaminghi/data-view";
import * as constant from "@/config/constant.ts";
import * as util from "@/utils/index.js";

Vue.filter('ignoreYear', function(val) {
  if(!val){
    return '';
  }
  let str =val.replace(/\-/g, '/')
  return str.substring(2,10)
});
Vue.filter('ignoreYearAndSecond', function(val) {
  if(!val){
    return '';
  }
  return val.substring(2,16)
});
Vue.filter('date', function(val) {
  return val?val.split(" ")[0]:""
});
Vue.filter('percent', function(val) {
  return Math.round(val * 100) / 100 + "%"
});
Vue.prototype.$echarts = echarts;
Vue.prototype.$constant=constant;
Vue.prototype.$util=util;
Vue.use(vueJsonp);
Vue.use(dataV);
Vue.use(BaiduMap, {
  ak: "vCZU88Guz4BmAODWTm8k9BP0WlwId1V0"
});
import "@/styles/index.scss"; // global css

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
