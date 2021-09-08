<template>
  <div class="app-container">
    <!-- <div class="layout-top"> -->
    <div class="left-tree">
      <div class="card_title"><i class="iconfont icon-shexiangji" style="color:#409eff"></i>
        <span>监控设备</span>
      </div>
      <div class="search">
        <i class="el-icon-search" @click="search" />
        <el-input placeholder="请输入摄像机名称" v-model="searchVal" @keyup.enter.native="search" size="mini" maxlength="20" style="width:150px" clearable @clear="search"></el-input>
        <div class="search_line"></div>
      </div>
      <div class="tree-list" :style="`height:${height_w - 450}px`">
        <el-tree ref="tree" :data="treeData" :props="defaultProps" :filter-node-method="filterNode">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span @dblclick="dbClick(node, data)" :draggable="data.leaf" @dragstart="dragstart($event, data)" class="pointer" v-if="isPc">
              <span v-if="data.status == 1">
                <i class="iconfont icon-bofang icon-play" v-show="cameraId == data.id"></i>
                <i class="iconfont icon-shexiangji1 icon-canplay" v-show="cameraId != data.id"></i>
              </span>
              <span v-else>
                <i class="iconfont icon-shexiangji1" v-show="data.status != 1"></i>
              </span>
              <span class="text">{{ node.label }}</span>
            </span>
            <span @click="dbClick(node, data)" :draggable="data.leaf" @dragstart="dragstart($event, data)" class="pointer" v-else>
              <span v-if="data.status == 1">
                <i class="iconfont icon-bofang icon-play" v-show="cameraId == data.id"></i>
                <i class="iconfont icon-shexiangji1 icon-canplay" v-show="cameraId != data.id"></i>
              </span>
              <span v-else>
                <i class="iconfont icon-shexiangji1" v-show="data.status != 1"></i>
              </span>
              <span class="text">{{ node.label }}</span>
            </span>
          </div>
        </el-tree>
      </div>
    </div>
    <div class="right_module">
      <div class="middle-camera" @drop="ondrop" @dragover.prevent>
        <div class="camera-name">
          <p class="conceal"> <span class="iconfont icon-shexiangji2 no-sxj-icon" style="color:#409EFF"></span>{{ currentPlayCamera.name }}</p>
          <!-- <div class="top-button">
            <p class="history-btn" @click="openHistory" v-show="reflvUrl" v-if="menu == 1">
              <i class="iconfont icon-Vector"></i><span>历史视频</span>
            </p>
          </div> -->
        </div>
        <div class="camera-info">
          <p :title="currentPlayCamera.name">名称：{{ currentPlayCamera.name }}</p>
          <p :title="currentPlayCamera.addr">地址：{{ currentPlayCamera.addr }}</p>
        </div>
        <div data-name="single" class="single-camera">
          <div style="min-width: 400px" data-name="single">
            <Reflv data-name="single" v-if="reflvUrl" :style="{ width: '100%', height: height_w - 480 + 'px' }" :height="height_w - 480" :url="reflvUrl" ref="reflv" :isPc="isPc" />
          </div>
        </div>
      </div>
      <div class="picture_dev">
        <div class="card_title card_title_bottom">
          <i class="iconfont icon-renlianzhuapai" style="color:#409eff"></i> 人脸抓拍
        </div>
        <div class="pic-list">
          <div class="list-item" v-for="(item, i) in capture" :key="i">
            <div class="face">
              <img :src="item.faceInfo.faceUrl" alt @click="openDialogDetail(item)" />
            </div>
            <p>{{ getTimeByTimeStamp(item.time) }}</p>
            <p v-if="item.cameraCutVo">{{ item.cameraCutVo.name||"" }}</p>
          </div>
        </div>
      </div>
    </div>
    <DialogPersonDetail @close="dialogPersonDetail.visible = false" @trackSearch="trackSearch" :visible="dialogPersonDetail.visible" :form="dialogPersonDetail.form" :hidePersonInfo="true" :hideOriginalFace="true"></DialogPersonDetail>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import { getTimeByTimeStamp } from "@/utils/index";
