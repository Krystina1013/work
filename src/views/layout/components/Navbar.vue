<template>
  <div class="header">
    <div class="yishi-header">
      <div class="header-left">
        <img src="../../../assets/school-log.png" alt />{{ buildName }}
      </div>
      <div class="header-right">
        <i class="iconfont icon-yonghu"></i>
        <!-- <i class="iconfont icon-icon-user"></i> -->
        <p class="user-name">{{ name }}</p>
        <p class="logout" @click="logout">
          <i class="iconfont icon-tuichu2"></i>退出登录
        </p>
      </div>
    </div>

    <el-dialog title="使用建议" :visible.sync="dialogVisible" width="402px" :before-close="handleClose">
      <el-form ref="feedFrom" :model="feedbackFrom" label-width="82px" :rules="rules">
        <el-form-item label="意见反馈: " prop="content">
          <el-input type="textarea" :rows="8" v-model="feedbackFrom.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitFeedback">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

import { clearCookie } from "@/utils/cookie";
import { Getter } from "vuex-class";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import { getScene } from "@/api/screenApi.ts";
import { alartTotle } from "@/api/alarmApi.ts"; //获取目标访客受访人信息
import { feedback } from "@/api/user.ts";
import store from "@/store";

@Component({
  components: {
    Breadcrumb,
  },
  computed: {
    warningCount() {
      return store.getters.warningCount;
    },
  },
})
export default class Navbar extends Vue {
  @Getter("name") name: string;
  @Getter("buildName") buildName: string;
  @Getter("permissionList") permissionList: Array<string>;

  sceneForm: object = {
    pics: [1],
  };
  private dialogVisible: Boolean = false;
  private feedbackFrom: Object = { content: "" };
  private alarm: Boolean = false;

  private rules: Object = {
    // 表单验证
    content: [{ required: true, message: "请输入反馈意见", trigger: "blur" }],
  };

  routeChange() {
    const whiteList = ["moduleLook", "moduleUpdate"];
    for (const item of whiteList) {
      this.alarm = this.permissionList.includes(item);
      if (this.permissionList.includes(item)) {
        this.alarm = true;
        return;
      }
      this.alarm = false;
    }
  }

  alarmBtn() {
    if (this.$route.path === "/alarm/module") {
      return;
    }
    this.routeChange();
    if (this.alarm) {
      this.$router.push({ path: "/alarm/module" });
    } else {
      this.$message.error("您没有权限！");
    }
  }

  created() {
    this.routeChange();
    getScene().then((res) => {
      this.sceneForm = Object.assign({}, res.data.data);
      this.$store.commit("SET_BUILDNAME", res.data.data.name);
    });
    // this.getUnchecedCount();
  }

  logout() {
    this.$router.push({ path: "/login" });
    clearCookie();
    location.reload(); // 为了重新实例化vue-router对象 避免bug
  }

  async getUnchecedCount() {
    /** @description 未读警报信息 */
    this.$store.dispatch("GET_WARNING");
  }

  submitFeedback() {
    /**@description 提交反馈
     */
    this.$refs["feedFrom"]["validate"]((valid) => {
      if (valid) {
        feedback(this.feedbackFrom).then((res) => {
          this.$message({
            showClose: true,
            message: "反馈意见成功",
            type: "success",
          });
          this.handleClose();
        });
      }
    });
  }

  handleClose() {
    this.dialogVisible = false;
    this.feedbackFrom["content"] = "";
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$FFDeg: -45deg;
$transSS: $FFDeg, rgba(0, 160, 140, 0.75), rgba(30, 40, 129, 0.75);
$colorFF: black;

p {
  margin: 0;
  padding: 0;
}
.header {
  background: #313640;
  border-bottom: 1px solid #e4e7ed;
}

.yishi-header {
  height: 80px;
  display: flex;
}
.header-left {
  margin-left: 55px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  color: #ffffff;
  img {
    width: 32px;
    height: 32px;
    margin-right: 14px;
  }
}

.header-right {
  position: absolute;
  height: 80px;
  right: 24px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #ffffff;
  img {
    height: 26px;
    width: 26px;
    margin-right: 10px;
  }
}

.logout {
  margin-left: 34px;
  font-weight: 400;
  color: #606266;
  cursor: pointer;
}

.feedback {
  margin-left: 20px;
  text-align: center;
  font-size: 15px;
  color: $colorFF;
  cursor: pointer;
}
</style>
