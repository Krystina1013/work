<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
          :moreStatus="false"
          :pageStatus="false"
          :scroll="true"
          :filterMore="true"
          btnStatus="0"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">时间段：</span>
              <el-date-picker
                v-model="filterForm.dateRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :clearable="false"
              >
              </el-date-picker>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent" v-loading="showLoading">
          <div
            class="scollList"
            ref="scrollList"
            :style="{ height: height_w - 240 + 'px' }"
            v-if="list.length"
          >
            <div v-for="(list, i) in list" :key="i">
              <div>
                <p class="date-title">{{ list.day }} ({{ list.count }})</p>
                <div
                  class="list"
                  v-for="(item, i) in list.firstAppearVoList"
                  :key="i"
                >
                  <img
                    :src="item.firstFaceUrl"
                    alt=""
                    @click="openDialogDetail(item)"
                  />
                  <p class="flex">
                    <span>摄像机：</span>
                    <span
                      class="word-hidden"
                      :title="item.cameraName"
                      v-if="item.cameraName"
                      >{{ item.cameraName }}</span
                    >
                    <span v-else
                      ><span v-if="item.capMessage">{{
                        item.capMessage.cameraCutVo.name
                      }}</span></span
                    >
                  </p>
                  <p>
                    <span>抓拍时间：</span>
                    <span :title="item.firstTime">{{
                      item.firstTime | ignoreYearAndSecond
                    }}</span>
                  </p>
                </div>
              </div>
              <div class="more" v-if="list.count > 10">
                <el-button
                  :disabled="list.noMore"
                  size="mini"
                  type="primary"
                  @click="openMoreDialog(list, i)"
                  :loading="list.load"
                  >更多</el-button
                >
              </div>
            </div>
          </div>
          <p v-else class="empty" :style="{ height: height_w - 240 + 'px' }">
            未查询到相关记录！
          </p>
        </div>
      </el-col></el-row
    >
    <DialogPersonDetail
      @close="DialogPersonDetail.visible = false"
      @trackSearch="trackSearch"
      :visible="DialogPersonDetail.visible"
      :form="DialogPersonDetail.form"
      :hidePersonInfo="true"
      :hideOriginalFace="true"
    ></DialogPersonDetail>
    <el-dialog
    :title="nowDay"
      :visible.sync="dialogMoreVisible"
      width="60%"
      :before-close="handleCloseMore"
    >
    <div v-loading="moreLoading">
      <ScrollList
        class="scollList"
        ref="scrollList"
        :style="{ height: '40vh' }"
        :canPullUp="canPullUp"
        @scrollToBottom="scrollToBottom"
        
      >
        <div
          v-for="(item, i) in moreList"
          :key="i"
          style="display: inline-block"
        >
          <div class="list">
            <img
              :src="item.firstFaceUrl"
              alt=""
              @click="openDialogDetail(item)"
            />
            <p class="flex">
              <span>摄像机：</span>
              <span
                class="word-hidden"
                :title="item.cameraName"
                v-if="item.cameraName"
                >{{ item.cameraName }}</span
              >
              <span v-else
                ><span v-if="item.capMessage">{{
                  item.capMessage.cameraCutVo.name
                }}</span></span
              >
            </p>
            <p>
              <span>抓拍时间：</span>
              <span :title="item.firstTime">{{
                item.firstTime | ignoreYearAndSecond
              }}</span>
            </p>
          </div>
        </div>
      </ScrollList>
    </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import { firstAppear, firstAppearDay } from "@/api/police";
