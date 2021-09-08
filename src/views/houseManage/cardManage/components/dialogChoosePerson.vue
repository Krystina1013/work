<template>
  <div>
    <el-dialog class="newDialog noPadding" :close-on-click-modal="false" title="选择用户" :visible="true" width="1000px" :before-close="handleClose">
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
                <span class="label">姓名：</span>
                <el-input style="width:200px" size="small" v-model="searchField.name"></el-input>
              </span>
              <span class="field">
                <span class="label">电话：</span>
                <el-input style="width:200px" size="small" v-model="searchField.phone"></el-input>
              </span>
            </span>
            <span class="buttonWrapper">
              <el-button type="primary" size="small" @click="gotoTheFirstPage">查询</el-button>
            </span>
          </div>
          <div class="resultWrapper">
            <el-table ref="table" :data="tableData" stripe border>
              <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="name" label="姓名" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="phone" label="电话" align="center">
                <template slot-scope="scope">
                  <span v-if='scope.row.phone.length>11'>无电话</span>
                  <span v-else>{{scope.row.phone}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.selected" type="danger" size="mini" @click="cancelRoom(scope.row)">取消</el-button>
                  <el-button v-else type="primary" size="mini" @click="addRoom(scope.row)">选择</el-button>
                </template>
              </el-table-column> -->
              <el-table-column label="操作" align="center" width="155">
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

            <el-pagination style="margin-top:10px" @size-change="
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
import { scenceUserPage } from "@/api/peopleApi.ts";

@Component({
  components: {},
})
export default class DialogChooseRoom extends Vue {
  @Prop({ default: false }) multiple: boolean;
  height_w = window.innerHeight;
  width_w = window.innerWidth;
  searchField = {
    name: "",
    phone: "",
  };
  tableData: any = [];
  pagination = {
    show: false,
    total: 0,
    page: 1,
    pageSize: this["$constant"].pagination.pageSizes[0],
  };
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
  selectedUser: any = [];

  @Watch("dialog.visible")
  showDialog() {
    // if (this.dialog.visible) {
    // this.gotoTheFirstPage();
    // this.getOfficeBuilding();
    // }
  }

  created() {
    this.selectedUser = JSON.parse(
      JSON.stringify(this.$parent["dialogChooseUser"].selectedUser)
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

  cancelRoom(row) {
    let index = this.selectedUser.findIndex((item: any) => item.id == row.id);
    this.selectedUser.splice(index, 1);
    let index1 = this.tableData.findIndex((item: any) => item.id == row.id);
    this.tableData[index1]["selected"] = false;
  }

  confirm() {
    console.log(this.selectedUser);
    this.$emit("selectUser", this.selectedUser);
    this.$parent["dialogChooseUser"].visible = false;
  }

  addRoom(row) {
    row.selected = true;
    let obj = { ...row };
    if (this.multiple) {
      this.selectedUser.push(obj);
      return;
    }
    this.selectedUser[0] = obj;
    this.confirm();
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
    console.log(this.currentNode);
    let param = {
      limit: this.pagination.pageSize,
      page: this.pagination.page,
      groupId: this.currentNode.type == "group" ? this.currentNode.id : "",
      buildingId:
        this.currentNode.type == "building" ? this.currentNode.id : "",
      ...this.searchField,
    };
    let { data } = await scenceUserPage(param);
    data = data.data;
    this.pagination.total = parseInt(data.total);

    data.records.map((item: any, i) => {
      data.records[i].type = 1;
      data.records[i].enableInviteVisitor = 1;
      data.records[i].enableRemoteOpen = 1;
      data.records[i].overTime = "";
      let obj = this.selectedUser.find((item1: any) => item1.id == item.id);
      if (obj) {
        data.records[i].selected = true;
      } else {
        data.records[i].selected = false;
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
    this.$parent["dialogChooseUser"].visible = false;
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
    .selectedUser {
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
.blueCircleBtn {
  color: #589ff8;
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid #dcecfd;
  background: #eef5fe;
  outline: none;
}
</style>
