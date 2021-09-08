<template>
  <div class="layout-content">
    <el-row type="flex" class="row-bg">
      <el-col :span="12"> </el-col>
      <el-col :span="12" justify="end">
        <div class="rightAction">
          <!-- 搜索 -->
          <div class="content">
            <span class="filter-style activeFilter" @click.stop="openPicFilter">
              <i style="color: '#409eff'" class="iconfont icon-guolv"></i>
              过滤
            </span>
            <transition name="el-zoom-in-top">
              <div v-show="visibleFilter" class="filterDialog">
                <div class="word-filter">
                  <span class="filter-name">人&nbsp;&nbsp;&nbsp;像:</span>
                  <el-upload ref="upload" class="avatar-uploader" :action="'action'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeAvatarUpload">
                    <img v-if="picFilterForm.faceUrl" :src="picFilterForm.faceUrl" class="avatar avatar-single" />
                    <i v-else class="el-icon-plus avatar-uploader-icon avatar-single"></i>
                  </el-upload>
                </div>
                <div class="word-filter">
                  <span class="filter-name">相&nbsp; 似&nbsp;度:</span>
                  <el-select v-model="picFilterForm.score" placeholder="请选择" :disabled="picFilterForm.faceUrl==''">
                    <el-option v-for="item in similarity" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div class="word-filter">
                  <span class="filter-name">时间范围:</span>
                  <el-select v-model="time" placeholder="请选择" @change="changeTime">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </div>
                <div class="word-filter" v-show="time == 4">
                  <span class="filter-name">开始时间:</span>
                  <el-date-picker v-model="picFilterForm.startTime" @change="startChange" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :clearable="false" size="mini" style="width: 222px">
                  </el-date-picker>
                </div>
                <div class="word-filter" v-show="time == 4">
                  <span class="filter-name">结束时间:</span>
                  <el-date-picker v-model="picFilterForm.endTime" @change="endChange" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :clearable="false" size="mini" style="width: 222px">
                  </el-date-picker>
                </div>

                <div class="word-filter">
                  <span class="filter-name">摄&nbsp;像&nbsp;机:</span>
                  <el-radio v-model="deviceAll" label="1" @change="changeDeviceAll">全部</el-radio>
                  <el-radio v-model="deviceAll" label="2" @change="changeDeviceAll">指定</el-radio>
                </div>
                <div class="word-filter" v-if="deviceAll == '2'">
                  <span class="filter-name">选&nbsp;&nbsp;&nbsp;择:</span>
                  <el-button size="small" type="primary" @click="openDialogChooseCamera">选择摄像机</el-button>
                </div>
                <div class="word-filter" v-if="deviceAll == '2'">
                  <span class="filter-name">已&nbsp;&nbsp;&nbsp;选:</span>
                  <div class="choose">
                    <span v-for="(item, i) in chooseCameraList" :key="i">{{
                      item.name
                    }}</span>
                  </div>
                </div>
                <el-button class="fliterBtn" type="primary" plain size="small" @click="picSearch">筛选</el-button>
                <el-button style="margin-right: 10px" class="fliterBtn" type="warning" plain size="small" @click="clearPicSearch">清空条件</el-button>
              </div>
            </transition>
          </div>
          <el-tag v-if="hasProty" closable @close="clearFilterFormfresh">
            查询
            <span style="color: red">{{ pageInfo.total }}</span>条结果
          </el-tag>
          <span class="total">总共:{{ pageInfo.total }}条</span>
          <i @click.stop="(visible = !visible), (visibleFilter = false)" style="font-size: 16px; margin-right: 20px; cursor: pointer" class="iconfont icon-shezhi"></i>

          <transition name="el-zoom-in-top">
            <div v-show="visible" class="setting">
              <span>每页显示:</span>
              <el-select @change="sizeChange" style="width: 100px; margin-left: 10px" v-model="size" placeholder="请选择">
                <el-option v-for="item in pageSize" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </transition>
        </div>
      </el-col>
    </el-row>
    <ChooseCamera @close="closeChooseCamera" @submit="comfirmChooseCamera" :visible="dialogChooseCamera.visible" :camera="dialogChooseCamera.camera"></ChooseCamera>
  </div>
</template>

<script lang="ts">
const date = new Date();
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import ChooseCamera from "../../importantPerson/components/chooseCamera.vue";
import config from "@/api/config";

