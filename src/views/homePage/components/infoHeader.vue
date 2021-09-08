<template>
  <div class="info_header">
    <p>{{ title }}</p>
    <i :class="['iconfont', icon]"></i>
    <p class="value">{{ value }}</p>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      default: ""
    },
    title: {
      default: ""
    },
    value: {
      default: 0
    }
  },

  data() {
    return {
    }
  }
}
</script> 

<style lang="scss" scoped>
$width: 1920;
$height: 1000;
@function grid-width($n) {
  @return ($n/$width) * 100vw;
}
@function grid-height($n) {
  @return ($n/$height) * 100vh;
}

.info_header {
  position: relative;
  height: 120px;
  width: 16.67%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 6px 18px 0px rgba(0, 0, 0, 0.06);
  padding: 20px;
  margin-right: 15px;
  .iconfont {
    position: absolute;
    bottom: 5px;
    font-size: 58px;
    color: #f0f6fd;
  }
  p {
    font-size: 18px;
    font-family: PingFang SC, PingFang SC-Bold;
    font-weight: 700;
    color: #313640;
    text-align: right;
    margin-bottom: 5px;
  }
  .value {
    float: right;
    font-size: 38px;
    font-family: DIN, DIN-Bold;
    font-weight: 700;
    color: #409eff;
    margin-top: 10px;
  }
}
</style>