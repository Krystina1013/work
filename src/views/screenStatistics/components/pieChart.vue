<template>
  <div id="pie-chart">
    <!-- :style="{ marginTop: groupTitle === 3 ? '15px' : '4px' }" -->
    <div class="pie-group">
      <div class="pie-title">
        <p class="pie-text">{{ groupTitle | titleFilter }}</p>
        <p>{{ groupTitle | countFilter }}&nbsp;&nbsp;{{ groupCount }}</p>

        <div class="example-left1"></div>
        <div class="example-left2"></div>
        <div class="example-left3"></div>
      </div>
      <div class="pie-content-admin">
        <div class="content-left">
          <div
            class="content-item"
            :style="{ height: groupTitle === 3 ? '30%' : '21%' }"
            v-for="(item, index) in chartType"
            :key="index"
          >
            <p>
              <span
                class="content-tag"
                :style="{ background: item.color }"
              ></span>
              <span class="pie-name">{{ item.name }} </span>
            </p>
            <p class="pin-num">{{ item.num }}</p>
            <p class="percent" :style="{ color: item.color }">
              {{ item.percentage }}%
            </p>
          </div>
        </div>

        <div class="left-chart-2">
          <pieCharts :seriesData="seriesData" :pieColor="pieColor" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Mixins } from "vue-property-decorator";
import pieCharts from "./pie.vue";
import { debouncechart } from "@/utils";

@Component({
  components: { pieCharts },
  computed: {
    seriesData() {
      let seriesData: Array<Object> = [];
      for (const item of this["chartType"]) {
        seriesData.push({ name: item.name, value: item.num });
      }

      return seriesData;
    },

    pieColor() {
      let pieColor: Array<Object> = [];

      switch (this["groupTitle"]) {
        case 1:
          pieColor = ["#f04767", "#ffce26", "#37dab5"];
          break;
        case 2:
          pieColor = ["#f04767", "#37dab5", "#1581FF"];
          break;
        case 3:
          pieColor = ["#f04767", "#ffce26"];
          break;
        case 4:
          pieColor = ["#f04767", "#ffce26", "#1581FF"];
          break;
      }

      return pieColor;
    }
  },

  filters: {
    titleFilter(val: string) {
      const data = {
        "1": "办公室使用情况",
        "2": "车位使用情况",
        "3": "办公成员情况",
        "4": "车辆情况"
      };
      return data[val];
    },
    countFilter(val: string) {
      const data = {
        "1": "总户数",
        "2": "总车位数",
        "3": "办公成员总人数",
        "4": "车辆总数"
      };
      return data[val];
    }
  }
})
export default class Pie extends Vue {
  name: "Pie";
  @Prop() private chartType: any;
  @Prop() private groupTitle: any;
  @Prop({ default: 2000 }) private groupCount: Number;
}
</script>

<style rel="stylesheet/scss" lang="scss">
$border: RGB(13, 54, 109);
#pie-chart {
  height: 100%;
  .pie-group {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid $border;
    border-top: 1px solid #17356d;
  }

  .pie-title {
    height: 30%;
    display: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #9dc6dd;
    background: linear-gradient(to right to bottom, #172f64, #091449);
    position: relative;
  }

  .pie-text {
    font-weight: bold;
  }

  .example-left1 {
    width: 200px;
    height: 2px;
    background: linear-gradient(to right to bottom, #435c95, #091449);
    position: absolute;
    bottom: 0px;
    left: 0px;
  }

  .example-left2 {
    width: 100px;
    height: 2px;
    background: linear-gradient(to right to bottom, #435c95, #000732);
    position: absolute;
    bottom: -1px;
    left: 0px;
  }
  .example-left3 {
    width: 2px;
    height: 30px;
    background: linear-gradient(to bottom, #435c95, #091449);
    position: absolute;
    top: 0px;
    left: -1px;
  }

  .pie-content-admin {
    height: 100%;
    width: 100%;
    display: 1;
    display: flex;
    justify-content: space-between;
    // border: 1px solid red;
  }

  .content-left {
    width: 60%;
    height: 100%;
    padding: 5px 0 0 24px;
  }

  .content-item {
    width: 100%;
    height: 21%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  .content-tag {
    display: inline-block;
    width: 12px;
    height: 12px;
    background: #f04767;
    // margin-right: 8px;
  }
  .pie-name {
    display: inline-block;
    width: 56px;
  }

  .pin-num {
    width: 56px;
    text-align: center;
  }

  .percent {
    width: 18px;
    color: #f04767;
  }

  .tag1-rewrite {
    background: #ffce26;
  }

  .percent1-rewrite {
    color: #ffce26;
  }

  .tag2-rewrite {
    background: #37dab5;
  }

  .percent2-rewrite {
    color: #37dab5;
  }

  .left-chart-2 {
    width: 40%;
    display: flex;
    flex-direction: column;
  }
}
</style>
