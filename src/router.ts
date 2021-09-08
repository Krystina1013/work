import Vue from "vue";
import Router from "vue-router";
// 路由懒加载
const _import_ = (file: string) => () => import(`@/views/${file}.vue`);
import Layout from "@/views/layout/index.vue";
import homePage from './views/homePage/homePage.vue';
import errorPage404 from "@/views/errorPage/404.vue";

Vue.use(Router);

export const constantRouterMap = [
  {
    path: "/login",
    name: "login",
    component: _import_("login/index"),
    hidden: true
  },

];
export const asyncRoute = [
  {
    path: '/',
    component: Layout,
    redirect: '/page',
    alwaysShow: true,
    children: [{
      path: 'page',
      name: 'page',
      component: _import_("homePage/homePage"),
      meta: { title: '首页', icon: 'icon-home' }
    }]
  },
  {
    path: '/house',
    component: Layout,
    redirect: '/house/chart',
    alwaysShow: false,
    meta: {
      title: '楼栋管理',
      icon: 'icon-zhuzhai'
    },
    children: [
      {
        path: 'list',
        name: "list",
        component: _import_("houseManage/houseList/index"),
        meta: {
          title: '办公室',
          icon: 'icon-fangwufangchan'
        }
      },
      {
        name: "access_card",
        path: "access_card",
        component: _import_("houseManage/cardManage/index"),
        meta: {
          title: "门禁卡",
          icon: "icon-qia",
          bg_color: "#976041"
        }
      },
      {
        name: "passageway",
        path: "passageway",
        component: _import_("houseManage/passagewayManage/index"),
        meta: {
          title: "出入口",
          icon: "icon-churukou",
          bg_color: "#bec037"
        }
      }
    ]
  },
  {
    path: "/person",
    name: "person",
    component: Layout,
    redirect: "/person/owner",
    alwaysShow: false,
    meta: {
      title: "人员管理",
      icon: "icon-renyuanguanli",
    },
    children: [
      {
        name: "owner",
        path: "owner",
        component: _import_("personManage/ownerManage/index"),
        meta: {
          title: "办公室成员",
          icon: "icon-yonghu",
          bg_color: "#83c9a6"
        }
      },
      {
        name: "property",
        path: "property",
        component: _import_("personManage/propertyManage/index"),
        meta: {
          title: "物业人员",
          icon: "icon-wuyeguanli",
          bg_color: "#6197d4"
        }
      },
      {
        name: "caller ",
        path: "caller",
        component: _import_("personManage/vistorManage/index"),
        meta: {
          title: "访客邀请记录",
          icon: "icon-fangkeguanli",
          bg_color: "#796273"
        }
      }
    ]
  },
  {
    path: "/device",
    name: "device",
    component: Layout,
    redirect: "/device/_manage",
    alwaysShow: false,
    meta: {
      title: "设备管理",
      icon: "icon-device",
      bg_color: "#7f7dae"
    },
    children: [
      {
        name: "_manage",
        path: "_manage",
        component: _import_("deviceManage/device/index"),
        meta: {
          title: "门禁设备",
          icon: "icon-shexiangtou1",
          bg_color: "#231d75"
        }
      },
      {
        name: "cameraManage",
        path: "cameraManage",
        component: _import_("deviceManage/cameraManage/index"),
        meta: {
          title: "摄像机管理",
          icon: "icon-xiaoqu"
        }
      }
    ]
  },
  {
    path: "/management",
    name: "management",
    component: Layout,
    redirect: "/management/_ment",
    alwaysShow: true,
    meta: {
      title: "通行记录",
      icon: "icon-personlog",
      bg_color: "#723f42"
    },
    children: [
      {
        name: "_ment",
        path: "_ment",
        component: _import_("personPass/index"),
        meta: {
          title: "通行记录",
          icon: "icon-personlog",
          bg_color: "#723f42"
        }
      }
    ]
  },
  {
    path: "/security",
    name: "security",
    component: Layout,
    redirect: "/security/importantPerson",
    alwaysShow: false,
    meta: {
      title: "安防管理",
      icon: "icon-00FD",
    },
    children: [
      {
        name: "realTimeMonitor",
        path: "realTimeMonitor",
        component: _import_("security/realTimeMonitor/index"),
        meta: {
          title: "实时监控",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "alarm",
        path: "alarm",
        component: _import_("security/alarm/index"),
        meta: {
          title: "预警中心",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "capture",
        path: "capture",
        component: _import_("security/capture/index"),
        meta: {
          title: "智能抓拍",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "importantPerson",
        path: "importantPerson",
        component: _import_("security/importantPerson/index"),
        meta: {
          title: "关注人员",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "identitySearch",
        path: "identitySearch",
        component: _import_("security/identitySearch/index"),
        meta: {
          title: "身份搜索",
          icon: "icon-xiaoqu"
        }
      },
    ]
  },
  {
    path: "/confer",
    name: "confer",
    component: Layout,
    redirect: "/conference/_confer",
    alwaysShow: true,
    meta: {
      title: "会议管理",
      icon: "el-icon-s-ticket",
      bg_color: "#bec037"
    },
    children: [
      {
        name: "_confer",
        path: "_confer",
        component: _import_("conference/index"),
        meta: {
          title: "会议管理",
          icon: "el-icon-s-ticket",
          bg_color: "#bec037"
        }
      }
    ]
  },
  {
    path: "/checkin",
    name: "checkin",
    component: Layout,
    redirect: "/checkin/clock",
    alwaysShow: false,
    meta: {
      title: "考勤管理",
      icon: "icon-checkIn",
      bg_color: "#7f7dae"
    },
    children: [
      {
        name: "clock",
        path: "clock",
        component: _import_("checkIn/index"),
        meta: {
          title: "考勤组设置",
          icon: "icon-chart",
          bg_color: "#231d75"
        }
      },
      {
        name: "_company",
        path: "_company",
        component: _import_("personManage/companyManage/index"),
        meta: {
          title: "考勤数据",
          icon: "icon-fangkeguanli",
          bg_color: "#796273"
        }
      },
      {
        name: "standard",
        path: "standard",
        component: _import_("checkIn/standard"),
        meta: {
          title: "考勤规范",
          icon: "icon-fangkeguanli",
          bg_color: "#796273"
        }
      },
    ]
  },
  {
    path: "/system",
    name: "system",
    component: Layout,
    redirect: "/system/manager",
    alwaysShow: false,
    meta: {
      title: "管理",
      icon: "icon-set",
      bg_color: "#e17f5a"
    },
    children: [
      {
        name: "manager",
        path: "manager",
        component: _import_("roleManage/manager/index"),
        meta: {
          title: "账号管理",
          icon: "icon-guanliyuan",
          bg_color: "#e17f5a"
        }
      },
      {
        name: "community",
        path: "community",
        component: _import_("roleManage/community/index"),
        meta: {
          title: "公司信息",
          bg_color: "#009bba",
          icon: "icon-xiaoqu"
        }
      },
      {
        name: "about",
        path: "about",
        component: _import_("roleManage/aboutUs"),
        meta: {
          title: "关于我们",
          bg_color: "#009bba",
          icon: "icon-xiaoqu"
        }
      },
    ]
  },

]

export default new Router({
  // mode: 'history',
  routes: constantRouterMap
  // scrollBehavior: () => ({
  //   y: 0
  // }),
});
