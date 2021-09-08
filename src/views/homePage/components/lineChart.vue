<template>
  <div :id="id" class="charts chart-line"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'ChartLine',
  props: {
    id: String,
    value: Object,
    text: String,
    subtext: String
  },
  data() {
    return {
      dom: null,
      option: {},
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        this.value = newValue;  //把新值赋值给我们的属性数据
        this.initChart();  //刷新echarts图表
      },
      deep: true
    },
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    initChart() {
      this.$nextTick(() => {
        let xAxisData = this.value.date
        let yAxisData = this.value.value
        let option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#fff',
            extraCssText: 'box-shadow: 0px 10px 24px 0px rgba(29,42,68,0.12); ',
            padding: [10, 20],
            formatter: "{b} <br/> {c} 人",
            textStyle: {
              color: '505d6f',
              fontSize: 12,
              fontWeight: 700
            }
          },
          legend: {
            show: false,
          },
          grid: {
            top: '10%',
            left: '10%',
            right: '5%',
            bottom: '10%',
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E9EBF1',
                width: 1,
              },
            },
            axisLabel: {
              textStyle: {
                color: '#9AA1A9',
                fontSize: 10,
                fontWeight: 500
              }
            },
            data: xAxisData,
          },
          yAxis: {
            type: "value",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E9EBF1',
                width: 1,
              },
            },
            axisLabel: {
              textStyle: {
                color: '#9AA1A9',
                fontSize: 10,
                fontWeight: 500
              }
            },
          },
          series: [
            {
              symbol: 'none',
              smooth: true,
              data: yAxisData,
              name: '',
              type: "line",
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#2D99FF',
                    width: 0,
                  }
                }
              },
              areaStyle: {
                color: '#2D99FF',
              }
            },
          ],
        }
        this.dom = echarts.init(document.getElementById(this.id))
        this.dom.setOption(option)
        window.addEventListener("resize", this.dom.resize);        //添加 监听屏幕缩放
      }, 500)
    }
  },
  mounted() {
    this.initChart()
  },
}
</script>
