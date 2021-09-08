<template>
  <div class="login-container">
    <div class="head_title">欢迎使用南风云智安办公管理后台系统</div>
    <el-form auto-complete="on" :model="loginForm" ref="loginForm" :rules="loginRules" label-position="left" label-width="100px" class="card-box login-form">
      <div class="title">
        <span class="slogan">欢迎登陆管理系统</span>
      </div>
      <el-form-item prop="scenceName" label="名称：">
        <el-input name="scenceName" type="text" v-model="loginForm.scenceName" auto-complete="on" placeholder="请输入企业名称" @keyup.enter.native="handleLogin" />
      </el-form-item>
      <el-form-item prop="account" label="账号：">
        <el-input name="account" type="text" v-model="loginForm.account" auto-complete="on" placeholder="请输入登录账号" @keyup.enter.native="handleLogin" />
      </el-form-item>
      <el-form-item prop="password" label="密码：">
        <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" auto-complete="on" placeholder="请输入密码"></el-input>
      </el-form-item>

      <div class="auth-code">
        <el-form-item prop="authCode" class="el-form-item-rewrite" label="验证码：">
          <div class="password-class">
            <el-input name="authCode" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.authCode" auto-complete="on" placeholder="请输入验证码"></el-input>
          </div>
        </el-form-item>
        <div @click="fetchAuthCode">
          <img class="auth-img" :src="authURL" alt />
        </div>
      </div>

      <el-form-item>
        <el-button class="login-btn" style="width: 100%" :loading="loading" @click.native.prevent="handleLogin" @keyup.enter.native="handleLogin">登录</el-button>
      </el-form-item>
      <div class="login-info">{{ loginInfo }}</div>
    </el-form>
    <div class="foot">
      <div class="foot_item">
        <img src="../../assets/lenfocus.png" class="foot_img" />
        <div class="foot_content">南风云数字技术有限公司版权所有</div>
      </div>
      <div class="coryright">Copyright © 2020-2021 智安办公管理后台系统</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Provide } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "../../config/minxins";
import { login, getAuthCode } from "../../api/user";
import { getName, setCode, getCode, getPassword } from "@/utils/auth";
import { removeCookie } from "@/utils/cookie.js";
import config from "../../api/config";
@Component({
  mixins: [mixin],
})
export default class Login extends Vue {
  filterForm: object = {
    tag: "no",
  }; //根据关键字查询
  initForm: object = {
    url: "/open/admin/login/",
    method: "post",
  };

  @Getter("name") name: any;
  @Action("SET_NAME") set_name: any;
  @Action("SET_TOKEN") set_token: any;
  @Action("SET_PASSWORD") set_password: any;

  private codeName: String = "";
  private rememberPSW: Boolean = false;
  private authCode: Object = {
    width: 150,
    height: 52,
  };
  private authURL: String = "";
  private loginForm: Object = {
    account: "",
    password: "",
    scenceName: "",
    authCode: "",
    authKey: "",
  };

  private loginRules: Object = {
    password: [{ required: true, trigger: "blur", message: "密码不能小于6位" }],
    authCode: [{ required: true, trigger: "blur", message: "验证码不能为空" }],
    // authCode: [{ required: true, trigger: "blur", validator: "请输入验证码" }]
  };

  private loginInfo: String = "";
  private loading: Boolean = false;

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数

    if (getName()) {
      this.loginForm["account"] = getName();
    }
    if (getPassword()) {
      this.loginForm["password"] = getPassword();
      this.rememberPSW = true;
    }
    if (getCode()) {
      this.loginForm["scenceName"] = getCode();
    }

