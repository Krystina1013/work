<template>
  <div id="top-header">
    <div class="header-hint">
      <img class="header-logo" src="../components/img/logo.png" alt="" />
      <div class="header-info">
        <span>
          {{ date.ymd }}&nbsp;&nbsp;{{ date.week }}&nbsp;&nbsp;{{
            date.hour + date.sec
          }}&nbsp;&nbsp;
        </span>
        <span>22℃</span>
        <span class="cloud-icon"></span>
      </div>
    </div>
    <p class="header-title">共建和谐小区</p>
  </div>
</template>

<script>
import { formatTime } from "@/utils";

export default {
  name: "TopHeader",
  data() {
    return {
      date: {
        ymd: "2020年04月24日",
        week: "星期一",
        hour: "00:00",
        sec: ":00"
      },
      timer: null
    };
  },

  mounted() {
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = formatTime(new Date());
    }, 1000);
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },

  methods: {
    routerback() {
      this.$router.back(-1);
    }
  }
};
</script>

<style lang="less">
#top-header {
  position: relative;
  width: 100%;
  height: 104px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  background-image: url("../components/img/header.png");
  background-size: 100% 100%;
  background-position: center;
  margin-bottom: 18px;

  .header-hint {
    width: 100%;
    position: absolute;
    top: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    white-space: nowrap;
  }

  .header-logo {
    width: 104px;
    height: 32px;
  }

  .header-info {
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #e4f5ff;
    text-align: left;
    line-height: 20px;
  }

  .cloud-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url("../components/img/cloud.png");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-position: 0px 3px;
  }
  .header-title {
    font-size: 48px;
    color: #9dc6dd;
    margin: 28px auto;
  }
}
</style>
