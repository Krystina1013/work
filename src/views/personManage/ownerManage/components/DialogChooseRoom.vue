<template>
  <div>
    <el-dialog class="newDialog noPadding" :close-on-click-modal="false" title="选择办公室" :visible="true" width="1000px" :before-close="handleClose">
      <div class="mainContentWrapper">
        <div class="leftWrapper">
          <el-tree :expand-on-click-node="false" node-key="name" :current-node-key="currentNodeKey" :default-expanded-keys="defaultExpandedKeys" highlight-current :data="treeData" :props="{ children: 'subBuildings', label: 'name' }" @node-click="
              currentNode = $event;
              gotoTheFirstPage();
            "></el-tree>
        </div>
        <div class="rightWrapper">
          <div class="searchWrapper">
            <span class="fieldWrapper" style="display:flex">
              <span class="field">
                <span class="label">门牌号：</span>
                <el-input style="width:200px" size="small" v-model="searchField.serialNumber"></el-input>
              </span>
            </span>
            <span class="buttonWrapper">
              <el-button type="primary" size="small" @click="gotoTheFirstPage">查询</el-button>
            </span>
          </div>
          <div class="resultWrapper">
            <div style="margin-bottom:10px" v-if="this.selectedRoom">已选择{{this.selectedRoom.length}}个</div>
            <el-table ref="table" :data="tableData" :key="TableKey" stripe border>
              <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="groupName" label="所属楼栋" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="buildingName" label="所属单元" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="serialNumber" label="门牌号" align="center"></el-table-column>
              <el-table-column label="操作" align="center">
                <!-- <template slot-scope="scope">
                  <el-button v-if="scope.row.selected" type="danger" size="mini" @click="cancelRoom(scope.row)">取消</el-button>
                  <el-button v-else type="primary" size="mini" @click="addRoom(scope.row)">选择</el-button>
                </template> -->
                <template slot-scope="scope">
                  <el-button v-if="scope.row.selected" type="primary" plain size="mini" @click="cancelRoom(scope.row)">取消</el-button>
                  <el-button v-else type="primary" size="mini" @click="addRoom(scope.row)">选择</el-button>
                </template>
              </el-table-column>

              <template slot="empty">
                <div class="flex-row align-items-center justify-content-center empty-text">
                  <i class="iconfont icon-tishi"></i>
                  <span style="margin-left:5px">
                    {{
                    $constant.msg.hasNoData
                    }}
                  </span>
                </div>
              </template>
            </el-table>

            <el-pagination style="margin-top:15px;margin-left:15px" @size-change="
                pagination.pageSize = $event;
                gotoTheFirstPage();
              " @current-change="
                pagination.page = $event;
                getTableData();
              " :page-sizes="$constant.pagination.pageSizes" :page-size="pagination.pageSize" layout="prev, pager, next, jumper, total, sizes" :total="pagination.total"></el-pagination>
          </div>
        </div>
      </div>

      <span slot="footer" v-if="multiple">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Mixins,
  Emit,
  Watch,
} from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";

import { getZoom, getHouseTreeData } from "@/api/houseApi.ts";

@Component({
  components: {},
})
export default class DialogChooseRoom extends Vue {
  @Prop({ default: true }) multiple: boolean;
  @Prop({ default: "" }) officeType: string;
  @Prop({ default: [] }) selectedIds: Array<object>;
  height_w = window.innerHeight;
  width_w = window.innerWidth;
  searchField = {
    serialNumber: "",
  };
  tableData: any = [];
  pagination = {
    show: false,
    total: 0,
    page: 1,
    pageSize: this["$constant"].pagination.pageSizes[0],
  };
  TableKey: number = 0;
  currentNodeKey = "所有";
  defaultExpandedKeys = ["所有"];
  treeData: any = [
    {
      name: "所有",
      id: "",
      subBuildings: [],
    },
  ];
  currentNode: any = "";
  selectedRoom: any = [];

  @Watch("dialog.visible")
  @Watch("selectedIds")
  showDialog() {}

  created() {
    this.selectedRoom = JSON.parse(
      JSON.stringify(this.$parent["dialogChooseRoom"].selectedRoom)
    );
    this.getOfficeBuilding();
    this.gotoTheFirstPage();
  }

