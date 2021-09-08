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
          @current-change="seleteCamera"
          style="width: 100%"
          height="500px"
        >
          
          <el-table-column type="index" width="50" label="序号" align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createUser"
            label="创建人"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
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
import {getCameraNoPage} from "@/api/police"
@Component
export default class extends Vue {
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: {} }) camera: object;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  pagination: any = {
    show: false,
    total: 0,
    page: 1,
    pageSize: 10,
    pageSizes: [10, 30, 50],
  };
  tableData: Array<object> = [ ];
  chooseLine: object = {}; //选中的摄像机
  @Watch("visible")
  choose() {
      this.$nextTick(()=>{
          this.$refs.singleTable["setCurrentRow"](this.camera);
      })
  }
  created(){
    this.getCameraList();
  }
  getCameraList() {
    getCameraNoPage({}).then((res) => {
      this.tableData = res.data.data;
    });
  }
  handleClose() {
    this.$emit("close");
    this.$refs.singleTable["setCurrentRow"]();
  }
  confirmChoose() {
    this.$emit("submit", this.chooseLine);
  }
  seleteCamera(val) {
    this.chooseLine = val;
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
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-pagination__total {
    margin-left: 15px;
  }
  .current-row {
    td {
      background-color: #409eff !important;
      color: #fff;
    }
  }
}
</style>