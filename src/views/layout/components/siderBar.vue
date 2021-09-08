<template>
  <div>
    <el-menu :default-active="active" class="el-menu-vertical-demo" :unique-opened='true' :collapse="!isCollapse" :default-openeds="openeds" :collapse-transition="false" router>
      <!--  -->
      <div v-for="(routes, index) in routerData" :key="index + 1" :index="String(index)">
        <el-menu-item :index="routes.path!='/'?routes.path+'/'+routes.children[0].path:routes.path+routes.children[0].path" v-if='routes.alwaysShow' :class="[locRoute.indexOf(routes.children[0].path) !== -1 ? 'activeLink' : '',locRoute.indexOf(routes.name) !== -1 ? 'activeLink' : '']">
          <!-- locRoute.indexOf(routes.name)  判断子页面的父与父级是否相同，相同就加上高亮显示 -->
          <template>
            <i :class="['iconfont',routes.children[0].meta.icon]"></i>
            <span slot="title">{{routes.children[0].meta.title}}</span>
          </template>
        </el-menu-item>
        <el-submenu :index="String(index)" v-else>
          <template slot="title">
            <i :class="['iconfont',routes.meta.icon]"></i>
            <span>{{routes.meta.title}}</span>
          </template>
          <el-menu-item-group v-for="(item,i) in routes.children" :key="i">
            <el-menu-item :index="routes.path+'/'+item.path" :class="[ locRoute.indexOf(item.path) !== -1 ? 'activeLink' : '']">
              <span>{{item.meta.title}}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </div>
      <!-- <el-menu-item class="showHidden" @click="toggleMenu">
        <i v-if="!isCollapse" class="el-icon-arrow-right"></i>
        <i v-else class="el-icon-arrow-left"></i>
        <span slot="title">{{ !isCollapse ? "展开" : "收起" }}</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Emit, Watch } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { asyncRoute } from "@/router.ts";
@Component
export default class siberBar extends Vue {
  @Getter("router") router: Array<object>;
  isCollapse: boolean = true;
  @Emit("MenuStatus")
  toggleMenu() {
    this.openeds = [];
    this.isCollapse = !this.isCollapse;
    return this.isCollapse;
  }
  active: string = ""; // 默认打开的导航菜单
  locRoute: string = "";
  openeds: any = [];
  styleObject: Object = {
    color: "#0d1838",
  };
  routerData: any = asyncRoute;
  get Routes() {
    const route = [].concat(this.$router["options"].routes); // [ ...route ] = this.$router['options'].routes
    console.log(this.router);
    return this.router;
  }
  @Watch("$route", { immediate: true })
  routeChange(n, o) {
    this.locRoute = n.path;
    this.active = this.locRoute;
  }
}
</script>

<style lang='scss' scoped>
i {
  font-size: 20px;
  margin-right: 15px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 222px;
  height: 100%;
}
.activeLink {
  background-color: #409eff !important;
  color: white !important;
  .iconfont {
    color: #fff;
  }
}
</style>