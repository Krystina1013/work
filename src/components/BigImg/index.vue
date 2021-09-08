<template>
  <div v-if="centerDialogVisible" class="big-img-box">
    <p class="big-title">{{ bigTitle }}</p>
    <img class="big-image" :src="bigImg" alt="" />

    <!-- <i class="el-icon-close" @click="closeBigImg"></i> -->
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins, Emit } from "vue-property-decorator";
@Component
export default class BigImg extends Vue {
  @Prop({ default: "图片" }) bigTitle: string;
  @Prop({ default: false }) centerDialogVisible: Boolean;
  @Prop() bigImg: string;

  @Emit("closeBigImg")
  closeBigImg() {
    return false;
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.big-img-box {
  width: 260px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  padding: 0 25px 40px 25px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  position: fixed;
  top: 50%;
  left: 55%;
  margin-left: -130px;
  margin-top: -160px;
  background: #fff;
  z-index: 10000;
}
.big-title {
  margin: 10px 0;
  font-size: 18px;
}
.big-image {
  width: 200px;
  height: 200px;
  vertical-align: middle;
  object-fit: contain;
}

.el-icon-close {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
