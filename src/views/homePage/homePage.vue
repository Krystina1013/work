<template>
  <div class="layout-content container" v-loading='allLoading'>
    <div class="flex">
      <infoHeader :icon="'icon-shangban'" :title="'办公室'" :value="basicData.houseCount || 0"></infoHeader>
      <infoHeader :icon="'icon-shangban'" :title="'办公室成员'" :value="basicData.personCount || 0"></infoHeader>
      <infoHeader :icon="'icon-shangban'" :title="'物业人员'" :value="basicData.authUserCount || 0"></infoHeader>
      <infoHeader :icon="'icon-shangban'" :title="'门禁卡'" :value="basicData.doorCardCount || 0"></infoHeader>
      <infoHeader :icon="'icon-shangban'" :title="'关注人员'" :value="basicData.careManCount || 0"></infoHeader>
      <infoHeader class="last-child" :icon="'icon-shangban'" :title="'累计来访人员'" :value="basicData.visitorCount || 0"></infoHeader>
    </div>
    <div class="flex">
      <div class="left_col">
        <div class="top_row">
          <div class="card-title">
            <p>考勤统计</p>
            <div class="showTab">
              <div class="show_tab normal"></div>
              <span>昨日</span>
              <div class="show_tab formal"></div>
              <span>本月</span>
            </div>
          </div>
          <barChart :id="'check_info'" style="height:calc(100% - 36px)" :value="checkInfo"></barChart>
        </div>
        <div class="bottom_row">
          <div class="card-title">通行流量<span class="node">（近7天）</span></div>
          <lineChart :id="'access_info'" style="height:calc(100% - 36px)" :value="personpassInfo"></lineChart>
        </div>
      </div>
      <div class="right_col">
        <div class="top_row">
          <div class="card-title">设备类型<span class="node">（今日）</span></div>
          <div class="flex card_dev">
            <pieChart style="width:50%;height:100%" :value="deviceInfo" :color="'#2CD8C5'" :pieName="'门禁'"></pieChart>
            <el-divider class="divider_long" direction="vertical"></el-divider>
            <pieChart style="width:50%;height:100%" :value="cameraInfo" :color="'#33A5FE'" :pieName="'摄像机'"></pieChart>
          </div>
        </div>
        <div class="bottom_row">
          <div class="card-title">预警类型<span class="node">（近7天）</span></div>
          <div class="flex card_dev">
            <div class="alarm_item">
              <img src="../../assets/homepage/Frame(1).png" class="logo_img" />
              <img src="../../assets/homepage/round3.png" class="round3 anticlockwise delay3" />
              <img src="../../assets/homepage/round2.png" class="round2 clockwise delay3" />
              <img src="../../assets/homepage/round1.png" class="round1 anticlockwise delay3" />
              <p class="value">{{ alarmInfo.ALERT_MAN || 0 }}</p>
              <p>关注人员</p>
            </div>
            <el-divider class="divider_long" direction="vertical"></el-divider>
            <div class="alarm_item">
              <img src="../../assets/homepage/Frame.png" class="logo_img" />
              <img src="../../assets/homepage/round3.png" class="round3 anticlockwise delay3" />
              <img src="../../assets/homepage/round2.png" class="round2 clockwise delay3" />
              <img src="../../assets/homepage/round1.png" class="round1 anticlockwise delay3" />
              <p class="value">{{ alarmInfo.DEVICE_DOWN || 0 }}</p>
              <p>设备离线</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import infoHeader from "./components/infoHeader.vue";
import barChart from "./components/barChart.vue";
import pieChart from "./components/pieChart.vue";
import lineChart from "./components/lineChart.vue";

import { getScene, basicData, checkData, deviceData, accessData, alarmData } from "@/api/homeApi.ts";

