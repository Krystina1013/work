<template>
  <div>
    <el-dialog
      title="人脸特征信息"
      :visible="show"
      :width="`${(800 / width_w) * 100}%`"
      :before-close="handleClose"
    >
      <div v-if="form.occlusion">
        <div>
          <p>图片质量：<span>{{ form.faceBlur }}</span></p>
        </div>
        <div class="face-score">
          <p class="face-title">遮挡比例</p>
          <div class="flex">
            <p>左眼：<span>{{ form.occlusion.left_eye }}</span></p>
            <p>右眼：<span>{{ form.occlusion.right_eye }}</span></p>
          </div>
          <div class="flex">
            <p>鼻子：<span>{{ form.occlusion.nose }}</span></p>
            <p>嘴巴：<span>{{ form.occlusion.mouth }}</span></p>
          </div>
          <div class="flex">
            <p>左脸颊：<span>{{ form.occlusion.left_cheek }}</span></p>
            <p>右脸颊：<span>{{ form.occlusion.right_cheek }}</span></p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @(Prop({ default: false })!) show: boolean;
  @Prop() form: object;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  handleClose() {
    this.$emit("close");
  }
}
</script>

<style lang="scss" scoped>
.face-title {
  font-size: 14px;
  margin: 20px 0 10px;
}
.face-score {
  .flex {
    margin-bottom: 10px;
    p {
      width: 50%;
    }
  }
}
</style>