    this.fetchAuthCode();
  }

  mounted() {
    this.checkUserInfo();
  }

  // 检查是否已登录, 错误不做处理
  checkUserInfo() {
    // this.$store.dispatch('GetInfo').then(() => {
    // this.$router.push({ path: '/' })
    // }).catch(() => {})
  }

  rememberPassword() {
    /**@description 记住密码 */
    console.log(this.rememberPSW);
  }

  fetchAuthCode() {
    var chars = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];

    for (var i = 0; i < 32; i++) {
      var id = Math.floor(Math.random() * 61);
      this.loginForm["authKey"] += chars[id];
    }
    this.authURL = `${config.v5}/open/admin?authKey=${this.loginForm["authKey"]}&&width=${this.authCode["width"]}&&height=${this.authCode["height"]}`;
  }

  async codeFocus(val) {
    await getAuthCode({ code: val }).then((res) => {
      if (res.data.code === 200) {
        this.codeName = res.data.data;
        if (this.codeName != "1") {
          this["message"]("error", "没有找到场景类型");
          return;
        }
      }
    });
  }

  async handleLogin() {
    // if(this.codeName === "" || this.codeName === undefined || this.codeName === null){
    //   await this.codeFocus(this.loginForm["scenceName"])
    // }
    // if (this.codeName != "1") {
    //   this["message"]("error", "没有找到场景类型");
    //   return;
    // }
    this.$refs.loginForm["validate"]((valid) => {
      if (valid) {
        this.loading = true;
        login(this.loginForm)
          .then((response) => {
            this.loading = false;
            setCode(this.loginForm["scenceName"]);
            this.set_name(response.data.data.name);
            this.set_token(response.data.data.token);
            if (this.rememberPSW) {
              this.set_password(this.loginForm["password"]);
            } else {
              removeCookie("password");
            }
            this.$router.push({ path: "/" });
          })
          .catch((err) => {
            this.fetchAuthCode();
            this.loading = false;
            this.loginInfo = err.response.data.message;
          });
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$black_gray: #000;
$FFDeg: -45deg;
$transFF: $FFDeg, rgba(0, 160, 140, 0.85), rgba(30, 40, 129, 0.85);
$transSS: $FFDeg, rgba(0, 160, 140, 0.75), rgba(30, 40, 129, 0.75);
$transGG: $FFDeg, rgb(255, 255, 255), rgb(255, 255, 255);
$primary_btn: #409eff;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url("../../assets/page-login.png") no-repeat center center;
  // background: -webkit-linear-gradient($transSS); /* Safari 5.1 - 6.0 */
  // background: -o-linear-gradient($transSS); /* Opera 11.1 - 12.0 */
  // background: -moz-linear-gradient($transSS); /* Firefox 3.6 - 15 */
  // background: linear-gradient($transSS); /* 标准的语法（必须放在最后） */
  input:-webkit-autofill {
    -webkit-text-fill-color: rgb(0, 0, 0) !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  .title {
    color: #fff;
    margin: 0 auto 30px;
    font-size: 36px;
    text-align: center;
    .logo {
      color: yellow;
      font-size: 30px;
    }
    .slogan {
      color: #409eff;
      font-size: 24px;
      text-align: center;
    }
  }
  input {
    background: transparent;
    -webkit-appearance: none;
    border-radius: 5px;
    border-color: #c1dbff;
    padding: 12px 5px 12px 15px;
    color: $black_gray;
    height: 32px;
    width: 276px;
  }
  .el-input {
    display: inline-block;
    height: 32px;
    width: 85%;
  }
  .el-form-item__content {
    line-height: 0px;
    left: -45px;
  }
  .login-info {
    font-size: 14px;
    text-align: center;
    color: #ff4949;
    margin-bottom: 10px;
  }
  .login-form {
    position: absolute;
    width: 475px;
    height: 396px;
    top: 57%;
    left: 63%;
    margin-left: -240px;
    margin-top: -246px;
    padding: 20px 60px 15px 60px;
    box-sizing: border-box;
    border-radius: 5px;
    background: -webkit-linear-gradient($transGG); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient($transGG); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient($transGG); /* Firefox 3.6 - 15 */
    background: linear-gradient($transGG); /* 标准的语法（必须放在最后） */
  }

  .auth-code {
    display: flex;
    margin-bottom: 30px;
  }
  .el-form-item-rewrite {
    width: 250px;
    margin-right: 10px;
    margin-bottom: 0px;
  }
  .login-btn {
    background-color: $primary_btn;
    border-color: $primary_btn;
    height: 40px;
    font-size: 14px;
    color: #fff;
  }
}

.password-class {
  input {
    width: 196px;
  }
}
.auth-img {
  width: 71px;
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
.remember-psw {
  position: absolute;
  left: 0px;
  bottom: -36px;
  top: 70px;
}

.el-form--label-left .el-form-item__label {
  text-align: end;
  height: 33px;
  position: relative;
  bottom: 3px;
  left: -35px;
}
.head_title {
  font-size: 32px;
  font-weight: 500;
  margin-top: 76px;
  margin-left: 80px;
}
.foot {
  width: 100%;
  height: 95px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  top: 70%;
  .coryright {
    font-size: 18px;
    color: #b3b3b3;
    position: absolute;
    top: 70%;
  }
}
.foot_img {
  width: 125px;
  height: 34px;
  opacity: 1;
}
.foot_item {
  display: flex;
  .foot_content {
    font-weight: 500;
    margin-left: 30px;
    width: 350px;
    height: 40px;
    opacity: 1;
    font-size: 21px;
    line-height: 32px;
  }
}
</style>
