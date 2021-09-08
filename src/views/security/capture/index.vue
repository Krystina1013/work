<template>
  <div class="app-container">
    <div class="rightContent" v-loading="showLoading">
      <el-row>
        <el-col :span="24">
          <FilterHeader ref="filter" @getFaceCapture="getFaceCapture" :pageInfo="pagination"></FilterHeader>
        </el-col>
      </el-row>
      <ScrollList class="scollList" ref="scrollList" :height="height_w - 180" :canPullUp="canPullUp" @scrollToBottom="scrollToBottomTime" v-if="searchData.length">
        <div class="list" v-for="(item, i) in searchData" :key="i">
          <div class="face">
            <img :src="item.faceInfo.faceUrl" alt />
          </div>
          <p class="flex justify-content-between align-items-center" style="margin-top: 5px">
            <span class="flex align-items-center">
              摄像机：
              <span v-if="item.cameraCutVo" :title="item.cameraCutVo.name" class="moreWord hiddenText">{{ item.cameraCutVo.name }}</span>
              <span v-else>--</span>
            </span>
            <span class="aBtn" @click="showDialogPersonDetail(item)">详情</span>
          </p>
          <p class="flex align-items-center">
            抓拍地址：
            <span v-if="item.cameraCutVo" class="moreWord" :title="item.cameraCutVo.addr">{{ item.cameraCutVo.addr }}</span>
            <span v-else class="moreWord">--</span>
          </p>
          <p>
            时间：
            <span :title="getTimeByTimeStamp(item.time)">{{
              getTimeByTimeStamp(item.time) | ignoreYearAndSecond
            }}</span>
          </p>
        </div>
      </ScrollList>
      <p v-else class="empty">未查询到相关记录！</p>
    </div>
    <DialogPersonDetail @close="closeDialogPersonDetail" :visible="DialogPersonDetail.visible" :form="DialogPersonDetail.form" :hidePersonInfo="true" :hideOriginalFace="true"></DialogPersonDetail>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import DialogPersonDetail from "../components/DialogPersonDetail/DialogPersonDetail.vue";
import config from "@/api/config";
import { unknownFaceTimeSearch } from "@/api/police";
import {
  getBase64,
  getTimeByTimeStamp,
  getSimilarityDisplay,
} from "@/utils/index.js";
const FilterHeader = () => import("./components//FilterHeader.vue");
const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
@Component({
  components: { FilterHeader, ScrollList, DialogPersonDetail },
})
export default class extends Vue {
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  config: any = config;
  canPullUp: boolean = true;
  searchData: Array<object> = [];
  DialogPersonDetail: any = {
    visible: false,
    form: {},
  };
  pagination: any = {
    total: 0,
    page: 1,
    pageSize: 20,
  };
  nowFilter: any = {};
  showLoading: boolean = false;
  created() {}
  handleClick() {
    this.searchData = [];
    this.pagination.total = 0;
  }
  scrollToBottomTime() {
    this.pagination.page += 1;
    this.canPullUp = false;
    this.loadFaceData(this.nowFilter);
  }
  scrollToBottomFace() {}
  showDialogPersonDetail(item, type) {
    this.DialogPersonDetail.visible = true;
    item.capTime = getTimeByTimeStamp(item.time);
    this.DialogPersonDetail.form = { ...item };
  }
  closeDialogPersonDetail() {
    this.DialogPersonDetail.visible = false;
  }
  // 人脸抓拍
  getFaceCapture(val, arr) {
    this.nowFilter = { ...val, cameraIds: arr };
    this.pagination.page = 1;
    this.searchData = [];
    let param = { ...val, cameraIds: arr };
    this.loadFaceData(param);
  }
  loadFaceData(val) {
    console.log(val);
    let param: any = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      startTime: val.startTime,
      endTime: val.endTime,
      score: val.score,
      pic: val.faceUrl,
    };
    if (val.cameraIds.length) {
      param.cameraIds = val.cameraIds;
    }

    this.showLoading = true;

    unknownFaceTimeSearch(param)
      .then((res) => {
        let data = res.data.data;
        this.showLoading = false;
        this.pagination.total = parseInt(data.total);
        if (this.pagination.page == 1) {
          this.searchData = data.records;
        } else {
          this.searchData = [...this.searchData, ...data.records];
        }
        this.$nextTick(() => {
          if (this.searchData.length == parseInt(data.total)) {
            this.canPullUp = false;
          } else {
            this.canPullUp = true;
          }
        });
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  getTimeByTimeStamp(time) {
    return getTimeByTimeStamp(time);
  }
  getSimilarityDisplay(val) {
    return getSimilarityDisplay(val);
  }
}
</script>

<style lang="scss" scoped>
.resultWrapper {
  background: #fff;
  box-shadow: 0px 6px 5px 0px lightgrey;
  padding: 10px;
}
::v-deep {
  .el-tabs__nav .is-top {
    background: transparent;
  }
  .el-tabs__active-bar {
    background-color: #409eff !important;
  }
}
.scollList {
  > div {
    display: inline-block;
  }
  .moreWord {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .list {
    margin: 0 20px 25px 0;
    box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13),
      0 2px 4px rgba(0, 0, 0, 0.12);
    padding: 10px;
    .hiddenText {
      display: inline-block;
      width: 70px !important;
    }
    img,
    .face {
      width: 150px;
      height: 150px;
      object-fit: contain;
      border: 1px solid #eee;
    }
    font-size: 12px;
    line-height: 24px;
    p {
      width: 150px;
    }
    .moreWord {
      width: 80px;
    }
  }
  .aBtn {
    cursor: pointer;
    color: #409eff;
  }
}
.empty {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-top: 100px;
}
</style>
