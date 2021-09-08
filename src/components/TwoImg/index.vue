<template>
  <div v-if="visible" class="big-img-box">
    <div v-if="leftImg" class="imgWrapper">
      <p class="big-title">{{leftTitle}}</p>
      <img class="big-image" :src="leftImg" alt />
    </div>
    <div v-if="rightImg" class="imgWrapper" style="margin-left:20px">
      <p class="big-title">{{rightTitle}}</p>
      <img class="big-image" :src="rightImg" alt />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
@Component
export default class BigImg extends Vue {
  @Prop({ default: "图片" }) leftTitle: string;
  @Prop({ default: "图片" }) rightTitle: string;
  @Prop({ default: false }) visible: Boolean;
  @Prop() leftImg: string;
  @Prop() rightImg: string;
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.big-img-box {
  border: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
  padding: 0 25px 40px 25px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -130px;
  margin-top: -160px;
  background: #fff;
  z-index: 10000;
  display: flex;
}
.big-title {
  margin: 10px 0;
  font-size: 18px;
}
.big-image {
  width: 200px;
  height: 200px;
  vertical-align: middle;
}
</style>
