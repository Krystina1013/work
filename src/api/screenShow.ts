import _axios from "../plugins/axios";
import config from './config';
// 大屏人员流量统计曲线图
export function homePassTable() {
  return _axios({
    url:config.v5+ "/admin/people-pass/homePassTab",
    method: "get"
  });
}

// 大屏车辆流量统计曲线图
export function vehiclePassTable() {
  return _axios({
    url:config.v5+ "/admin/car-pass/homePassTab",
    method: "get"
  });
}

// 办公室使用情况信息
export function houseSpace() {
  return _axios({
    url:config.v5+ "/admin/hsHouse/homeHouse",
    method: "get"
  });
}

// 车位信息
export function vehicleSpace() {
  return _axios({
    url:config.v5+ "/admin/car-space/homeCarsPace",
    method: "get"
  });
}

//办公成员信息
export function residentSpace() {
  return _axios({
    url:config.v5+ "/admin/usrUser/homeUser",
    method: "get"
  });
}

// 车辆信息
export function carSpace() {
  return _axios({
    url:config.v5+ "/admin/usr-car/homeCar",
    method: "get"
  });
}

// 大屏用户使用情况
export function userSpace() {
  return _axios({
    url:config.v5+ "/admin/lsp/userStatistics",
    method: "get"
  });
}

// 今日进入人次
export function personPass() {
  return _axios({
    url:config.v5+ "/admin/lsp/inOutPeopleCount",
    method: "get"
  });
}

// 今日进/出车次
export function carPass() {
  return _axios({
    url:config.v5+ "/admin/lsp/inOutCarCount",
    method: "get"
  });
}

//告警
export function alartTotle(params) {
  return _axios({
    url:config.v5+ "/admin/usr-early-report",
    method: "get",
    params
  });
}

export function getGatherPerson(params: object) {
  return _axios({
    url:config.v5+ "/admin/people-pass/homeList",
    method: "get",
    params
  });
}

export function getGatherCar(params: object) {
  return _axios({
    url:config.v5+ "/admin/car-pass/homeOrderVisitCar",
    method: "get",
    params
  });
}
