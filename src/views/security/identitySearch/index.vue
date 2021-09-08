<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <FilterHeader ref="filter" :activeName="activeName" @picSearch="picSearch" @infoSearch="infoSearch" @reset="reset" :total="total"></FilterHeader>
            </el-col>
          </el-row>
          <div class="resultWrapper" :style="`height:${height_w - 250}px`" v-loading="showLoading">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="照片" name="cap">
                <ScrollList class="scollList" ref="scrollList" :height="height_w - 310" :canPullUp="canPullUp" @scrollToBottom="scrollToBottom" v-if="tableData.length">
                  <div class="card" :key="index" v-for="(item, index) in tableData">
                    <div class="face-url"><img :src="item.faceUrl" alt="" /></div>
                    <p class="text">
                      <span>相似度：</span>
                      <span>{{ similarityjudge(item.score) }}（{{
                    Math.round(item.score * 100) / 100
                  }}%）</span>
                    </p>
                    <p class="text">
                      <span>姓名：</span>
                      <span class="moreWord" :title="item.name">{{ item.name }}</span>
                    </p>
                    <p class="text">
                      <span>证件号码：</span>
                      <span class="moreWord" :title="item.cardNo">{{
                  item.cardNo
                }}</span>
                    </p>
                    <p class="text">
                      <span>电话：</span>
                      <span class="moreWord" :title="item.phone">{{
                  item.phone
                }}</span>
                    </p>
                  </div>
                </ScrollList>
                <p v-else class="empty">未查询到相关记录！</p>
              </el-tab-pane>
              <el-tab-pane label="基本信息" name="info">
                <ScrollList class="scollList" ref="scrollList" :height="height_w - 310" :canPullUp="canPullUp" @scrollToBottom="scrollToBottom" v-if="tableData.length">
                  <div class="card" :key="index" v-for="(item, index) in tableData">
                    <div class="face-url"><img :src="item.faceUrl" alt="" /></div>

                    <p class="text">
                      <span>姓名：</span>
                      <span class="moreWord" :title="item.name">{{ item.name }}</span>
                    </p>
                    <p class="text">
                      <span>证件号码：</span>
                      <span class="moreWord" :title="item.cardNo">{{
                  item.cardNo
                }}</span>
                    </p>
                    <p class="text">
                      <span>电话：</span>
                      <span class="moreWord" :title="item.phone">{{
                  item.phone
                }}</span>
                    </p>
                    <p class="text">
                      <span></span>
                      <span>
                        <el-button type="text" @click="trackSearch(item)">轨迹搜索</el-button>
                      </span>
                    </p>
                  </div>
                </ScrollList>
                <p v-else class="empty">未查询到相关记录！</p>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import { getBase64 } from "@/utils/index.js";
import { faceSearch, faceAttrSearch } from "@/api/police";
const FilterHeader = () => import("./components/Filter.vue");
const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
@Component({
  components: { FilterHeader, ScrollList },
})
export default class extends Vue {
  activeName: string = "cap";
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  config: any = config;
  canPullUp: boolean = false;
  tableData: Array<object> = [];
  similarity: any = {};
  showLoading: boolean = false;
  total: number = 0;
  created() {
    this.similarity = JSON.parse(localStorage.similarity) || {};
  }
  //按照片搜索
  picSearch(form) {
    this.showLoading = true;
    faceSearch(form)
      .then((res) => {
        this.showLoading = false;
        this.tableData = res.data.data || [];
        this.total = this.tableData.length;
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  //按信息搜索
  infoSearch(form) {
    this.showLoading = true;
    faceAttrSearch(form)
      .then((res) => {
        this.showLoading = false;
        this.tableData = res.data.data || [];
        this.total = this.tableData.length;
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  scrollToBottom() {}
  similarityjudge(i) {
    return i <= this.similarity.low
      ? "低"
      : i <= this.similarity.medium
      ? "中"
      : "高";
  }
  //跳转轨迹搜索
  trackSearch(item) {
    const params = {
      faceUrl: item.faceUrl,
    };
    localStorage.setItem("track", JSON.stringify(params));
    this.$router.push({ name: "capture", params: { type: "track" } });
  }
  handleClick() {
    this.$refs.filter["clearFilterFormfresh"]();
    this.tableData = [];
  }
  reset() {
    this.tableData = [];
  }
}
</script>

<style lang="scss" scoped>
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
.scollList {
  padding: 10px;
  color: #333;
  > div {
    display: inline-block;
  }
  .face-url {
    width: 200px;
    height: 200px;
    border: 1px solid #eee;
    margin-bottom: 5px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .card {
    margin: 0 20px 15px 0;
    box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13),
      0 2px 4px rgba(0, 0, 0, 0.12);
    padding: 5px 5px 10px 5px;
    font-size: 14px;
    line-height: 24px;
    p {
      width: 200px;
    }
    .moreWord {
      width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .text {
      display: flex;
      > span:first-child {
        display: inline-block;
        width: 70px;
        text-align: right;
      }
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 14px;
}
::v-deep {
  .el-tabs__nav .is-top {
    background: transparent;
  }
  .el-tabs__active-bar {
    background-color: #409eff !important;
  }
}
.empty {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-top: 100px;
}
</style>