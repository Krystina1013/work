<template>
  <div>
    <el-dialog class="newDialog" :close-on-click-modal="false" title="选择办公室" :visible="visible" width="800px" :before-close="handleClose">
      <div>
        <div>
          <el-table ref="table" :data="tableData" stripe border>
            <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="groupName" label="所属楼栋" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="buildingName" label="所属单元" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="serialNumber" label="门牌号" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.selected" type="primary" plain size="mini" @click="cancelRoom(scope.row)">取消</el-button>
                <el-button v-else type="primary" size="mini" @click="addRoom(scope.row)">选择</el-button>
              </template>
            </el-table-column>

            <template slot="empty">
              <div class="flex-row align-items-center justify-content-center empty-text">
                <i class="iconfont icon-tishi"></i>
                <span style="margin-left: 5px">
                  {{ $constant.msg.hasNoData }}
                </span>
              </div>
            </template>
          </el-table>
          <el-pagination style="margin-top: 10px" @size-change="
              pagination.pageSize = $event;
              gotoTheFirstPage();
            " @current-change="
              pagination.page = $event;
              getTableData();
            " :page-sizes="$constant.pagination.pageSizes" :page-size="pagination.pageSize" layout="prev, pager, next, jumper, total, sizes" :total="pagination.total"></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
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

import { getZoom } from "@/api/houseApi.ts";

@Component({
  components: {},
})
export default class DialogChooseRoom extends Vue {
  @Prop() private buildId: string;
  @Prop() private visible: boolean;
  tableData: any = [];
  pagination: any = {
    show: false,
    total: 0,
    page: 1,
    pageSize: this["$constant"].pagination.pageSizes[0],
  };
  selectedRoom: any = [];
  @Watch("visible")
  getData() {
    if (this.visible) {
      this.selectedRoom = JSON.parse(
        JSON.stringify(this.$parent["dialogChooseRoom"].selectedRoom)
      );
      this.gotoTheFirstPage();
    }
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
  getTableData() {
    let param = {
      page: this.pagination.page,
      limit: this.pagination.pageSize,
      buildingId: this.buildId,
    };
    getZoom(param).then((res) => {
      let data = res.data.data;
      this.pagination.total = parseInt(data.total);
      data.records.map((item: any, i) => {
        let obj = this.selectedRoom.find((item1: any) => item1.id == item.id);
        if (obj) {
          data.records[i].selected = true;
        } else {
          data.records[i].selected = false;
        }
      });
      this.tableData = data.records;
    });
  }
  handleClose() {
    this.$parent["dialogChooseRoom"].visible = false;
  }
  cancelRoom(row) {
    let index = this.selectedRoom.findIndex((item: any) => item.id == row.id);
    this.selectedRoom.splice(index, 1);
    let index1 = this.tableData.findIndex((item: any) => item.id == row.id);
    this.tableData[index1]["selected"] = false;
  }
  addRoom(row) {
    row.selected = true;
    let obj = { ...row };
    this.selectedRoom.push(obj);
  }
  confirm() {
    this.$emit("selectRoom", this.selectedRoom);
    this.$parent["dialogChooseRoom"].visible = false;
  }
}
</script>

<style lang="scss">
.newDialog {
  .el-button--primary.is-plain:hover,
  .el-button--primary.is-plain:focus {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
}
</style>