export default {
  components: { infoHeader, barChart, pieChart, lineChart },

  data() {
    return {
      allLoading: false,
      basicData: {
        authUserCount: 0,
        careManCount: 0,
        doorCardCount: 0,
        houseCount: 0,
        personCount: 0,
        visitorCount: 0,
      },

      checkInfo: {
        yes: [],
        mon: []
      },

      deviceInfo: {
        num: 0,
        value: []
      },
      cameraInfo: {
        num: 0,
        value: []
      },

      personpassInfo: {
        date: [],
        value: [],
      },

      alarmInfo: {
        ALERT_MAN: 0,
        DEVICE_DOWN: 0
      }
    }
  },

  async created() {
    const { data } = await getScene();
    this.scenDataInfo = Object.assign({}, data.data);
    localStorage.setItem('name', this.scenDataInfo.name) //保存到localStorage
    // this.getAlarmData();
    this.getIndexData();
    // if (this.scenDataInfo.imageUrlList.length === 0) {
    //   this.scenDataInfo.imageUrlList = this.defautBanner;
    // }
    // this.path = config.wsURL + _scenceId + "/" + _token;
    // this.initSocket();
  },

  methods: {
    getIndexData() {
      this.allLoading = true;
      basicData().then((res) => {
        if (res.data.code === 200) {
          this.basicData = res.data.data
        }
      })
      checkData().then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data;
          if (data['昨日']) {
            this.checkInfo.yes.push(data['昨日']['缺勤'])
            this.checkInfo.yes.push(data['昨日']['早退'])
            this.checkInfo.yes.push(data['昨日']['迟到'])
            this.checkInfo.yes.push(data['昨日']['正常'])
          }
          if (data['本月']) {
            this.checkInfo.mon.push(data['本月']['缺勤'])
            this.checkInfo.mon.push(data['本月']['早退'])
            this.checkInfo.mon.push(data['本月']['迟到'])
            this.checkInfo.mon.push(data['本月']['正常'])
          }
        }
      })
      deviceData().then((res) => {
        if (res.data.code === 200) {
          this.deviceInfo.num = res.data.data.deviceCount
          this.cameraInfo.num = res.data.data.cameraCount
          this.deviceInfo.value.push({
            name: '在线', value: res.data.data.onlineDeviceCount
          })
          this.deviceInfo.value.push({
            name: '离线', value: res.data.data.deviceCount - res.data.data.onlineDeviceCount
          })
          this.cameraInfo.value.push({
            name: '在线', value: res.data.data.onlineCameraCount
          })
          this.cameraInfo.value.push({
            name: '离线', value: res.data.data.cameraCount - res.data.data.onlineCameraCount
          })
        }
      })
      accessData().then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data;
          if (data.passTendency) {
            for (let item in data.passTendency) {
              this.personpassInfo.date.push(item);
              this.personpassInfo.value.push(data.passTendency[item]);
            }
          }
        }
      })
      alarmData().then((res) => {
        if (res.data.code === 200) {
          this.alarmInfo.ALERT_MAN = res.data.data.ALERT_MAN
          this.alarmInfo.DEVICE_DOWN = res.data.data.DEVICE_DOWN
        }
      })

      this.allLoading = false;
    },
  }
}
</script>

<style lang="scss" scoped>
$width: 1920;
$height: 1000;
@function grid-width($n) {
  @return ($n/$width) * 100vw;
}
@function grid-height($n) {
  @return ($n/$height) * 100vh;
}

.container {
  height: calc(100vh - 81px);
  background-color: #f0f2f5;
  position: relative;
  overflow-y: auto;
  overflow-x: auto;
  padding: 10px;
  color: #333;
}
.last-child {
  margin-right: 0;
}
.left_col {
  width: 57%;
  margin-top: 15px;
  margin-right: 15px;
}
.right_col {
  flex: 1;
  margin-top: 15px;
}
.top_row {
  height: 374px;
  padding: 15px;
  margin-bottom: 15px;
  background: #fff;
}
.bottom_row {
  height: 361px;
  padding: 15px;
  background: #fff;
}
.card-title {
  height: 24px;
  font-size: 18px;
  font-family: PingFang SC, PingFang SC-Bold;
  font-weight: 700;
  color: #313640;
  margin-bottom: 15px;
  p {
    float: left;
  }
  .node {
    font-family: PingFang SC, PingFang SC-Regular;
    font-weight: 400;
    color: #313640;
    margin-left: 13px;
  }
}
.card_dev {
  height: 295px;
}
.showTab {
  float: right;
  display: flex;
  padding-right: 25px;
  height: 24px;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  line-height: 24px;
  color: #313640;
  .show_tab {
    height: 8px;
    width: 8px;
    margin-top: 8px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .normal {
    background-color: #2d99ff;
  }
  .formal {
    margin-left: 24px;
    background-color: #2cd8c5;
  }
}
.divider_long {
  height: 200px;
  margin-top: 39px;
  background: #e4e7ed;
}
.alarm_item {
  width: 50%;
  height: 100%;
  text-align: center;
  position: relative;
  .logo_img {
    width: 37px;
    height: 37px;
    margin-top: 91px;
  }
  .value {
    font-size: 24px;
    font-family: DIN, DIN-Bold;
    font-weight: 700;
    color: #409eff;
    margin-top: 65px;
    margin-bottom: 6px;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    color: #313640;
  }
}

.round3 {
  position: absolute;
  width: 169px;
  height: 169px;
  top: 25px;
  left: 50%;
  margin-left: -84.5px;
  z-index: 0;
}
.round2 {
  position: absolute;
  width: 126px;
  height: 126px;
  top: 47px;
  left: 50%;
  margin-left: -63px;
  z-index: 0;
}
.round1 {
  position: absolute;
  width: 91px;
  height: 91px;
  top: 64px;
  left: 50%;
  margin-left: -45.5px;
  z-index: 0;
}
.anticlockwise {
  -webkit-transform: rotate(360deg);
  animation: anticlockwise 4s linear infinite;
  -moz-animation: anticlockwise 4s linear infinite;
  -webkit-animation: anticlockwise 4s linear infinite;
  -o-animation: anticlockwise 4s linear infinite;
}
.clockwise {
  -webkit-transform: rotate(360deg);
  animation: clockwise 4s linear infinite;
  -moz-animation: aclockwise 4s linear infinite;
  -webkit-animation: clockwise 4s linear infinite;
  -o-animation: clockwise 4s linear infinite;
}
@-webkit-keyframes anticlockwise {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(-360deg);
  }
}
@-webkit-keyframes clockwise {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
.delay3 {
  animation-delay: 0.9s;
}
</style>