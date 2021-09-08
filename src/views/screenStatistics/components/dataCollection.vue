<template>
  <!-- <dv-border-box-10> -->
  <div id="data-collection">
    <p class="data-collection-title">数据统计</p>
    <div class="data-collection-item">
      <div class="row-data row-data-title">
        <p
          class="cell-item"
          v-for="(item, index) in dataTitle"
          :key="'dataTitle' + index"
          :style="{ width: index === 0 ? '52%' : '28%' }"
        >
          &nbsp;{{ item }}
        </p>
      </div>

      <div
        class="row-data row-data-item"
        v-for="(item, i) in dataList"
        :key="'data' + i"
        :style="{
          color: (i + 1) % 2 === 0 ? '#37dab5' : 'red;',
          background: (i + 1) % 2 === 0 ? '#091544' : ''
        }"
      >
        <p class="cell-name">
          {{ item.name }}
        </p>
        <p class=" cell-item">&nbsp;{{ item.num }}</p>
        <p class="cell-item">&nbsp;{{ item.proportion }}</p>
      </div>
    </div>

    <div class="example-left1"></div>
    <div class="example-left2"></div>
    <div class="example-right1"></div>
    <div class="example-right2"></div>
    <div class="example-top1"></div>
    <div class="example-top2"></div>
    <div class="example-down1"></div>
    <div class="example-down2"></div>
  </div>
  <!-- </dv-border-box-10> -->
</template>

<script>
import { userSpace, personPass, carPass } from "@/api/screenShow.ts";

export default {
  data() {
    return {
      dataTitle: ["统计类别", "数量", "占比"],
      dataList: [
        { name: "今日进入人次", num: 0, proportion: 0 },
        { name: "今日进/出车次", num: 0, proportion: 0 },
        { name: "今日访客", num: 0, proportion: 0 },
        { name: "APP使用人数", num: 0, proportion: 0 },
        { name: "已注册人脸人数", num: 0, proportion: 0 }
      ]
    };
  },

  created() {
    this.getPersonPass();
    this.getCarPass();
    this.fetchUserData();
  },

  methods: {
    async getPersonPass() {
      const { data } = await personPass();
      this.dataList[0]["num"] = data.data.inCount;
      this.dataList[0]["proportion"] = "--";
    },

    async getCarPass() {
      const { data } = await carPass();
      this.dataList[1]["num"] = data.data.inCount + "/" + data.data.outCount;
      this.dataList[1]["proportion"] = "--";
    },

    async fetchUserData() {
      const { data } = await userSpace();
      const count = data.data.userCount;

      this.dataList[2]["num"] = data.data.visitorCount;
      this.dataList[2]["proportion"] = "--";
      // count > 0
      //   ? ((data.data.visitorCount / count) * 100).toFixed(1) + "%"
      //   : 0 + "%";

      this.dataList[3]["num"] = data.data.appCount;
      this.dataList[3]["proportion"] =
        count > 0
          ? ((data.data.appCount / count) * 100).toFixed(1) + "%"
          : 0 + "%";

      this.dataList[4]["num"] = data.data.faceCount;
      this.dataList[4]["proportion"] =
        count > 0
          ? ((data.data.faceCount / count) * 100).toFixed(1) + "%"
          : 0 + "%";
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$border: rgba(14, 57, 112, 0.3);
$background-left1: linear-gradient(to right, #091449, #435c95);
$background-left2: linear-gradient(to right, #435c95, #091449);
$background-top1: linear-gradient(to bottom, #091449, #435c95);
$background-top2: linear-gradient(to bottom, #435c95, #091449);
$absolute: absolute;
$z-index: 999;

#data-collection {
  width: 100%;
  height: 100%;
  border: 1px solid $border;
  position: relative;

  .data-collection-title {
    font-size: 16px;
    display: flex;
    align-items: center;
    height: 22%;
    justify-content: center;
    text-align: center;
    background: linear-gradient(to right to bottom, #172f64, #091449);
    font-weight: bold;
  }

  .data-collection-item {
    height: 78%;
    display: 1;
    display: flex;
    flex-direction: column;
  }

  .row-data {
    height: 16.7%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 15px;
    color: #1265ce;
  }

  .row-data-title {
    color: #9dc6dd;
    background: #091544;
  }
  .row-data-item {
    background: linear-gradient(to right to bottom, #172f64, #091449);
  }

  .cell-name {
    width: 52%;
  }

  .cell-item {
    width: 28%;
  }

  .example-left1 {
    width: 74px;
    height: 2px;
    background: $background-left2;
    position: $absolute;
    top: -2px;
    left: -1px;
    z-index: $z-index;
  }

  .example-left2 {
    width: 74px;
    height: 2px;
    background: $background-left2;
    position: $absolute;
    bottom: -1px;
    z-index: $z-index;
  }

  .example-right1 {
    width: 74px;
    height: 2px;
    background: $background-left1;
    position: $absolute;
    top: -1px;
    right: -1px;
    z-index: $z-index;
  }

  .example-right2 {
    width: 74px;
    height: 2px;
    background: $background-left1;
    position: $absolute;
    bottom: -1px;
    right: -1px;
    z-index: $z-index;
  }

  .example-top1 {
    width: 2px;
    height: 44px;
    background: $background-top1;
    position: $absolute;
    bottom: -1px;
    left: -1px;
    z-index: $z-index;
  }

  .example-top2 {
    width: 2px;
    height: 44px;
    background: $background-top1;
    position: $absolute;
    bottom: -1px;
    right: -1px;
    z-index: $z-index;
  }

  .example-down1 {
    width: 2px;
    height: 54px;
    background: $background-top2;
    position: $absolute;
    top: -1px;
    right: -1px;
    z-index: $z-index;
  }

  .example-down2 {
    width: 2px;
    height: 64px;
    background: $background-top2;
    position: $absolute;
    top: 0px;
    left: -1px;
    z-index: $z-index;
  }
}
</style>