import mixin from "@/config/minxins";
import DialogPersonDetail from "../components/DialogPersonDetail/DialogPersonDetail.vue";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
import { getTodayStartTime, getTimeByTimeStamp } from "@/utils/index.js";
import { subDays, format } from "date-fns";
@Component({
  mixins: [mixin],
  components: { ActionHeader, ScrollList, DialogPersonDetail },
})
export default class extends Vue {
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  config: any = config;
  DialogPersonDetail: any = {
    visible: false,
    form: {},
  };
  filterForm: any = {
    dateRange: [],
  };
  dateRange: Array<string> = [];
  list: Array<string> = [];
  searchData: Array<object> = [{}];
  canPullUp: boolean = true;
  showLoading: boolean = false;
  nowpage: number = 1;
  pagination: any = {
    total: 0,
    page: 1,
    pageSize: 20,
  };
  more: any = {
    page: 1,
  };
  dialogMoreVisible: boolean = false;
  moreList: any = [];
  nowDay: string = "";
  moreLoading:boolean=false;
  created() {
    this.filterForm.dateRange = [
      format(subDays(new Date(), 3), "yyyy-MM-dd"),
      format(new Date(), "yyyy-MM-dd"),
    ];
    this["isPolice"] = true;
    this.serachData();
  }
  fetchData(option: any) {
    this.filterForm.dateRange = option.params.dateRange;
    if (!option.params.dateRange.length) {
      this.filterForm.dateRange = [
        format(subDays(new Date(), 3), "yyyy-MM-dd"),
        format(new Date(), "yyyy-MM-dd"),
      ];
    }
    this.pagination.pageSize = option.params.limit;
    this.serachData();
  }
  serachData() {
    if (!this.filterForm.dateRange.length) {
      this.$message.error("请先选择时间段！");
      return;
    }
    this.nowpage = 1;
    this.showLoading = true;
    this.list = [];
    this.loadData();
  }
  loadData() {
    let param = {
      startTime: this.filterForm.dateRange.length
        ? this.filterForm.dateRange[0]
        : "",
      endTime: this.filterForm.dateRange.length
        ? this.filterForm.dateRange[1]
        : "",
    };
    firstAppear(param)
      .then((res) => {
        let data = res.data.data;
        console.log(data);
        this.showLoading = false;
        this.page["total"] = data.length;
        data.map((item) => {
          item.page = 1;
          item.noMore = false;
        });
        this.list = data;
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  handleCloseMore() {
    this.more.page = 1;
    this.moreList = [];
    this.dialogMoreVisible = false;
  }
  openMoreDialog(item) {
    this.dialogMoreVisible = true;
    this.nowDay = item.day;
    this.getMore();
  }
  getMore() {
     this.moreLoading = true;
    let param = {
      page: this.more.page,
      pageSize: 20,
      date: this.nowDay,
    };
    this.$forceUpdate();
    firstAppearDay(param)
      .then((res) => {
        this.moreLoading = false;
        let data = res.data.data;
        if (this.more.page == 1) {
          this.moreList = data.records;
        } else {
          this.moreList = [...this.moreList, ...data.records];
        }
        this.$nextTick(() => {
          if (this.moreList.length == parseInt(data.total)) {
            this.canPullUp = false;
          } else {
            this.canPullUp = true;
          }
        });
      })
      .catch((err) => {
        this.moreLoading = false;
      });
  }
  scrollToBottom() {
    this.more.page += 1;
    this.canPullUp = false;
    this.getMore();
  }
  trackSearch(param) {
    localStorage.setItem("track", JSON.stringify(param));
    this.$router.push({ name: "capture", params: { type: "track" } });
  }
  openDialogDetail(item) {
    if (!item.capMessage) {
      this.$message.error("暂无数据");
      return;
    }
    this.DialogPersonDetail.visible = true;
    item.capTime = item.firstTime;
    this.DialogPersonDetail.form = { ...item.capMessage };
  }
}
</script>

<style lang="scss" scoped>
.date-title {
  margin-bottom: 15px;
}
.rightContent {
  height: 100%;
  background: #fff;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
  padding: 10px;
}
.list {
  margin: 0 20px 25px 0;
  box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13), 0 2px 4px rgba(0, 0, 0, 0.12);
  padding: 10px;
  display: inline-block;
  .flex {
    align-items: center;
  }
  img {
    width: 180px;
    height: 180px;
    cursor: pointer;
    object-fit: contain;
  }
  .word-hidden {
    display: inline-block;
    width: 100px;
  }
  font-size: 14px;
  color: #333;
}
.empty {
  font-size: 14px;
  color: #333;
  text-align: center;
  padding-top: 100px;
}
.scollList {
  overflow: auto;
  > div {
    margin-bottom: 20px;
  }
  .more {
    text-align: center;
  }
}
::v-deep{
  .content .filterDialog{
    left: -255px !important;
  }
}
</style>
