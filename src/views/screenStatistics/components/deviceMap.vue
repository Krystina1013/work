<template>
  <baidu-map
    id="device-map"
    scroll-wheel-zoom
    :center="center"
    :zoom="zoom"
    :mapStyle="mapStyle"
  >
    <bm-control
      anchor="BMAP_ANCHOR_TOP_RIGHT"
      :offset="{ width: 20, height: 20 }"
    >
      <div class="device-box">
        <!-- <el-button :plain="true">设备状态</el-button> -->
        <p class="device-icon"></p>
        <p class="device-type">设备状态</p>

        <p class="device-normal-dot"></p>
        <p class="normol-text">正常</p>
        <p class="device-falult-dot"></p>
        <p class="device-type">离线</p>
        <div class="more" @click="handleDevice">
          <p class="device-icon link-icon"></p>
          <p>更多</p>
        </div>
      </div>
    </bm-control>

    <device-point
      v-for="(obj, index) in deviceData"
      :key="index"
      :deviceInfo="obj"
    >
    </device-point>
  </baidu-map>
</template>

<script>
import DevicePoint from "./deviceMapPoint.vue";
import { getDeviceList } from "@/api/deviceApi.ts";

export default {
  name: "deviceMap",
  components: {
    DevicePoint
  },
  data() {
    return {
      center: { lng: 104.060026, lat: 30.563268 },
      zoom: 4,
      mapStyle: {
        styleJson: [
          {
            featureType: "all",
            elementType: "all",
            stylers: {
              lightness: 10,
              saturation: 1
            }
          }
        ]
      },

      deviceData: [
        { lng: 104.060026, lat: 30.563268, fault: true },
        { lng: 104.060339, lat: 30.562243, fault: false },
        { lng: 104.058762, lat: 30.563686, fault: false }
      ]
    };
  },

  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.deviceData = [];
      const { data } = await getDeviceList({ page: 1, limit: 10 });
      const records = data.data.records;
      for (const i in records) {
        if (records[i]["type"] !== "3") {
          this.deviceData.push({
            lng: records[i]["longitude"],
            lat: records[i]["latitude"],
            fault: this.status(records[i]["status"])
          });
        }
      }
    },

    status(status) {
      if (status === "ONLINE") {
        return false;
      } else {
        return true;
      }
    },

    handleDevice() {
      this.$router.push({ name: "_manage" });
    }
  }
};
</script>

<style lang="scss" scoped>
$border: RGB(13, 54, 109);
$falult-color: #f55c61;
$normal-color: #37dab5;
#device-map {
  width: 100%;
  height: 100%;
  border: 1px solid $border;

  .device-box {
    width: 100%;
    height: 48px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    border: 1px solid #ffffff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    background: #ffffff;
    color: #666666;
    font-size: 16px;
  }

  .device-icon {
    width: 18px;
    height: 18px;
    background-image: url("./img/device.png");
    background-position: center;
    background-repeat: no-repeat;
    margin-right: 7px;
  }

  .device-type {
    padding-right: 24px;
    margin-right: 24px;
    border-right: 1px solid #e5e5e5;
  }
  .device-falult-dot {
    background: $falult-color;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    box-shadow: 0 0 5px #000;
    margin-right: 8px;
  }
  .device-normal-dot {
    background: $normal-color;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    box-shadow: 0 0 5px #000;
  }

  .normol-text {
    margin: 0 32px 0 8px;
  }

  .more {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .link-icon {
    background-image: url("./img/gengduo.png");
  }
}
</style>