import {
  getCameraNoPage,
  play,
  unknownFaceRecentCap,
  allAlert,
  capMessage,
  alertRead,
} from "@/api/police";
import DialogPersonDetail from "../components/DialogPersonDetail/DialogPersonDetail.vue";
import Reflv from "./components/Reflv.vue";
import { jsonp } from "vue";
@Component({
  components: { DialogPersonDetail, Reflv },
})
export default class extends Vue {
  config: any = config;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  searchVal: string = "";
  treeData: Array<object> = [];
  defaultProps: any = {
    children: "children",
    label: "name",
  };
  currentPlayCamera: object = {}; //正在播放的摄像机
  cameraId: string = "";
  isDrop: boolean = false;
  isPc: boolean = true;
  reflvUrl: object = {};
  dialogPersonDetail: any = {
    visible: false,
    form: {},
  };
  capture: Array<object> = [];
  alertList: Array<object> = [];
  created() {
    this.check();
    this.getTreeData();
    // this.getNotice();
  }
  getNotice() {
    let param = {
      page: 1,
      pageSize: 15,
      read: false,
    };
    allAlert(param).then((res) => {
      this.alertList = res.data.data.records;
    });
  }
  getTreeData() {
    getCameraNoPage({}).then((res) => {
      res.data.data.map((item) => {
        item.leaf = true;
      });
      this.treeData = res.data.data;
    });
  }
  search() {
    this.$nextTick(() => {
      (this.$refs["tree"] as any).filter(this.searchVal);
    });
  }
  filterNode(value, data) {
    if (!value) return true;
    return data.name.indexOf(value) !== -1;
  }
  dbClick(node, data) {
    if (data.status != 1) {
      this.$message.error("摄像头无法播放!");
      return;
    }
    this.currentPlayCamera = data;
    this.cameraId = data.id;
    this.playReflv(data.id);
    this.getFaceData(data.id);
  }
  dragstart(e, data) {
    this.isDrop = true;
    e.dataTransfer.setData("item", JSON.stringify(data));
  }
  ondrop(e) {
    let data = JSON.parse(e.dataTransfer.getData("item"));
    if (data.status != 1) {
      this.$message.error("摄像头无法播放!");
      return;
    }
    // this.isCaptureFace = data.isCaptureFace;
    this.currentPlayCamera = data;
    this.cameraId = data.id;
    this.playReflv(data.id);
    this.getFaceData(data.id);
  }
  //抓拍列表
  getFaceData(id) {
    let param = {
      id,
      page: 1,
      pageSize: 15,
    };
    unknownFaceRecentCap(param).then((res) => {
      this.capture = res.data.data.records;
    });
  }
  //播放
  playReflv(id) {
    play({ id })
      .then((res) => {
        this.reflvUrl = res.data.data;
        this.$nextTick(() => {
          this.$refs.reflv["play"]();
        });
      })
      .catch((err) => {
        this.reflvUrl = {};
        this.$nextTick(() => {
          this.$refs.reflv["flv_destroy"]();
        });
      });
  }
  check() {
    var os = (function () {
      var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet =
          /(?:iPad|PlayBook)/.test(ua) ||
          (isAndroid && !/(?:Mobile)/.test(ua)) ||
          (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
      return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
      };
    })();
    if (os.isTablet) {
      // 平板
      this.isPc = false;
    } else if (os.isPc) {
      // pc
      this.isPc = true;
    }
  }
  //告警
  openDialog(item) {
    capMessage({ id: item.cameraMetadataId }).then((res) => {
      let data = res.data.data;
      this.dialogPersonDetail.visible = true;
      data.capTime = getTimeByTimeStamp(data.time);
      this.dialogPersonDetail.form = { ...data };
    });
  }
  openDialogDetail(item) {
    this.dialogPersonDetail.visible = true;
    item.capTime = getTimeByTimeStamp(item.time);
    this.dialogPersonDetail.form = { ...item };
  }
  trackSearch(param) {
    localStorage.setItem("track", JSON.stringify(param));
    this.$router.push({ name: "capture", params: { type: "track" } });
  }
  getTimeByTimeStamp(time) {
    return getTimeByTimeStamp(time);
  }
}
</script>


