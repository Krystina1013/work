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
        let xAxis_1 = this.value.yes
        let xAxis_2 = this.value.mon
        let option = {
          title: {
            text: '',
            subtext: ''
          },
          grid: {
            top: '10%',
            left: '10%',
            right: '5%',
            bottom: '10%',
          },
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#fff',
            extraCssText: 'box-shadow: 0px 10px 24px 0px rgba(29,42,68,0.12); ',
            padding: [10, 20],
            formatter: function (params, callback) {
              var value = ''
              if (params) {
                value = '<div style="display:flex"><div style="width:8px;height:8px;border-radius:50%;background-color:#2d99ff;margin-right:9px;margin-top:5px"></div>' + params[0].data + '</div><div style="display:flex;margin-top:10px"><div style="width:8px;height:8px;border-radius:50%;background-color:#2cd9c5;margin-right:9px;margin-top:5px"></div>' + params[1].data + '</div>'
              }
              return value
            },
            textStyle: {
              color: '505d6f',
              fontSize: 12,
              fontWeight: 700
            }
          },
          legend: {
            data: []
          },
          toolbox: {
            show: false,
          },
          calculable: true,
          xAxis: [
            {
              type: 'value',
              boundaryGap: [0, 0.01],
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#e9ebf1',
                  width: 1,
                },
              },
              axisLabel: {
                textStyle: {
                  color: '#9aa1a9',
                  fontSize: 10,
                  fontWeight: 500,
                  fontFamily: 'Source Han Sans CN, Source Han Sans CN-Medium',
                }
              },
            }
          ],
          yAxis: [
            {
              type: 'category',
              data: ['未打卡', '早退', '迟到', '正常'],
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                textStyle: {
                  color: '#313640',
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: 'Source Han Sans CN, Source Han Sans CN-Medium',
                }
              }
            },
          ],
          series: [
            {
              name: '昨日',
              type: 'bar',
              barWidth: 14,
              itemStyle: {
                normal: {
                  barBorderRadius: [0, 7, 7, 0],
                  color: '#2d99ff'
                }
              },
              data: xAxis_1
            },
            {
              name: '本月',
              type: 'bar',
              barWidth: 14,
              itemStyle: {
                normal: {
                  barBorderRadius: [0, 7, 7, 0],
                  color: '#2cd9c5'
                },
              },
              data: xAxis_2
            }
          ]
        };
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
