import { Message } from "element-ui";
import Cookie from "js-cookie";

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (("" + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a")
      return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

export function weekDate() {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  var s = parseTime(new Date(start));
  var e = parseTime(new Date(end));
  return [s, e];
}
//当前月份
export function getMonth(){
  let Y, M;
  const date = new Date();
  Y = date.getFullYear();
  M = date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  return `${Y}-${M}`
}
// 日期格式化
export function formatTime(datetime) {
  let Y, M, D, W, H, Min, S;
  let date = new Date(datetime);
  Y = date.getFullYear();
  M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  W = date.getDay();
  H = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  Min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  S = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  switch (W) {
    case 1:
      W = "星期一";
      break;
    case 2:
      W = "星期二";
      break;
    case 3:
      W = "星期三";
      break;
    case 4:
      W = "星期四";
      break;
    case 5:
      W = "星期五";
      break;
    case 6:
      W = "星期六";
      break;
    case 7:
      W = "星期天";
      break;
  }
  const time = {
    ymd: Y.toString() + "年" + M.toString() + "月" + D + "日",
    week: W,
    hour: H.toString() + ":" + Min.toString(),
    sec: ":" + S.toString()
  };

  return time;
}

// 日期格式化
export function formatTimeObj(datetime, type = "day") {
  if (!datetime) return "";
  let Y, M, D, W, H, Min, S;
  let date = new Date(datetime);
  Y = date.getFullYear();
  M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  H = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  Min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  S = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if(type=='time'){
    return H.toString() +
    ":" +
    Min.toString()
  }
  return type === "day"
    ? Y.toString() + "-" + M.toString() + "-" + D
    : Y.toString() +
    "-" +
    M.toString() +
    "-" +
    D +
    " " +
    H.toString() +
    ":" +
    Min.toString() +
    ":" +
    S.toString();
}

// 今日时间格式化
export function todayTime() {
  let Y, M, D, endY, endM, endD;
  let date = new Date(); //当前时间
  var nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000); //后一天
  Y = date.getFullYear();
  M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  endY = nextDate.getFullYear();
  endM =
    nextDate.getMonth() + 1 < 10
      ? "0" + (nextDate.getMonth() + 1)
      : nextDate.getMonth() + 1;
  endD =
    nextDate.getDate() < 10 ? "0" + nextDate.getDate() : nextDate.getDate();
  const time = [
    Y.toString() + "-" + M.toString() + "-" + D + " " + "00:" + "00",
    endY.toString() + "-" + endM.toString() + "-" + endD + " " + "00:" + "00"
  ];
  return time;
}

// 今日时间格式化
export function todayYM() {
  let Y, M;
  let date = new Date(); //当前时间
  Y = date.getFullYear();
  M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const time = [Y.toString() + "-" + M.toString()];
  return time;
}

// 近七日日期
export function nearlySevenDays() {
  var now = new Date();
  var nowTime = now.getTime();
  var oneDayTime = 24 * 60 * 60 * 1000;
  var ShowTime, myDate, month, date;
  const SevenDays = [];

  for (var i = 0; i > -7; i--) {
    ShowTime = nowTime + i * oneDayTime;

    //初始化日期时间
    myDate = new Date(ShowTime);
    month =
      myDate.getMonth() + 1 < 10
        ? "0" + (myDate.getMonth() + 1)
        : myDate.getMonth() + 1;
    date = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
    SevenDays.unshift(month + "/" + date);
  }
  return SevenDays;
}

export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }

  const paramsObj = JSON.parse(
    '{"' +
    search
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  );
  for (const k in paramsObj) {
    paramsObj[k] = decodeURIComponent(paramsObj[k]);
  }
  return paramsObj;
}

// 防抖
export function debounce(fn, time) {
  let timeout = null; // 创建一个标记用来存放定时器的返回值
  return function () {
    clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
    timeout = setTimeout(() => {
      // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
      fn.apply(this, arguments);
    }, time);
  };
}

// 节流
export function _throttle(fn, interval = 200) {
  var last;
  var timer;
  return function () {
    var th = this;
    var args = arguments;
    var now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(th, args);
      }, interval);
    } else {
      last = now;
      fn.apply(th, args);
    }
  };
}

