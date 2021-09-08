<template>
  <div>
    <navbar v-if="status"></navbar>
    <app-main></app-main>
    <!-- <el-row>
      <el-col :span="24">
        <div class="footer">
          <img class="logo" src="../../assets/logo.png" alt />
          <p class="footer-title">南风云智能识别门禁系统</p>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Navbar, AppMain } from "@/views/layout/components";

@Component({
  components: {
    Navbar,
    AppMain
  }
})
export default class Layout extends Vue {
  get status(): boolean {
    const whiteList = ["statistics"];
    return !whiteList.includes(this.$route.name as string);
  }
}
</script>

<style scoped>
.footer {
  width: 100%;
  height: 70px;
  padding: 20px 0;
  border-top: 1px solid rgba(71, 71, 88, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0px;
}
.logo {
  width: 60px;
  height: 20px;
  margin-right: 10px;
}
.header-title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 32px;
}
.footer-title {
  color: #909399;
}
</style>
