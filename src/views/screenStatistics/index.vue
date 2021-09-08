<template>
  <div id="data-view">
    <dv-full-screen-container>
      <top-header />
      <div class="main-content">
        <div class="content-left">
          <div class="content-left-chart">
            <!-- <div style="height:100%;"> -->
            <div class="chart-group">
              <pieChart
                :chartType="houseInfo"
                :groupTitle="1"
                :groupCount="pieCount1"
              />
            </div>
            <div class="chart-group">
              <pieChart
                :chartType="stallInfo"
                :groupTitle="2"
                :groupCount="pieCount2"
              />
            </div>
            <div class="chart-group">
              <pieChart
                :chartType="userInfo"
                :groupTitle="3"
                :groupCount="pieCount3"
              />
            </div>
            <div class="chart-group">
              <pieChart
                :chartType="carInfo"
                :groupTitle="4"
                :groupCount="pieCount4"
              />
            </div>
            <!-- </div> -->
          </div>
          <div class="content-left-data">
            <dataCollection />
          </div>
        </div>
        <div class="content-main">
          <div class="content-data-top">
            <contentVideo />
          </div>
          <div class="content-data">
            <dv-border-box-10>
              <lineChart :groupTitle="1" />
            </dv-border-box-10>
          </div>
          <div class="content-data content-rewrite">
            <dv-border-box-10>
              <lineChart :groupTitle="2" />
            </dv-border-box-10>
          </div>
        </div>
        <div class="content-right">
          <div class="scroll-device">
            <scrollDevice />
          </div>

          <div class="device-map">
            <deviceMap />
          </div>
        </div>
      </div>
      <div class="footer"></div>
    </dv-full-screen-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import topHeader from "./components/topHeader.vue";
import pieChart from "./components/pieChart.vue";
import contentVideo from "./components/contentVideo.vue";
import scrollDevice from "./components/scrollDevice.vue";
import dataCollection from "./components/dataCollection.vue";
import deviceMap from "./components/deviceMap.vue";
import lineChart from "./components/lineChart.vue";
import {
  houseSpace,
  vehicleSpace,
  residentSpace,
  carSpace
} from "@/api/screenShow.ts";

@Component({
  components: {
    topHeader,
    pieChart,
    contentVideo,
    scrollDevice,
    dataCollection,
    deviceMap,
    lineChart
  }
})
export default class ScreenStatistics extends Vue {
  private pieCount1: any = 0;
  private pieCount2: any = 0;
  private pieCount3: any = 0;
  private pieCount4: any = 0;
  private houseInfo: Array<Object> = [
    { name: "自住", num: 400, percentage: 2, color: "#F04767" },
    { name: "出租", num: 200, percentage: 3, color: "#FFCE26" },
    { name: "闲置", num: 100, percentage: 8, color: "#37DAB5" }
  ];
  private stallInfo: Array<Object> = [
    { name: "固定", num: 400, percentage: 2, color: "#F04767" },
    { name: "空闲", num: 200, percentage: 3, color: "#37DAB5" },
    { name: "访客", num: 100, percentage: 8, color: "#1581FF" }
  ];
  private userInfo: Array<Object> = [
    { name: "自住", num: 400, percentage: 2, color: "#F04767" },
    { name: "租客", num: 200, percentage: 3, color: "#FFCE26" }
  ];
  private carInfo: Array<Object> = [
    { name: "业主车辆", num: 400, percentage: 2, color: "#F04767" },
    { name: "租客车辆", num: 200, percentage: 3, color: "#FFCE26" },
    { name: "访客车辆", num: 100, percentage: 8, color: "#1581FF" }
  ];

  created() {
    this.fetchData();
  }

  mounted() {
    // 添加键盘Esc事件
    this.$nextTick(() => document.addEventListener("keyup", this.keyupEvent));
  }

  destroyed() {
    document.removeEventListener("keyup", this.keyupEvent);
  }

  keyupEvent(e) {
    if (e.keyCode == 27) {
      this.$router.push("/dashboard");
    }
  }

  async fetchData() {
    this.getHouse();
    this.getVehicleSpace();
    this.getResident();
    this.getCarSpace();
  }

