<template>
  <div>
    <el-dialog
      title="考勤规则说明"
      :visible="dialog.visible"
      width="500px"
      :before-close="handleClose"
    >
    <div class="work inWork">
        <div class="label">上班时间：</div>
        <div class="value">当天（0：00）的第一次通行记录（进）时间，含人脸通行、二维码通行、门禁卡通行、密码通行。</div>
      </div>
      <div class="work outWork">
        <div class="label">下班时间：</div>
        <div class="value">当天（23:59:59）最后一次通行记录（出）时间。如果当前楼栋无出口门禁，则不提供下班时间</div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Mixins,
  Emit,
  Watch
} from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { MessageBox } from "element-ui";



@Component({
  components: {},
  computed: {}
})
export default class DialogPersonDetail extends Vue {
  dialog: any = {
    visible: false
  };

  created() {}

  async getOfficeBuilding() {
    let { data } = await getOfficeBuilding();
  }

  confirm() {}

  handleClose() {
    this.dialog.visible = false;
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    padding-top: 5px;
  }
}
.work{
  display: flex;
  >.label{
    width: 110px;
    font-weight: 600;
    color:#000
  }
  >.value{
    
  }
  margin-bottom:30px;
}
</style>
