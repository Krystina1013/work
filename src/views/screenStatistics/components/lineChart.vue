<template>
  <div
    id="line-chart"
    :class="groupTitle === 1 ? 'lineChartTop' : 'lineChartBottom'"
  >
    <div class="line-chart-title">
      <p>{{ groupTitle | titleFilter }}</p>
      <div class="line-hint">
        <div
          class="sign-line"
          :class="groupTitle === 1 ? 'sign-line-today' : 'sign-line-today1'"
        >
          <p
            class="line-dot-sign"
            :class="
              groupTitle === 1 ? 'line-dot-sign-today' : 'line-dot-sign-today1'
            "
          ></p>
        </div>
        <p class="line-today">今日</p>
        <div class="sign-line sign-line-yesterday">
          <p class="line-dot-sign line-dot-sign-yesterday"></p>
        </div>
        <p class="line-today">昨日</p>
      </div>
      <div class="example-left1"></div>
      <div class="example-left2"></div>
    </div>
    <div class="line-chart-item">
      <!-- <dv-charts :option="option" /> -->
      <lineCharts :groupTitle="groupTitle" :seriesData="seriesData" />
    </div>
    <div class="example-down"></div>
  </div>
</template>

<script>
import { homePassTable, vehiclePassTable } from "@/api/screenShow.ts";
import lineCharts from "./line.vue";

export default {
  name: "lineChart",
  components: { lineCharts },
  props: {
    groupTitle: { type: Number }
  },

  filters: {
    titleFilter(val) {
      const data = {
        1: "总车流量分时段统计（车次）",
        2: "总人流量分时段统计（人次）"
      };
      return data[val];
    }
  },
  data() {
    return {
      lineChartTop: "t-o-p",
      lineChartBottom: "b-o-t",

      seriesData: [
        {
          data: []
        },
        {
          data: []
        }
      ]
    };
  },
  created() {
    this.fetchData();
  },

  mounted() {},

  methods: {
    async fetchData() {
      let data;
      if (this.groupTitle === 1) {
        data = await vehiclePassTable();
        console.log(data, 11);
      } else {
        data = await homePassTable();
        console.log(data, 22);
      }

      data = data.data;
      this.seriesData = [{ data: [] }, { data: [] }];
      for (const item of data.data) {
        this.seriesData[0].data.push(item.todayTimes);
        this.seriesData[1].data.push(item.yesTimes);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$border: rgba(14, 57, 112, 0.3);
$background-left1: linear-gradient(to right, #091449, #435c95);
$background-left2: linear-gradient(to right, #435c95, #091449);
$background-top1: linear-gradient(to bottom, #091449, #435c95);
$background-top2: linear-gradient(to bottom, #435c95, #091449);
$absolute: absolute;
$z-index: 999;
$today-color: #f04767;
$yesterday-color: #3d7efc;
$today-color1: #ffce26;

#line-chart {
  width: 100%;
  height: 100%;
  border: 1px solid $border;
  position: relative;
  .t-o-p {
    background: linear-gradient(to bottom, #0a1652, #000848);
  }
  .b-o-p {
    background: linear-gradient(to bottom, #0a1753, #010a49);
  }
  .line-chart-title {
    position: relative;
    font-size: 16px;
    display: flex;
    align-items: center;
    height: 22%;
    justify-content: space-between;
    text-align: center;
    background: linear-gradient(to right to bottom, #172f64, #091449);
    font-weight: bold;
    padding: 0 18px;
  }

  .line-hint {
    display: flex;
    align-items: center;
  }

  .sign-line {
    width: 30px;
    border: 1px solid $today-color;
    position: relative;
  }
  .sign-line-today {
    border: 1px solid $today-color;
  }

  .sign-line-today1 {
    border: 1px solid $today-color1;
  }

  .sign-line-yesterday {
    border: 1px dashed $yesterday-color;
  }

  .line-dot-sign {
    width: 8px;
    height: 8px;
    background: #ffffff;
    border-radius: 100%;
    border: 2px solid $today-color;
    position: absolute;
    top: -4px;
    left: 10px;
  }

  .line-dot-sign-today {
    border: 2px solid $today-color;
  }
  .line-dot-sign-today1 {
    border: 2px solid $today-color1;
  }

  .line-dot-sign-yesterday {
    border: 2px solid $yesterday-color;
  }

  .line-today {
    font-size: 14px;
    color: #bbdbee;
    margin: 0 8px;
  }

  .line-chart-item {
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
    width: 46%;
  }

  .cell-item {
    width: 28%;
  }

  .example-left1 {
    width: 25%;
    height: 2px;
    background: $background-left2;
    position: $absolute;
    top: -2px;
    left: -1px;
    z-index: $z-index;
  }

  .example-left2 {
    width: 50%;
    height: 2px;
    background: $background-left2;
    position: $absolute;
    bottom: -1px;
    left: 0px;
    z-index: $z-index;
  }

  .example-down {
    width: 2px;
    height: 50%;
    background: $background-top2;
    position: $absolute;
    top: 0px;
    left: -1px;
    z-index: $z-index;
  }
}
</style>