export function message(type = "success", message) {
  if (!Cookie.get("error")) {
    Cookie.set("error", Date.now(), {
      expires: new Date(new Date().getTime() + 3 * 1000)
    }); // 五秒钟内不会重复出现提示框
    Message({
      type: type === "success" ? "success" : "error",
      message,
      customClass: "messageClass",
      showClose: true
    });
  }
}

export function debouncechart(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * 重置一个FORM对像，可设初始值
 * @param allObj FORM对像
 * @param resetObj 初始值对像
 * @return
 */
export function resetObj(allObj, resetObj) {
  for (let key in allObj) {
    if (allObj.hasOwnProperty(key)) {
      if (allObj[key] && allObj[key].constructor === Array) {
        allObj[key] = [];
      } else {
        allObj[key] = "";
      }
    }
  }
  if (resetObj) {
    for (let key in resetObj) {
      if (allObj.hasOwnProperty(key)) {
        allObj[key] = resetObj[key];
      }
    }
  }
}


//获取指定日期指定天数之前或者之后日期
export function getOffsetDate(n, date) {
  let d = date ? new Date(date) : new Date();
  let offsetDate = d.getTime() + 24 * 60 * 60 * 1000 * n;
  return formatTimeObj(offsetDate);
}

//图片转为base64
export function getBase64(file) {
  return new Promise(function(resolve, reject) {
    let reader = new FileReader();
    let imgResult = "";
    reader.readAsDataURL(file);
    reader.onload = function() {
      imgResult = reader.result;
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.onloadend = function() {
      resolve(imgResult);
    };
  });
}


/**
 * 时间戳转年-月-日 时:分:秒的格式
 * @param nS 时间戳
 */
export function getTimeByTimeStamp(nS) {
  //将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
  // d.cTime = 1539083829787
  let date = new Date(nS);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  date = year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + second;
  return date;
}

//相似度
export function getSimilarityDisplay(similarity) {
  let dispaly = "";
  if (localStorage.similarity) {
      let high = JSON.parse(localStorage.similarity).high;
      let medium = JSON.parse(localStorage.similarity).medium;
      let low = JSON.parse(localStorage.similarity).low;
      similarity = Math.round(similarity * 100) / 100;
      if (similarity >= high) {
          dispaly = `高（${similarity}%）`
      }
      else if (similarity >= medium) {
          dispaly = `中（${similarity}%）`
      } else {
          dispaly = `低（${similarity}%）`
      }
  }
  return dispaly;
}

export function getBase64FromUrl(url) {
  return new Promise((resolve, reject) => {
      if (url.includes(";base64,")) {
          resolve(url);
      } else {
          let img = new Image();
          img.src = appendDomainName(url);
          img.onload = function () {
              let canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;

              let ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              let dataURL = canvas.toDataURL();
              resolve(dataURL);
          };
          img.onerror = function (e) {
              store.commit("disableHttpLoading", false);
              store.commit("showLoading", false);
              Vue.prototype.$message.error("请上传正确的照片");
          }
      }

  })

}

/**
 * 获取浏览器
 */
export function myBrowser() {
  var userAgent = navigator.userAgent;
  var isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) { //判断是否Opera浏览器
      return "Opera"
  }
  ;
  if (userAgent.indexOf("Firefox") > -1) { //判断是否Firefox浏览器
      return "FF";
  }
  ;
  if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
  }
  ;
  if (userAgent.indexOf("Safari") > -1) { //判断是否Safari浏览器
      return "Safari";
  }
  ;
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { //判断是否IE浏览器
      return "IE";
  }
  ;
}

/**
 * 判断一个值是否为空
 * @param value(任意值)
 * @return true(为空)  false(不为空)
 */
export function isNull(value) {
  if (value === undefined || value === "" || value === null) {
      return true;
  }
  if (value.toString().trim() === "") {
      return true;
  }
  return false;
};


/**
 * 校验15位或18位的身份证号码
 */
export function checkIdCardNo(idCardNo) {
  //15位和18位身份证号码的基本校验
  var check = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCardNo);
  return check;
}

//获取当天从0点开始的时间，格式YYYYMMDDHHMMSS
export function getTodayStartTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hour = "00";
  var minute = "00";
  var second = "00";
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  var currentdate;
  currentdate = `${year}-${month}-${strDate} ${hour}:${minute}:${second}`
  return currentdate;
}