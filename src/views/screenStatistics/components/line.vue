<template>
  <div
    :class="className"
    :style="{
      height: height,
      width: width,
      position: 'absolute',
      left: '8px',
      top: '32px'
    }"
  ></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debouncechart } from "@/utils";

export default {
  name: "lineChart",
  props: {
    groupTitle: { type: Number },
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    seriesData: {
      type: Array,
      default: function() {
        return [
          {
            data: [
              100,
              300,
              600,
              400,
              200,
              600,
              900,
              100,
              300,
              600,
              900,
              400,
              200,
              450,
              400,
              200,
              450,
              900,
              400,
              200,
              450,
              512,
              984,
              517
            ]
          },
          {
            data: [
              100,
              300,
              100,
              300,
              600,
              900,
              100,
              300,
              600,
              900,
              400,
              200,
              600,
              900,
              100,
              300,
              600,
              900,
              400,
              200,
              450,
              400,
              200,
              450
            ]
          }
        ];
      }
    }
  },

  data() {
    return {
      chart: null,
      legendData: { data: [] },
      title: { text: "" },
      chartData: {}
    };
  },

  created() {
    this.setLegendData();
  },

  watch: {
    seriesData: {
      handler(newVal, oldVal) {
        let seriesData = [{ data: [] }, { data: [] }];
        seriesData[0].data = this.legendData.data.map((item, hour) =>
          newVal[0].data[hour] ? newVal[0].data[hour] : 0
        );
        seriesData[1].data = this.legendData.data.map((item, hour) =>
          newVal[1].data[hour] ? newVal[1].data[hour] : 0
        );

        this.chart.setOption({
          title: this.title,
          series: seriesData
        });
      },

      deep: true
    }
  },

  mounted() {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHanlder = debouncechart(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHanlder);
    }
  },
  methods: {
    setOptions() {
      this.lineColor = this.groupTitle === 1 ? "#F04767" : "#FFCE26";
      this.chartData = {
        legend: {
          show: false,
          data: [
            {
              name: "今日",
              color: "#ff5ca9"
            },
            {
              name: "昨日",
              color: "#3de7c9"
            }
          ],
          textStyle: {
            fill: "#9DC6DD"
          }
        },
        grid: {
          left: "1%",
          right: "4%",
          bottom: "17%",
          top: "14%",
          containLabel: true
        },

        tooltip: {
          trigger: "item"
        },

        xAxis: [
          {
            axisLine: {
              lineStyle: {
                color: "#2B5D8F",
                width: 1 //这里是为了突出显示加上的
              }
            },

            axisLabel: {
              show: true,
              textStyle: {
                color: "#9DC6DD"
              }
            },
            data: this.legendData.data,
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              show: true,
              textStyle: {
                color: "#9dc6dd"
              }
            },

            axisLine: {
              lineStyle: {
                color: "#2B5D8F",
                width: 1 //这里是为了突出显示加上的
              }
            },

            splitLine: {
              show: true,
              lineStyle: {
                type: "dotted", //设置网格线类型 dotted：虚线   solid:实线
                color: "#0b2761",
                width: "1"
              }
            }
          }
        ],
        series: [
          {
            name: "今日",
            type: "line",
            // smooth: true,
            // symbol: "circle", //折线点设置为实心点
            symbolSize: 8, //折线点的大小
            itemStyle: {
              normal: {
                color: this.lineColor, //折线点的颜色
                lineStyle: {
                  width: 2,
                  type: "solid", //'dotted'虚线 'solid'实线
                  color: this.lineColor
                }
              }
            },
            data: this.seriesData[0].data
          },
          {
            name: "昨日",
            smooth: false,
            symbolSize: 8, //折线点的大小
            itemStyle: {
              normal: {
                color: "#1581ff", //折线点的颜色
                lineStyle: {
                  width: 2,
                  type: "dotted", //'dotted'虚线 'solid'实线
                  color: "#1581ff"
                }
              }
            },
            data: this.seriesData[1].data,
            type: "line"
          }
        ]
      };
      this.chart.setOption(this.chartData);
    },
    initChart() {
      //主题macarons
      this.chart = echarts.init(this.$el, "");
      this.setOptions();
    },
    setLegendData() {
      for (let hour = 0; hour < 24; hour++) {
        this.legendData.data.push("" + hour);
      }
    }
  }
};
</script>
