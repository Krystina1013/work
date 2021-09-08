<template>
  <div class="app-container">
    <div class="searchWrapper">
      <img class="logo_" src="~@/assets/lenfocus.png" alt />
      <div class="info-box">
        <div class="info tip">
          <p class="title">版本信息</p>
          <p class="info">版本为V1.1.0（正式版本）</p>
          <p>南风云智能识别门禁系统</p>
          <p>版权所有© 南风云数字技术有限公司保留所有权利</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang='scss' scoped>
.searchWrapper {
  padding: 50px 30px;
  display: flex;
  flex-direction: column;
  .logo_ {
    width: 166px;
  }
  .info {
    font-size: 14px;
    line-height: 40px;
  }
  .info-box {
    border-top: 1px solid #33a5fe;
    padding-top: 30px;
    margin-top: 45px;
    position: relative;
    &::before {
      content: "";
      width: 86px;
      height: 6px;
      background: #33a5fe;
      display: inline-block;
      position: absolute;
      left: 0;
      top: -6px;
    }
  }
}
</style>
 
 