<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
          :moreStatus="false"
          :pageStatus="true"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">名&nbsp;&nbsp;&nbsp;称:</span>
              <el-input
                clearable
                placeholder="请输入需要查找的名称"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model="filterForm.name"
                size="small"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">设&nbsp;备&nbsp;号:</span>
              <el-input
                clearable
                placeholder="请输入需要查找设备号"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model="filterForm.deviceId"
                size="small"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">状&nbsp;&nbsp;&nbsp;态:</span>&nbsp;&nbsp;
              <el-select
                v-model="filterForm.status"
                placeholder="请选择"
                class="select-class"
                size="small"
              >
                <el-option key="0" label="全部" value=""></el-option>
                <el-option key="1" label="在线" value="1"></el-option>
                <el-option key="2" label="离线" value="2"></el-option>
              </el-select>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            height="65vh"
            :data="tableData"
            stripe
            border
            highlight-current-row
            v-loading="showLoad"
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column
              v-if="globalUpdateStatus"
              type="selection"
              width="50"
            ></el-table-column>

            <el-table-column
              type="index"
              align="center"
              class="indexNum"
              label="序号"
              width="50"
            >
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
                  <el-dropdown
                    trigger="click"
                    placement="bottom-start"
                    @command="commandClick"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="点击操作"
                      placement="top"
                    >
                      <i v-show="scope.row.showMenu" class="iconfont icon-gengduo"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <div @click="update(scope.row)">
                        <el-dropdown-item command="update">修改</el-dropdown-item>
                      </div>
                      <el-dropdown-item :command="returnCommand('delete', scope.row)">
                        {{ deleteForm.data.length ? "批量删除" : "删除" }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="deviceId"
              label="设备mac地址"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="设备名称"
              align="center"
            ></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1">在线</span>
                <span v-else-if="scope.row.status == 2">离线</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          :page-size="page.limit"
          @current-change="pageChange"
          style="margin-top: 10px"
          background
          layout="prev, pager, next"
          :total="page.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      :title="!isUpdate ? '添加' : '修改'"
      :visible="dialogCreate"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="设备mac地址" prop="deviceId">
            <el-input v-model="ruleForm.deviceId" maxlength="32"></el-input>
          </el-form-item>
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="ruleForm.name" maxlength="32"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmAddCamera" :loading="load"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import mixin from "@/config/minxins";
import { addBox, getBoxList, updateBox } from "@/api/police.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: { ActionHeader },
})
export default class extends Vue {
  config: any = config;
  showLoad: boolean = false;
  filterForm: any = {
    name: "",
    deviceId: "",
    status: "",
  };
  deleteForm: object = {
    url: config.v2 + "/csia/box",
    method: "delete",
    data: [],
    message: "此操作将永久删除选中的视频盒子, 删除后视频盒子将不存在,请谨慎操作!",
  };
  tableData: Array<object> = [];
  isUpdate: boolean = false;
  ruleForm: any = {
    deviceId: "",
    name: "",
  };
  rules: object = {
    deviceId: [{ required: true, message: "请输入设备mac地址", trigger: "blur" }],
    name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
  };
  load: boolean = false;
  rowLineId: string = "";
  pagination: any = {
    total: 0,
    page: 1,
    pageSize: 10,
  };
  created() {
    this["isPolice"] = true;
    this.getBoxList();
  }
  fetchData(option: any) {
    this.pagination.pageSize = option.params.limit;
     this.page["page"]=option.params.page;
    this.filterForm["name"] = option.params.name;
    this.filterForm["deviceId"] = option.params.deviceId;
    this.getBoxList();
  }
  getBoxList() {
    let param = {
      ...this.filterForm,
      page: this.page["page"],
      pageSize: this.pagination.pageSize,
    };
    this.showLoad = true;
    getBoxList(param)
      .then((res) => {
        this.tableData = res.data.data.records;
        this.page["total"] = res.data.data.total;
        this.showLoad = false;
      })
      .catch((err) => {
        this.showLoad = false;
      });
  }
  handleClose() {
    this.$refs["ruleForm"]["resetFields"]();
    this["dialogCreate"] = false;
    this.ruleForm = {
      deviceId: "",
      name: "",
    };
  }
  update(row) {
    this.rowLineId = row.id;
    this.ruleForm.name = row.name;
    this.ruleForm.deviceId = row.deviceId;
    this.isUpdate = true;
    this["dialogCreate"] = true;
  }
  confirmAddCamera() {
    this.$refs["ruleForm"]["validate"]((valid) => {
      if (valid) {
        this.load = true;
        if (!this.isUpdate) {
          addBox(this.ruleForm)
            .then((res) => {
              this.$message.success("添加成功！");
              this.handleClose();
              this.load = false;
              this.getBoxList();
            })
            .catch((err) => {
              this.load = false;
            });
        } else {
          let param = {
            ...this.ruleForm,
            id: this.rowLineId,
          };
          console.log(param);

          updateBox(param)
            .then((res) => {
              this.$message.success("修改成功！");
              this.handleClose();
              this.load = false;
              this.getBoxList();
            })
            .catch((err) => {
              this.load = false;
            });
        }
      } else {
        return false;
      }
    });
  }
}
</script>

<style></style>
