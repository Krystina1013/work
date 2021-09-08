<template>
  <div>
    <el-dialog
      title="选择摄像机"
      :visible="visible"
      :width="`${(800 / width_w) * 100}%`"
      :before-close="handleClose"
    >
      <div>
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          @selection-change="handleSelectionChange"
          style="width: 100%"
          height="500px"
        >
          <!-- <el-table-column type="selection" width="60"></el-table-column> -->
          <el-table-column type="index" width="50" label="序号" align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            prop="createUser"
            label="创建人"
            show-overflow-tooltip
            align="center"
          ></el-table-column> -->
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.selected"
                type="danger"
                size="mini"
                @click="cancelRoom(scope.row)"
                >取消</el-button
              >
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="addRoom(scope.row)"
                >选择</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 15px; margin-left: 15px"
          @size-change="changeSize"
          @current-change="handleCurrentChange"
          :page-sizes="pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="prev, pager, next, total, sizes"
          :total="pagination.total"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmChoose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import config from "@/api/config";
import { getCamera } from "@/api/police";
@Component
export default class extends Vue {
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: [] }) camera: Array<object>;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  pagination: any = {
    show: false,
    total: 0,
    page: 1,
    pageSize: 10,
    pageSizes: [10, 30, 50],
  };
  selectedCamera: any = [];
  tableData: Array<object> = [];
  created() {
    this.getCameraList();
  }
  @Watch("visible")
  choose() {
    if(this.visible){
       this.selectedCamera = this.camera; 
       this.getCameraList();
    }
  }
  getCameraList() {
    let param ={
      page:this.pagination.page,
      pageSize:this.pagination.pageSize
    }
    getCamera(param).then((res) => {
      let data = res.data.data;
      data.records.map((item: any, i) => {
      let obj = this.selectedCamera.find((item1: any) => item1.id == item.id);
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
    this.tableData=[];
    this.$emit("close");
  }
  confirmChoose() {
    this.$emit("submit", [...this.selectedCamera]);
  }
  changeSize(size) {
    this.pagination.page = 1;
    this.pagination.pageSize = size;
    this.getCameraList();
  }
  handleCurrentChange(page) {
    this.pagination.page = page;
    this.getCameraList();
  }
  handleSelectionChange() {}
  cancelRoom(row) {
    let index = this.selectedCamera.findIndex((item: any) => item.id == row.id);
    this.selectedCamera.splice(index, 1);
    let index1 = this.tableData.findIndex((item: any) => item.id == row.id);
    this.tableData[index1]["selected"] = false;
    
  }
  addRoom(row) {
    row.selected = true;
    let obj = { ...row };
    this.selectedCamera.push(obj);
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-pagination__total {
    margin-left: 15px;
  }
}
</style>