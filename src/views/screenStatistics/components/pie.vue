<template>
  <div class="pie-chart">
    <dv-charts
      ref="pieChart"
      :class="className"
      :style="{
        width: width,
        height: height
      }"
      :option="option"
    />
    <dv-charts
      ref="pieChart1"
      :class="className"
      class="option1"
      :style="{
        width: width,
        height: height,
        position: 'absolute',
        left: '0px',
        top: '0px'
      }"
      :option="option1"
    />
    <div class="chart-radius"></div>
  </div>
</template>

<script>
import { debouncechart } from "@/utils";
export default {
  name: "pie",
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "140px"
    },
    height: {
      type: String,
      default: "78px"
    },
    uploadWeek: {
      type: Array
    },
    pieColor: {
      type: Array
    },
    seriesData: {
      type: Array,
      default: function() {
        return [
          { name: "", value: 93 },
          { name: "", value: 32 },
          { name: "", value: 65 }
        ];
      }
    }
  },

  data() {
    return {
      chart: null,
      chart1: null,
      legendData: { data: [] },
      title: { text: "" },
      option: {},
      option1: {}
      // color: ["#f04767", "#ffce26", "#37dab5"],
      // color2: ["#f04767", "#ffce26"],
      // color3: ["#f04767", "#ffce26", "#37dab5"],
      // color4: ["#f04767", "#ffce26", "#37dab5"]
    };
  },

  watch: {
    seriesData: {
      handler(newVal, oldVal) {
        this.option.series[0].data = newVal;
        this.option = { ...this.option };

        this.option1.series[0].data = newVal;
        this.option1 = { ...this.option1 };
      }
    }
  },

  created() {
    this.initChart();
    this.initOption();
  },

  methods: {
    initChart() {
      this.option = {
        series: [
          {
            type: "pie",
            radius: ["36%", "65%"],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            outsideLabel: {
              show: false
            },

            data: this.seriesData
          }
        ],
        color: this.pieColor
      };
    },

    initOption() {
      this.option1 = {
        series: [
          {
            type: "pie",
            radius: ["27%", "65%"],
            avoidLabelOverlap: false,
            label: {
              show: false
            },
            outsideLabel: {
              show: false
            },

            data: this.seriesData
          }
        ],
        color: this.pieColor
      };
    }
  }
};
</script>

<style lang="less">
.pie-chart {
  position: relative;
}
.option1 {
  z-index: -1;
}
.chart-radius {
  width: 60px;
  height: 60px;
  position: absolute;
  left: 40px;
  top: 10px;
  border-radius: 100%;
  border: 10px solid #1d2a62;
  background: #101429;
  z-index: -2;
}
</style>
