<template>
  <div id="content-main">
    <div class="content-main">
      <div
        class="cintent-group"
        v-for="(item, index) in videoPerson.slice(0, 7)"
        :key="index"
      >
        <div class="photos">
          <img v-if="item.photos" :src="item.photos" alt="" />
          <img v-else src="../../../assets/none.png" alt="" />
        </div>
        <p
          v-if="(item.devAddress + item.passTime).length <= 10"
          class="address"
        >
          {{ item.devAddress ? item.devAddress : "未知" }}{{ item.passTime }}
        </p>
        <Scroller
          v-if="(item.devAddress + item.passTime).length > 10"
          :lists="item.devAddress + '\xa0\xa0\xa0' + item.passTime"
          class="scrollContainer left address"
          :id="index + 1"
        />
      </div>
    </div>

    <div class="content-main">
      <div
        v-if="videoCar.length > 0"
        class="cintent-group"
        v-for="(item, index) in videoCar.slice(0, 7)"
        :key="index"
      >
        <div class="photos">
          <img v-if="item.photos" :src="item.photos" alt="" />
          <img v-else src="../../../assets/none.png" alt="" />
        </div>
        <p v-if="(item.address + item.passTime).length <= 10" class="address">
          {{ item.address ? item.address : "未知" }} {{ item.passTime }}
        </p>
        <Scroller
          v-if="(item.address + item.passTime).length > 10"
          :lists="item.address + '\xa0\xa0\xa0' + item.passTime"
          class="scrollContainer left address"
          :id="'a' + index + 1"
        />
      </div>

      <div
        v-if="videoCar.length === 0"
        class="cintent-group"
        v-for="(item, index) in videoPerson.slice(7, 14)"
        :key="index"
      >
        <div class="photos">
          <img v-if="item.photos" :src="item.photos" alt="" />
          <img v-else src="../../../assets/none.png" alt="" />
        </div>
        <p
          v-if="(item.devAddress + item.passTime).length <= 10"
          class="address"
        >
          {{ item.devAddress ? item.devAddress : "未知" }}{{ item.passTime }}
        </p>
        <Scroller
          v-if="(item.devAddress + item.passTime).length > 10"
          :lists="item.devAddress + '\xa0\xa0\xa0' + item.passTime"
          class="scrollContainer left address"
          :id="'a' + index + 1"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { getGatherPerson, getGatherCar } from "@/api/screenShow.ts";

import Scroller from "./Scroller.vue";
@Component({
  components: { Scroller },
  filters: {
    titleFilter(val: string) {
      const data = {
        "1": "办公室使用情况",
        "2": "车位使用情况",
        "3": "办公成员情况",
        "4": "车辆情况"
      };
      return data[val];
    }
  }
})
export default class Pie extends Vue {
  name: "Pie";
  @Prop() private chartType: any;
  @Prop() private groupTitle: any;

  private limit: number = 14;

  private videoPerson: Array<Object> = [
    // {
    //   photos: require("./img/person.png"),
    //   address: "北大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/person1.png"),
    //   address: "北大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/person2.png"),
    //   address: "北大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/person3.png"),
    //   address: "北大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/person1.png"),
    //   address: "北大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/person2.png"),
    //   address: "北大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/person.png"),
    //   address: "北大门",
    //   passTime: "2020-04-24 14:12:00"
    // }
  ];

  private videoCar: Array<Object> = [
    // {
    //   photos: require("./img/car1.jpg"),
    //   address: "南大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/car2.jpg"),
    //   address: "南大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/car3.jpg"),
    //   address: "南大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/car4.jpg"),
    //   address: "南大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/car1.jpg"),
    //   address: "南大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/car2.jpg"),
    //   address: "南大门",
    //   passTime: "2020-04-24 14:12:00"
    // },
    // {
    //   photos: require("./img/car4.jpg"),
    //   address: "南大门",
    //   passTime: "2020-04-24 14:12:00"
    // }
  ];
  private timer: any = null;

  created() {
    this.fetchData();
    this.timer = setInterval(() => {
      this.fetchData();
    }, 5000);
  }

  beforeDestroy() {
    clearInterval(this.timer);
  }

  fetchData() {
    this.fetchPersonList();
    this.fetchCarList();
  }

  fetchPersonList() {
    getGatherPerson({ limit: this.limit }).then(res => {
      res.data.data.map(item => {
        if (
          new Date().toDateString() ===
          new Date(item["passTime"]).toDateString()
        ) {
          item["passTime"] = item["passTime"].split(" ")[1];
        } else {
          item["passTime"] =
            item["passTime"].split(" ")[0] +
            "\xa0\xa0" +
            item["passTime"].split(" ")[1];
        }

        if (!item.devAddress) {
          item.devAddress = "未知";
        }
      });

      this.videoPerson = res.data.data;
    });
  }

  fetchCarList() {
    getGatherCar({ limit: this.limit }).then(res => {
      res.data.data.map(item => {
        if (
          new Date().toDateString() ===
          new Date(item["passTime"]).toDateString()
        ) {
          item["passTime"] = item["passTime"].split(" ")[1];
        } else {
          item["passTime"] =
            item["passTime"].split(" ")[0] +
            "\xa0\xa0" +
            item["passTime"].split(" ")[1];
        }

        if (!item.address) {
          item.address = "未知";
        }
      });

      this.videoCar = res.data.data;
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$border: RGB(13, 54, 109);
#content-main {
  height: 100%;
  display: 1;
  display: flex;
  flex-direction: column;
  .content-main {
    height: 50%;
    display: flex;
    // justify-content: space-between;
    // border: 1px solid red;
  }
  .cintent-group {
    width: 13%;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    margin-right: 10px;
  }

  .cintent-group:last-child {
    margin-right: 0px;
  }

  .address {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .photos {
    // width: 100%;
    width: 90px;
    height: 90px;
  }

  .cintent-group .photos img {
    width: 100%;
    height: 100%;
  }

  .scrollContainer {
    margin-top: 8px;
  }
}
</style>