  mounted() {
    window.addEventListener("resize", this.windowResize);
  }
  destroyed() {
    window.removeEventListener("resize", this.windowResize);
  }
  windowResize() {
    this.height_w = window.innerHeight;
  }

  addRoom(row) {
    if (!this.multiple) {
      this.selectedRoom[0] = row;
      this.$emit("selectRoom", this.selectedRoom);
      this.$parent["dialogChooseRoom"].visible = false;
      return;
    }
    row.selected = true;
    if (
      this.selectedIds &&
      this.selectedIds.findIndex((item) => item.id == row.id) != -1
    ) {
      let index = this.selectedRoom.findIndex((item1) => item1.id == row.id);
      this.selectedRoom.splice(index, 1);
    } else {
      this.selectedRoom.push(row);
    }
    this.TableKey++;
  }
  cancelRoom(row) {
    if (
      this.selectedIds &&
      this.selectedIds.findIndex((item1) => item1.id == row.id) != -1
    ) {
      this.selectedRoom.push(row);
    } else {
      let index = this.selectedRoom.findIndex((item) => item.id == row.id);
      this.selectedRoom.splice(index, 1);
    }
    let index1 = this.tableData.findIndex((item) => item.id == row.id);
    this.tableData[index1].selected = false;
    this.TableKey++;
  }
  confirm() {
    this.$emit("selectRoom", this.selectedRoom);
    this.$parent["dialogChooseRoom"].visible = false;
  }

  gotoTheFirstPage() {
    this.tableData = [];
    this.pagination.page = 1;
    //重新载入翻页组件，回到第一页
    this.pagination.show = false;
    this.$nextTick(() => {
      this.pagination.show = true;
    });
    this.getTableData();
  }
  async getTableData() {
    let param = {
      limit: this.pagination.pageSize,
      page: this.pagination.page,
      groupId: this.currentNode.type == "group" ? this.currentNode.id : "",
      buildingId:
        this.currentNode.type == "building" ? this.currentNode.id : "",
      officeType: this.officeType,
      ...this.searchField,
    };
    let { data } = await getZoom(param);
    data = data.data;
    this.pagination.total = parseInt(data.total);

    data.records.map((item: any, i) => {
      data.records[i].type = 1;
      data.records[i].enableInviteVisitor = 1;
      data.records[i].enableRemoteOpen = 1;
      data.records[i].overTime = "";
      let obj1 = this.selectedIds.findIndex(
        (item1: any) => item1.id == item.id
      );
      if (obj1 != -1) {
        data.records[i].selected = true;
      }

      let obj = this.selectedRoom.find((item1: any) => item1.id == item.id);
      if (obj) {
        data.records[i].selected = true;
      }
    });
    this.tableData = data.records;
  }

  async getOfficeBuilding() {
    let { data } = await getHouseTreeData();
    this.treeData = [
      {
        name: "所有",
        id: "",
        subBuildings: data.data,
      },
    ];
  }

  handleClose() {
    this.$parent["dialogChooseRoom"].visible = false;
  }
}
</script>

<style lang="scss">
.noPadding {
  .el-dialog__body {
    padding: 0;
  }
  .el-table th,
  .el-table td {
    padding: 9px 0;
  }
  .el-button--primary.is-plain:hover,
  .el-button--primary.is-plain:focus {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
}
</style>

<style lang="scss" scoped>
.mainContentWrapper {
  display: flex;
  .leftWrapper {
    width: 222px;
    height: 590px;
  }
  .rightWrapper {
    flex: 1;
    padding: 10px;
    .searchWrapper {
      display: flex;
      margin-bottom: 10px;
      .field {
        margin-right: 20px;
        display: flex;
        align-items: center;
        .label {
          white-space: nowrap;
        }
      }
    }
    .selectedRoom {
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 10px;
      position: relative;
      .el-icon-close {
        position: absolute;
        top: -8px;
        right: -8px;
        color: #f56c6c;
        cursor: pointer;
        font-size: 16px;
      }
    }
  }
}
</style>
