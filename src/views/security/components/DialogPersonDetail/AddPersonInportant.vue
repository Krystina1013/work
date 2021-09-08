<template>
  <div>
    <el-dialog class="newDialog" :close-on-click-modal="false" title="添加到关注人员" :visible.sync="visible" width="700px" :before-close="handleCloseAdd" @open="opened">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
        <el-form-item label="人像：" prop="faceUrl" :rules="{ required: true, message: '请上传人像', trigger: 'change' }">
          <img v-if="ruleForm.faceUrl" :src="ruleForm.faceUrl" class="avatar avatar-single" />
        </el-form-item>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="姓名：" prop="name" :rules="[
                { required: true, message: '请输入姓名', trigger: 'blur' },
              ]">
              <el-input v-model="ruleForm.name" maxlength="100" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国籍：" prop="country">
              <el-input v-model="ruleForm.country" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="电话：" prop="phone">
              <!-- @keyup.native="ruleForm.phone=$util.onlyNumber(ruleForm.phone)" -->
              <el-input v-model.number="ruleForm.phone" maxlength="11" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="籍贯：" prop="homeTown">
              <el-input v-model="ruleForm.homeTown" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="证件类型：" prop="cardType">
              <el-select v-model="ruleForm.cardType" placeholder="请选择" style="width: 200px" @change="changeType">
                <el-option v-for="item in certificateTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <div v-show="ruleForm.cardType == '其它'" style="margin-top: 10px">
                证件名称：
                <el-input v-model="otherCardType" style="width: 200px" maxlength="32"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码：" prop="cardNo">
              <el-input v-model="ruleForm.cardNo" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birthday" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" style="width: 200px"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作单位：" prop="jobAddress">
              <el-input v-model="ruleForm.jobAddress" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="ruleForm.sex" placeholder="请选择" style="width: 200px">
                <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="住址：" prop="address">
              <el-input v-model="ruleForm.address" maxlength="32" style="width: 200px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注：" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" :rows="2" :maxlength="200" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseAdd">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="confirmSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import config from "@/api/config";
import { getBase64 } from "@/utils/index.js";
import { addImportant } from "@/api/police";
import { isNull, checkIdCardNo } from "@/utils/index";
@Component
export default class importantPerson extends Vue {
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: {} }) form: any;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  config: any = config;
  otherCardType: string = "";
  ruleForm: any = {
    faceUrl: "",
    name: "",
    phone: "",
    cardType: "",
    cardNo: "",
    birthday: "",
    sex: 3,
    homeTown: "",
    jobAddress: "",
    address: "",
    country: "",
    remark: "",
  };
  currentId: string = "";
  cardType: string = "";
  loading: boolean = false;
  pickerOptions: any = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };
  sexList: Array<object> = [
    { label: "请选择", value: 3 },
    { label: "男", value: 1 },
    { label: "女", value: 2 },
  ];
  certificateTypeList: Array<object> = [
    { label: "身份证", value: "身份证" },
    { label: "护照", value: "护照" },
    { label: "港澳居民来往内地通行证", value: "港澳居民来往内地通行证" },
    { label: "其它", value: "其它" },
  ];
  rules: any = {};
  beforeUpdate() {
    this.rules = {
      phone: [
        {
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (
              isNull(value) ||
              (/^[0-9]*$/.test(value) && (value + "").length == 11)
            ) {
              callback();
            } else {
              callback(new Error("请输入正确的格式"));
            }
          },
        },
      ],
      cardNo: [
        {
          validator: (rule, value, callback) => {
            if (this.ruleForm.cardType != "身份证" || value == "") callback();
            if (checkIdCardNo(value)) {
              callback();
            } else {
              callback(new Error("请输入正确的身份证号码"));
            }
          },
          trigger: "blur",
        },
      ],
    };
  }
  opened() {
    if (!this.visible) return;
    console.log(this.form);
    this.ruleForm.faceUrl = this.form.faceInfo.faceUrl;
    this.ruleForm.name = " ";
    this.currentId = this["form"].groupId;
  }
  changeType(val) {
    this.cardType = val;
  }
  beforeFaceUpload(file) {
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   this.$message.error('上传人脸图片大小不能超过 2MB!');
    //   return;
    // }
    getBase64(file.raw).then((res) => {
      this.ruleForm["faceUrl"] = res;
    });
  }
  handleCloseAdd() {
    // this.ruleForm = {
    //   faceUrl: "",
    //   name: "",
    //   phone: "",
    //   cardType: "",
    //   cardNo: "",
    //   birthday: "",
    //   sex: 3,
    //   homeTown: "",
    //   jobAddress: "",
    //   address: "",
    //   country: "",
    //   remark: "",
    // };
    this.$refs["ruleForm"]["resetFields"]();
    this.$emit("close");
  }
  //添加人像
  confirmSubmit() {
    this.ruleForm.name = this.ruleForm.name.replace(/(^\s*)|(\s*$)/g, "");
    this.$refs["ruleForm"]["validate"](async (valid) => {
      if (valid) {
        let param = {
          id: this.form.groupId,
          alertFaceBodies: [this.ruleForm],
        };
        this.loading = true;
        addImportant(param)
          .then((res) => {
            this.$message.success("添加成功");
            this.loading = false;
            this.handleCloseAdd();
            this.$emit("closeChooseDialog");
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: contain;
  }
}
</style>
