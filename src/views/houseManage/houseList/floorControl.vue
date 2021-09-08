<template>
  <div>
    <el-table
      height="534px"
      v-loading="showLoading"
      :data="list_data"
      border
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      @cell-mouse-enter="enterRowChange"
      @cell-mouse-leave="leaveRowChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        prop="floor"
        align="center"
        width="50px"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        :width="list_data.length === 0 ? '' : '80px'"
        prop="count"
        align="center"
        :label="list_data.length === 0 ? '' : '总人数'"
        :show-overflow-tooltip="true"
      ></el-table-column>

      <el-table-column
        width="80px"
        v-for="(item, index) in maxHead"
        align="center"
        :key="'room-' + index"
        :label="(Array(2).join(0) + (index + 1)).slice(-2) + '室'"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <p @click="showHouseDetails(row, `room-${index}`)">
            {{ row["room-" + index] ? row["room-" + index].name : "" }}
          </p>
        </template>
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label=""
        v-for="(item, index) in maxCustomHead"
        :key="'custom-' + index"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <p @click="showHouseDetails(row, `custom-${index}`)">
            {{ row["custom-" + index] ? row["custom-" + index].name : "" }}
          </p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Emit } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { MessageBox } from "element-ui";
import {
  getWarning, //获取预警联系人
  addWarning, //添加预警联系人
  editWarning, //修改预警联系人
  deleteWarning, //删除预警联系人
  getGroup, //获取预警联系人分组
  addGroup, //添加预警联系人分组
  deleteGroup //删除预警联系人分组
} from "@/api/systemApi.ts";

import {
  getFloorControl, //获取入住人员楼控视图数据
  editHotelStaff // 修改备注
} from "@/api/peopleApi.ts";
import _axios from "@/plugins/axios.js";

@Component({
  mixins: [mixin],
  components: {}
})
export default class hotelstaff extends Vue {
  @Prop({ default: false }) createWarning: boolean;
  @Prop({
    default: () => {
      return { tag: "no" };
    }
  })
  warningFilterForm: object;
  @Prop({
    default: () => {
      return {
        //获取楼控列表url
        url: "/admin/hsHouse/view",
        method: "get",
        params: {
          tag: "no"
        }
      };
    }
  })
  initWarningForm: object;

  private list_data: Array<Object> = [];
  private maxHead: any = 0;
  private maxCustomHead: any = 0;
  private listQuery: Object = {
    // 楼控关键字
    buildingId: null
  };

  private dialogFormVisible: Boolean = false;

  created() {
    this.initForm["params"] = Object.assign(
      this.initWarningForm["params"],
      this.page,
      this.warningFilterForm
    ); // 合并参数
    this.initForm["url"] = "/admin/hsHouse/view";
  }