<style lang="scss">
.left-tree {
  .el-tree {
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    i {
      font-size: 10px;
      color: #606266;
    }
    .el-tree-node:focus > .el-tree-node__content,
    .el-tree-node.is-current > .el-tree-node__content {
      background-color: transparent !important;
    }
    .el-tree-node__content {
      height: 32px;
      line-height: 32px;
    }
    .el-tree-node__content:hover {
      background: transparent;
    }
    .is-current {
      background: transparent;
      background: #e6f1fc;
      .tree-label-color {
        color: #409eff;
      }
      .el-tree-node__children {
        .is-current {
          .tree-label-color {
            color: #409eff;
          }
        }
        .tree-label-color {
          color: #606266;
        }
      }
    }
  }
  > .el-tree {
    > .el-tree-node {
      min-width: 100%;
      height: 32px;
      line-height: 32px;
      display: inline-block;
    }
  }
  .el-input__inner {
    background: transparent;
    border: none;
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    padding-right: 20px;
  }
  .el-input__inner::placeholder {
    color: #606266;
  }
}
</style>
<style lang="scss" scoped>
.app-container {
  display: flex;
  .card_title {
    height: 36px;
    line-height: 36px;
    font-size: 18px;
    font-weight: 500;
    color: #606266;
    padding-left: 14px;
    position: relative;
    .border-bg-left {
      left: -106px;
    }
    .border-bg-bottom {
      left: -106px;
    }
  }
  .left-tree {
    width: 220px;
    height: calc(100vh - 81px);
    background: #fff;
    display: flex;
    flex-direction: column;
    padding-top: 13px;
    .search {
      height: 32px;
      color: #606266;
      padding-left: 21px;
      margin-top: 13px;
      margin-bottom: 6px;
      i {
        font-size: 15px;
      }
    }
    .search_line {
      height: 1px;
      width: 100%;
      opacity: 0.5;
      background-color: #606266;
    }
    .tree-list {
      overflow-y: auto;
      flex: 1;
    }
    .pointer {
      display: flex;
      align-items: center;
    }
    .text {
      user-select: none;
      font-size: 14px;
    }
    .iconfont {
      display: inline-block;
      width: 25px;
      font-size: 22px;
    }
    .icon-canplay {
      color: rgb(0, 163, 0);
    }
    .icon-play {
      font-size: 18px;
      color: rgb(0, 163, 0);
    }
  }
  .right_module {
    // flex: 1;
    width: calc(100vw - 442px);
    padding: 10px;
  }
}
.middle-camera {
  background: #fff;
  padding: 10px;
  width: calc(100vw - 462px); // height: calc(100% - 180px);
  .camera-name {
    height: 36px;
    line-height: 36px;
    margin-bottom: 12px;
    width: 100%;
    z-index: 1;
    .line-bottom {
      position: absolute;
      width: 439px;
      height: 1px;
      opacity: 0.2;
      border: 1px solid #7de0ff;
      bottom: 4px;
    }
    .line-border {
      position: absolute;
      width: 439px;
      height: 1px;
      opacity: 0.5;
      border: 1px solid #7de0ff;
      bottom: 0;
    }
  }
  .camera-info {
    font-size: 14px;
    margin-top: 10px;
  }
  .single-camera {
    background: #000;
    margin-top: 20px;
  }
}
.picture_dev {
  margin-top: 10px;
  height: 240px;
  background: #fff;
  padding: 10px;
  .pic-list {
    display: flex;
    margin-top: 10px;
    overflow-x: auto;
    .list-item {
      cursor: pointer;
      width: 94px;
      height: 151px;
      background: #f5f7fa;
      margin-top: 1px;
      margin-right: 9px;
      text-align: center;
      padding: 4px 5px;
      .face {
        width: 84px;
        height: 84px;
        margin-bottom: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        font-size: 12px;
        font-weight: 500;
        color: #3a414f;
        line-height: 12px;
        letter-spacing: 0px;
        margin: 5px 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
  }
}
</style>