import { getBase64, getTodayStartTime } from "@/utils/index.js";
import { subDays, format } from "date-fns";
@Component({
  components: { ChooseCamera },
})
export default class extends Vue {
  @Prop({ default: "cap" }) activeName: string;
  @Prop({ default: {} }) pageInfo: object;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  config: any = config;
  visibleFilter: Boolean = false; // 筛选dialog状态框
  private visible: boolean = false; // 数据显示条数dialog状态
  hasProty: boolean = false; // 有无筛选条件
  //   筛选
  picFilterForm: any = {
    faceUrl: "",
    score: "",
    startTime: format(subDays(date, 30), "yyyy-MM-dd HH:mm:ss"),
    endTime: format(date, "yyyy-MM-dd HH:mm:ss"),
  };
  time: any = 3; //时间范围
  dateRange: Array<string> = [];
  options: Array<object> = [
    {
      value: 1,
      label: "当天",
    },
    {
      value: 2,
      label: "7天内",
    },
    {
      value: 3,
      label: "30天内",
    },
    {
      value: 4,
      label: "自定义",
    },
  ];
  size: string = "20";
  private pageSize: Array<Object> = [
    // 数据显示条数数组
    {
      label: "20",
      value: 20,
    },
    {
      label: "30",
      value: 30,
    },
    {
      label: "50",
      value: 50,
    },
  ];
  //相似度
  similarity: Array<object> = [];
  deviceAll: string = "1"; //选择摄像机-全部，还是单个
  chooseCameraList: Array<object> = []; //选择的摄像机
  已: Array<object> = []; //选择的摄像机
  dialogChooseCamera: any = {
    visible: false,
    camera: [],
  };
  search: boolean = false;

  created() {
    this.similarity = JSON.parse(localStorage.similarityList) || [];
    this.getFaceCapture();
  }
  mounted() {
    document.body.addEventListener("click", (e) => {
      if (this.$el.contains(e["target"] as HTMLElement)) {
        return;
      } else {
        this.visibleFilter = false;
        this.visible = false;
      }
    });
  }
  startChange() {
    let time = this.comptime();
    if (time != undefined && time <= 0) {
      this.picFilterForm["startTime"] = "";
      this.$message.warning("开始时间不能大于等于结束时间");
    }
  }
  endChange() {
    let time = this.comptime();
    if (time != undefined && time <= 0) {
      this.picFilterForm["endTime"] = "";
      this.$message.warning("结束时间不能小于等于开始时间");
    }
  }
  // 时间比较
  comptime() {
    var beginTime = this.picFilterForm["startTime"];
    var endTime = this.picFilterForm["endTime"];
    if (!!beginTime && !!endTime) {
      var beginTimes = beginTime.substring(0, 10).split("-");
      var endTimes = endTime.substring(0, 10).split("-");

      beginTime =
        beginTimes[1] +
        "-" +
        beginTimes[2] +
        "-" +
        beginTimes[0] +
        " " +
        beginTime.substring(10, 19);
      endTime =
        endTimes[1] +
        "-" +
        endTimes[2] +
        "-" +
        endTimes[0] +
        " " +
        endTime.substring(10, 19);

      var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
      return a;
    }
  }