  fetchInfo() {
    this["showLoading"] = true;
    getFloorControl(this.listQuery).then((res: any) => {
      if (!res.data || !res.data.data) {
        return;
      }

      this.list_data = [];
      this.maxHead = 0;
      this.maxCustomHead = 0;

      let roomNum = 0; //本层楼的正常房间数目
      let customNum = 0; // 本层楼的自定义房间
      const info = res.data.data;
      for (const item of info) {
        roomNum = 0;
        customNum = 0;
        if (item.length === 0) {
          continue;
        }
        let floorInfo = {
          floor: `${item[0].storeyNum}F`,
          count: 0,
          // id: "",
          serial: ""
        };
        let roomKey;
        let roomName = "";

        for (const floorItem of item) {
          floorInfo["count"] += floorItem.personCnt;
          if (floorItem["isCustom"]) {
            roomKey = `custom-${customNum}`;
            roomName = " - " + floorItem["serial"];
            customNum++;
          } else {
            let houseNo =
              Number(floorItem.houseNo.slice(0, floorItem.houseNo.length - 1)) -
              1;
            roomKey = `room-${houseNo}`;
            roomNum++;
          }
          floorInfo[`${roomKey}`] = { name: "", id: "", serial: "" };
          if (floorItem.personCnt === 0) {
            floorInfo[`${roomKey}`].name = "闲置";
            floorInfo[`${roomKey}`].status = "3";
          } else if (floorItem.rentCnt > 0) {
            floorInfo[`${roomKey}`].name = "出租";
            floorInfo[`${roomKey}`].status = "2";
          } else {
            floorInfo[`${roomKey}`].name = "自住";
            floorInfo[`${roomKey}`].status = "1";
          }
          floorInfo[`${roomKey}`].id = floorItem.id;
          floorInfo[`${roomKey}`].serial = floorItem.serial;
          floorInfo[`${roomKey}`].name += roomName;
          floorInfo[`${roomKey}`].buildingName = floorItem.buildingName;
          floorInfo[`${roomKey}`].personCnt = floorItem.personCnt;
          floorInfo[`${roomKey}`].storeyNum = floorItem.storeyNum;
          floorInfo[`${roomKey}`].serialNumber = floorItem.serial;
          floorInfo[`${roomKey}`].note = floorItem.note;
          floorInfo[`${roomKey}`].createTime = floorItem.createTime;
        }

        if (roomNum > this.maxHead) {
          this.maxHead = roomNum;
        }
        if (customNum > this.maxCustomHead) {
          this.maxCustomHead = customNum;
        }
        this.list_data.push(floorInfo);
      }
      this.list_data.reverse();
      this["showLoading"] = false;
    });
  }

  headerCellStyle(cell) {
    if (cell.columnIndex === 0) {
      return "border: none;";
    }
    if (this.list_data.length === 0) {
      return "border: none;border-bottom: 1px solid #fff;";
    } else {
      return "border: none;border-bottom: 1px solid #C0C4CC;";
    }
  }

  cellStyle(cell) {
    const cellBorder =
      "border-right: 1px solid #C0C4CC;border-bottom: 1px solid #C0C4CC;";
    let cellStyle = "";
    if (cell.columnIndex === 0) {
      return "border-bottom: none;border-right: 1px solid #C0C4CC;";
    }
    if (cell.columnIndex === 1) {
      return cellBorder;
    }
    let col;
    if (cell.columnIndex - this.maxHead < 2) {
      col = cell.columnIndex - 2;
      if (!cell.row["room-" + col]) {
        cellStyle =
          "padding: 0px;background-color: #EBEEF5;color:#ffffff;cursor: pointer;";
      } else if (
        cell.row["room-" + col] &&
        cell.row["room-" + col].name === "闲置"
      ) {
        cellStyle =
          "padding: 0px;background-color: #67C23A;color:#ffffff;cursor: pointer;";
      } else if (
        cell.row["room-" + col] &&
        cell.row["room-" + col].name === "自住"
      ) {
        cellStyle =
          "padding: 0px;background-color: #409EFF;color:#ffffff;cursor: pointer;";
      }
    } else {
      col = cell.columnIndex - this.maxHead - 2;
      if (!cell.row["custom-" + col]) {
        cellStyle =
          "padding: 0px;background-color: #EBEEF5;color:#ffffff;cursor: pointer;";
      } else if (
        cell.row["custom-" + col] &&
        cell.row["custom-" + col].name.startsWith("闲置")
      ) {
        cellStyle =
          "padding: 0px;background-color: #67C23A;color:#ffffff;cursor: pointer;";
      } else if (
        cell.row["custom-" + col] &&
        cell.row["room-" + col].name === "自住"
      ) {
        cellStyle =
          "padding: 0px;background-color: #409EFF;color:#ffffff;cursor: pointer;";
      }
    }
    return cellBorder + cellStyle;
  }

  @Emit("showHouseDetails")
  showHouseDetails(row, key) {
    return { row, key };
  }
}
</script>

<style lang="scss" scoped>
.input-new-tag {
  width: 120px;
}

.under {
  color: #409eff;
  font-weight: bold;
}

.err {
  color: red;
}
</style>
