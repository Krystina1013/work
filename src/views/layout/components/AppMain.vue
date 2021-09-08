<template>
  <div class="contentOut">
    <div class="navMenu" id="navMenu" v-if="status">
      <siderBar @MenuStatus="changeStatus" />
      <div class="logo">
        <span class="iconfont logo-icon icon-logo"></span>
        <span class="logo-span">园区智安管理系统1.1</span>
      </div>
      <!-- <NavMenu @MenuStatus="changeStatus" /> -->
    </div>
    <div class="routerView" id="routerView1" :style="{ width: disableMenu ? '100%' : 'calc(100% - 222px)' }">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import NavMenu from "@/components/NavMenu/index.vue";
import siderBar from "./siderBar.vue";
@Component({
  components: {
    NavMenu,
    siderBar,
  },
})
export default class AppMain extends Vue {
  private disableMenu: Boolean = true;
  get status(): boolean {
    const whiteList = ["dashboard", "statistics"];
    return !whiteList.includes(this.$route.name as string);
  }

  created() {
    this.routeChange();
  }

  changeStatus(status) {
    if (!status) {
      const dom = document.getElementById("navMenu") as HTMLElement;
      dom.style.width = "58px";
    } else {
      const dom = document.getElementById("navMenu") as HTMLElement;
      dom.style.width = "160px";
    }
  }
  @Watch("$route")
  routeChange() {
    const whiteList = ["dashboard", "statistics"];
    // const dom = document.getElementById("routerView1") as HTMLElement;
    if (whiteList.includes(this.$route.name as string)) {
      this.disableMenu = true;
    } else {
      this.disableMenu = false;
    }
  }
}
</script>
>
<style lang="scss">
.contentOut {
  width: 100%;
  display: flex;
}
.navMenu {
  flex: none;
  overflow: auto;
  overflow-x: hidden;
  height: calc(100vh - 81px);
  background: #3a414f;
  transition: all linear 0.3s;
}

.logo {
  color: rgba(255, 255, 255, 0.2);
  height: 50px;
  font-size: 14px;
  position: fixed;
  width: 222px;
  bottom: 0;
  left: 0;
  display: flex;
  padding: 5px;
  justify-content: space-between;
  align-items: center;
  .logo-icon {
    margin-top: 2px;
    font-size: 16px;
  }
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave {
  opacity: 1;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0.5s;
}
</style>