  //人脸抓拍
  getFaceCapture() {
    let arr: Array<string> = [];
    if (this.chooseCameraList.length) {
      this.chooseCameraList.map((item: any) => {
        arr.push(item.id);
      });
    }
    this.$emit("getFaceCapture", this.picFilterForm, arr);
  }
  sizeChange() {}
  reset() {
    this.visibleFilter = false;
    this.visible = false;
    this.hasProty = false;
    this.picFilterForm.faceUrl = "";
    this.picFilterForm.score = "";
  }
  clearFilterFormfresh() {
    this.visibleFilter = false;
    this.visible = false;
    this.hasProty = false;
    this.pageInfo["total"] = 0;
    this.pageInfo["page"] = 1;
    this.picFilterForm.faceUrl = "";
    this.chooseCameraList = [];
    if (this.activeName == "cap") {
      this.picFilterForm.score = "";
    }
    this.time = 1;
    this.deviceAll = "1";
    this.dateRange = [];
    this.$emit("getFaceCapture", this.picFilterForm, []);
  }
  changeTime(i) {
    this.picFilterForm.endTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    switch (i) {
      case 1:
        this.picFilterForm.startTime = format(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        );
        break;
      case 2:
        this.picFilterForm.startTime = format(
          subDays(new Date(), 7),
          "yyyy-MM-dd HH:mm:ss"
        );
        break;
      case 3:
        this.picFilterForm.startTime = format(
          subDays(new Date(), 30),
          "yyyy-MM-dd HH:mm:ss"
        );
        break;
      case 4:
        break;

      default:
        break;
    }
  }
  changeDeviceAll() {
    this.chooseCameraList = [];
  }
  beforeAvatarUpload(file) {
    getBase64(file.raw).then((res) => {
      this.picFilterForm.faceUrl = res;
    });
  }
  openPicFilter() {
    this.visibleFilter = true;
    this.visible = false;
  }
  picSearch() {
    this.picFilterForm.endTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    // if (this.time == 4) {
    //   this.picFilterForm.startTime = this.dateRange.length
    //     ? this.dateRange[0]
    //     : "";
    //   this.picFilterForm.endTime = this.dateRange.length
    //     ? this.dateRange[1]
    //     : "";
    // }
    if (
      this.picFilterForm.startTime == "" ||
      this.picFilterForm.endTime == ""
    ) {
      this.$message.error("请选择时间");
      return;
    }
    if (this.picFilterForm.score == "") {
      this.$message.error("请选择相似度");
      return;
    }
    let arr: Array<string> = [];
    if (this.chooseCameraList.length) {
      this.chooseCameraList.map((item: any) => {
        arr.push(item.id);
      });
    }
    this.hasProty = true;
    this.visibleFilter = false;
    this.visible = false;
    this.$emit("getFaceCapture", this.picFilterForm, arr);
  }
  clearPicSearch() {
    this.picFilterForm.faceUrl = "";
    if (this.activeName == "cap") {
      this.picFilterForm.score = "";
    }
    this.chooseCameraList = [];
    this.time = 1;
    this.deviceAll = "1";
    this.dateRange = [];
  }
  closeFilterDialog() {
    this.hasProty = true;
    this.visibleFilter = false;
  }
  //   打开选择摄像机弹窗
  openDialogChooseCamera() {
    this.dialogChooseCamera.visible = true;
    this.dialogChooseCamera.camera = this.chooseCameraList;
  }
  closeChooseCamera() {
    this.dialogChooseCamera.visible = false;
  }
  comfirmChooseCamera(val) {
    this.chooseCameraList = val;
    this.closeChooseCamera();
  }
}
</script>

<style lang="scss" scoped>
.layout-content {
  padding-left: 10px;
}
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
  }
  .el-tabs__nav .is-top {
    background: transparent;
  }
  .el-tabs__active-bar {
    background: #409eff;
  }
}
.row-bg {
  margin: 10px 0;
  height: 32px;
  .leftAction {
    text-align: left;
    .createBtn {
      margin-right: 10px;
    }
  }
  .rightAction {
    color: #8494a7;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .setting {
      text-align: left;
      padding: 10px;
      width: 200px;
      height: 80px;
      position: absolute;
      top: 40px;
      right: 0px;
      border: 1px solid lightgray;
      box-shadow: 0px 10px 10px gray;
      background: white;
      z-index: 9;
    }
    text-align: right;
    font-size: 14px;
    position: relative;
    .filter-style {
      padding-left: 10px;
      margin-left: 10px;
      margin-right: 10px;
      border-left: 1px solid #dfe6ee;
      cursor: pointer;
    }
    .total {
      padding: 0 10px;
      margin: 0 10px;
      font-size: 14px;
      color: #8494a7;
      border-left: 1px solid #dfe6ee;
      border-right: 1px solid #dfe6ee;
    }
    .iconfont {
      color: #8494a7;
    }
    .houseNum {
      height: 100px;
      color: #8494a7;
      text-align: left;
      .input {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        .input-title {
          display: inline-block;
          white-space: nowrap;
        }
      }
      span {
        margin-right: 10px;
      }
    }
    .icon-chilun {
      font-size: 30px;
      vertical-align: middle;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.content {
  display: inline-block;
  position: relative;
  color: #8494a7;
  &:hover {
    cursor: pointer;
  }
  .filterDialog {
    text-align: left;
    width: 340px;
    height: auto;
    padding: 20px 10px;
    position: absolute;
    z-index: 11;
    left: -250px;
    top: 40px;
    border: 1px solid lightgray;
    box-shadow: 0px 10px 10px gray;
    background: white;
    .fliterBtn {
      float: right;
    }
  }
}
::v-deep {
  .el-date-editor .el-range-separator {
    line-height: 23px;
  }
  .el-range__icon {
    line-height: 26px;
  }
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
  }
  .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-icon-arrow-up {
    line-height: 32px;
  }
}
.flex {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.resultWrapper {
  background: #fff;
  box-shadow: 0px 6px 5px 0px lightgrey;
  padding: 10px;
}
.filter-name {
  margin-right: 10px;
}
.choose {
  span {
    margin-right: 10px;
  }
}
</style>
