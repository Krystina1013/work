<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="新增人像"
      :visible.sync="dialogCreate"
      :width="`${(700 / width_w) * 100}%`"
      :before-close="handleClose"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="130px">
        <el-form-item label="人员名单：" :rules="{ required: true }">
          <div class="photoWrapper">
            <div class="header">
              <div class="left">
                <el-button type="text" style="padding: 0" @click="$refs.file.click()"
                  >上传照片</el-button
                >
                <span v-if="showFile">
                  <input
                    @change="handleChange"
                    ref="file"
                    type="file"
                    multiple="multiple"
                    class="none"
                    accept="image/*"
                    v-if="myBrowser() == 'FF'"
                  />
                  <input
                    @change="handleChange"
                    ref="file"
                    type="file"
                    multiple="multiple"
                    class="none"
                    accept="image/jpg,image/jpeg,image/png,image/bmp"
                    v-else
                  />
                </span>
              </div>
              <div class="right">
                <span class="aBtn" @click="clearAllPortrait">全部清除</span>
              </div>
            </div>
            <div class="body">
              <div
                class="card"
                :key="index"
                v-for="(item, index) in ruleForm.alertFaceBodies"
              >
                <div
                  class="commonPicWrapper cp"
                  @click="showDialogEditPortrait(item, index)"
                >
                  <img class="pic" :src="item.faceUrl" />
                </div>
                <el-form-item
                  label="姓名"
                  :prop="`alertFaceBodies[${index}].name`"
                  label-width="50px"
                  :rules="{
                    required: true,
                    message: '请输入姓名',
                    trigger: 'blur',
                  }"
                >
                  <el-input size="mini" v-model="item.name" maxlength="100"></el-input>
                </el-form-item>
                <i
                  class="iconfont icon-chushaixuanxiang"
                  @click="deletePortrait(index)"
                ></i>
                <span v-if="item.isNew" class="newFace">新</span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <addOrUpdatePerson
      @close="dialogEditPortrait.visible = false"
      :visible="dialogEditPortrait.visible"
      @submit="handleEditPortrait"
      :form="dialogEditPortrait.form"
      :title="dialogEditPortrait.title"
    ></addOrUpdatePerson>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import { getBase64FromUrl } from "@/utils/index";
import { faceDetect, faceUpload, addImportantPerson } from "@/api/police";
import { getBase64, myBrowser } from "@/utils/index.js";
import addOrUpdatePerson from "./addOrUpdatePerson.vue";
import { jsonp } from "vue";
@Component({
  components: { addOrUpdatePerson },
})
export default class importantPerson extends Vue {
  @Prop({ default: false }) dialogCreate: boolean;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  config: any = config;
  showFile: boolean = true;
  loading: boolean = false;
  dialogEditPortrait: any = {
    visible: false,
    form: {},
    title: "",
  };
  curPortraitIndex: any = "";
  ruleForm: any = {
    alertFaceBodies: [],
  };
  myBrowser() {
    return myBrowser();
  }
  handleClose() {
    this.clearAllPortrait();
    this.$emit("close");
  }
  showDialogEditPortrait(item, index) {
    this.curPortraitIndex = index;
    this.dialogEditPortrait.form = { ...item };
    this.dialogEditPortrait.visible = true;
    this.dialogEditPortrait.title = "编辑人像";
  }
  deletePortrait(index) {
    this.ruleForm.alertFaceBodies.splice(index, 1);
    this.initFile();
  }
  //全部清除
  clearAllPortrait() {
    this.ruleForm.alertFaceBodies = [];
    this.initFile();
  }

  initFile() {
    this.showFile = false;
    this.$nextTick(() => {
      this.showFile = true;
    });
  }
  //上传图片
  handleChange(e) {
    for (let i = 0; i < e.target.files.length; i++) {
      let arr = ["image/jpg", "image/jpeg", "image/png", "image/bmp"];
      if (arr.indexOf(e.target.files[i].type) == -1) {
        this.$message.error("请上传jpg、JPEG、png、bmp格式图片！");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload = async () => {
        this.ruleForm.alertFaceBodies.push({
          name: "",
          fileName: e.target.files[i].name,
          faceUrl: reader.result,
        });
      };
    }
  }
  handleSubmit() {
    if (!this.ruleForm.alertFaceBodies.length) {
      this.$message.error("请上传照片");
      return;
    }
    this.$refs.ruleForm["validate"](async (valid) => {
      if (valid) {
        this.loading = true;
        let isFace = true; //是否检测人脸成功
        for (let i in this.ruleForm.alertFaceBodies) {
          if (this.ruleForm.alertFaceBodies[i].faceUrl.indexOf("base64") == -1) continue;
          try {
            let res: any = await faceDetect({
              base64: this.ruleForm.alertFaceBodies[i].faceUrl,
            });
            if (res.data.code != 200) {
              this.$message.error(res.data.message);
              this.loading = false;
              isFace = false;
              return;
            }
          } catch (error) {
            this.loading = false;
            isFace = false;
            return;
          }
        }
        if (!isFace) return;
        let param = JSON.parse(JSON.stringify(this.ruleForm))
        Promise.all(
          param.alertFaceBodies.map((item) => getBase64FromUrl(item.faceUrl))
        ).then((base64List) => {
          Promise.all(
            base64List.map((item) =>
              faceUpload({ base64: item }).catch((err) => {
                this.loading = false;
              })
            )
          ).then((resultList) => {
            resultList.map((item: any, index) => {
              param.alertFaceBodies[index].faceUrl = item.data.data;
            });
            
            this.loading = false;
            this.$emit("submit", param);
          });
        });
      }
    });
  }
  //确认编辑人像信息
  handleEditPortrait(val) {
    this.dialogEditPortrait.visible = false;
    this.ruleForm.alertFaceBodies.splice(this.curPortraitIndex, 1, {
      ...val,
    });
  }
}
</script>

<style lang="scss" scoped>
.none {
  display: none;
}
.header {
  .right span {
    cursor: pointer;
  }
}
.photoWrapper {
  margin-top: 10px;
  line-height: 18px;
  > .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  > .body {
    display: flex;
    flex-wrap: wrap;
    max-height: 420px;
    min-height: 220px;
    overflow: auto;
    .card {
      width: 150px;
      margin-right: 40px;
      position: relative;
      &:nth-child(4n + 0) {
        margin-right: 0px;
      }
      .icon-chushaixuanxiang {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        color: red;
      }
      .newFace {
        display: inline-block;
        padding: 0px 3px;
        background: #c03535;
        color: #fff;
        position: absolute;
        top: 0px;
        left: 0px;
        opacity: 0.7;
      }
    }
  }
}
//通用人像展示样式，等比缩放
.commonPicWrapper {
  width: 150px;
  height: 150px;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  .pic {
    width: auto;
    height: auto;
    max-width: 145px !important;
    max-height: 145px !important;
    cursor: pointer;
  }
}
</style>