  async getHouse() {
    const { data } = await houseSpace();

    this.pieCount1 = data.data.houseCount;
    this.houseInfo[0]["num"] = data.data.selfCount;
    this.houseInfo[0]["percentage"] =
      this.pieCount1 > 0
        ? ((data.data.selfCount / data.data.houseCount) * 100).toFixed(1)
        : 0;
    this.houseInfo[1]["num"] = data.data.rentCount;
    this.houseInfo[1]["percentage"] =
      this.pieCount1 > 0
        ? ((data.data.rentCount / data.data.houseCount) * 100).toFixed(1)
        : 0;
    this.houseInfo[2]["num"] = data.data.emptyCount;
    this.houseInfo[2]["percentage"] =
      this.pieCount1 > 0
        ? ((data.data.emptyCount / data.data.houseCount) * 100).toFixed(1)
        : 0;
  }

  async getVehicleSpace() {
    const { data } = await vehicleSpace();

    this.pieCount2 = data.data.count;
    this.stallInfo[0]["num"] = data.data.fixedCount;
    this.stallInfo[0]["percentage"] =
      this.pieCount2 > 0
        ? ((data.data.fixedCount / data.data.count) * 100).toFixed(1)
        : 0;
    this.stallInfo[1]["num"] = data.data.emptyCount;
    this.stallInfo[1]["percentage"] =
      this.pieCount2 > 0
        ? ((data.data.emptyCount / data.data.count) * 100).toFixed(1)
        : 0;
    this.stallInfo[2]["num"] = data.data.unfixedCount;
    this.stallInfo[2]["percentage"] =
      this.pieCount2 > 0
        ? ((data.data.unfixedCount / data.data.count) * 100).toFixed(1)
        : 0;
  }

  async getResident() {
    const { data } = await residentSpace();

    this.pieCount3 = data.data.count;
    this.userInfo[0]["num"] = data.data.selfCount;
    this.userInfo[0]["percentage"] =
      this.pieCount3 > 0
        ? ((data.data.selfCount / data.data.count) * 100).toFixed(1)
        : 0;
    this.userInfo[1]["num"] = data.data.rentCount;
    this.userInfo[1]["percentage"] =
      this.pieCount3 > 0
        ? ((data.data.rentCount / data.data.count) * 100).toFixed(1)
        : 0;
  }

  async getCarSpace() {
    const { data } = await carSpace();

    this.pieCount4 = data.data.count;
    this.carInfo[0]["num"] = data.data.selfCount;
    this.carInfo[0]["percentage"] =
      this.pieCount4 > 0
        ? ((data.data.selfCount / data.data.count) * 100).toFixed(1)
        : 0;
    this.carInfo[1]["num"] = data.data.visitorCar;
    this.carInfo[1]["percentage"] =
      this.pieCount4 > 0
        ? ((data.data.visitorCar / data.data.count) * 100).toFixed(1)
        : 0;
    this.carInfo[2]["num"] = data.data.tenementCount;
    this.carInfo[2]["percentage"] =
      this.pieCount4 > 0
        ? ((data.data.tenementCount / data.data.count) * 100).toFixed(1)
        : 0;
  }
}
</script>

<style lang="scss" scoped>
#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #9dc6dd;
  font-family: PingFangSC-Medium;

  #dv-full-screen-container {
    background-image: url("./components/img/backgroundimg.jpg");
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    display: flex;
    margin: 0 30px;

    .content-left {
      display: 1;
      width: 22%;
      height: 100%;
    }

    .content-left-chart {
      height: 67%;
      display: 1;
      display: flex;
      flex-direction: column;
    }
    .chart-group {
      height: 25%;
      display: 1;
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }
    .content-left-data {
      height: 33%;
      display: 1;
      display: flex;
    }

    .content-main {
      width: 45%;
      // border: 1px solid red;
      margin: 0 20px;
    }
    .content-data-top {
      width: 100%;
      height: 31.4%;
      margin-bottom: 16px;
    }

    .content-data {
      width: 100%;
      height: 32.2%;
      // border: 1px solid red;
      margin-bottom: 16px;
    }
    .content-rewrite {
      margin-bottom: 0px;
    }

    .content-right {
      width: 34%;
    }

    .scroll-device {
      height: 50%;
      // border: 1px solid red;
    }

    .device-map {
      height: 50%;
      // border: 1px solid red;
    }
  }
  .footer {
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    background-image: url("./components/img/footer.png");
    background-size: 100% 100%;
    background-position: center;
    margin-top: 5px;
  }
}
</style>
