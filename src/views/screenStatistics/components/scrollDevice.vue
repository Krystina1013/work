<template>
  <div id="scroll-board">
    <div class="example-left1"></div>
    <div class="example-left2"></div>
    <div class="example-right1"></div>
    <div class="example-right2"></div>
    <div class="example-top1"></div>
    <div class="example-top2"></div>
    <div class="example-down1"></div>
    <div class="example-down2"></div>
    <dv-scroll-board class="scroll-board-example" :config="dataList" />
  </div>
</template>

<script>
import { alartTotle } from "@/api/screenShow.ts";

export default {
  name: "ScrollBoard",
  data() {
    return {
      dataList: {
        header: ["告警类型", "告警状态", "告警内容", "上报时间"],
        data: [],
        index: true,
        columnWidth: [54, 88, 76, 110],
        align: ["center"],
        rowNum: 7,
        headerBGC: "rgba(21,40,97)",
        headerHeight: 52,
        oddRowBGC: "RGB(11,23,78)",
        evenRowBGC: "#102052",
        indexHeader: "序号",
        color: "#9dc6dd"
      },
      timer: null
    };
  },

  created() {
    this.fetchData();
    this.timer = setInterval(() => {
      this.fetchData();
    }, 30000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    async fetchData() {
      var data = [];

      const info = await alartTotle({ page: 1, limit: 7 });
      const records = info.data.data.records;

      for (const i in records) {
        switch (records[i].reportType) {
          case "1":
            records[i].reportType = "设备";
            break;
          case "2":
            records[i].reportType = "关注人员";
            break;
          case "3":
            records[i].reportType = "布控人员";
            break;
        }

        switch (records[i].reportStatus) {
          case "1":
            records[i].reportStatus = "待处理";
            break;
          case "2":
            records[i].reportStatus = "处理中";
            break;
          case "3":
            records[i].reportStatus = "忽略";
            break;
          case "4":
            records[i].reportStatus = "已处理";
            break;
        }

        data.push([
          records[i].reportType,
          records[i].reportStatus,
          records[i].reportContent,
          records[i].updateTime
        ]);

        for (const key in data) {
          switch (data[key][1]) {
            case "待处理":
              data[key][1] = '<span style="color:#F04767;">待处理</span>';
              break;
            case "处理中":
              data[key][1] = '<span style="color:#37DAB5;">处理中</span>';
              break;
            case "已处理":
              data[key][1] = '<span style="color:#BBDBEE;">已处理</span>';
              break;
            case "忽略":
              data[key][1] = '<span style="color:#1581FF;">忽略</span>';
              break;
          }
        }
      }
      let newData = { ...this.dataList };
      newData.data = data;
      this.dataList = newData;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$border: rgba(14, 57, 112, 0.8);
$background-left1: linear-gradient(to right, #091449, #435c95);
$background-left2: linear-gradient(to right to bottom, #435c95, #091449);
$background-top1: linear-gradient(to bottom, #091449, #435c95);
$background-top2: linear-gradient(to bottom, #435c95, #091449);
$absolute: absolute;
$z-index: 999;

#scroll-board {
  height: 95%;
  border: 1px solid $border;
  overflow: hidden;
  position: relative;
  font-size: 12px;
  margin-bottom: 24px;

  .scroll-board-example {
    position: relative;
    font-size: 14px;
  }
}

.example-left1 {
  width: 144px;
  height: 2px;
  background: $background-left2;
  position: $absolute;
  top: 0px;
  z-index: $z-index;
}

.example-left2 {
  width: 265px;
  height: 2px;
  background: $background-left2;
  position: $absolute;
  bottom: -1px;
  z-index: $z-index;
}

.example-right1 {
  width: 144px;
  height: 2px;
  background: $background-left1;
  position: $absolute;
  top: -1px;
  right: -1px;
  z-index: $z-index;
}

.example-right2 {
  width: 265px;
  height: 2px;
  background: $background-left1;
  position: $absolute;
  bottom: -1px;
  right: -1px;
  z-index: $z-index;
}

.example-top1 {
  width: 2px;
  height: 144px;
  background: $background-top1;
  position: $absolute;
  bottom: -1px;
  z-index: $z-index;
}

.example-top2 {
  width: 2px;
  height: 144px;
  background: $background-top1;
  position: $absolute;
  bottom: -1px;
  right: -1px;
  z-index: $z-index;
}

.example-down1 {
  width: 2px;
  height: 144px;
  background: $background-top2;
  position: $absolute;
  top: -1px;
  right: -1px;
  z-index: $z-index;
}

.example-down2 {
  width: 2px;
  height: 144px;
  background: $background-top2;
  position: $absolute;
  top: 0px;
  left: -1px;
  z-index: $z-index;
}
</style>
