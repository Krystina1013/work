<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <action-header :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total" :pageStatus="true" btnStatus="0" :moreStatus="false">
                <el-dropdown-menu slot="dropdown">
                </el-dropdown-menu>
                <div slot="houseNum">
                  <div class="word-filter">
                    <span class="filter-name">类型：</span>
                    <el-select v-model="filterForm.type" placeholder="请选择" size="small">
                      <el-option label="设备下线" value="DEVICE_DOWN"> </el-option>
                      <el-option label="关注人员" value="ALERT_MAN"> </el-option>
                    </el-select>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">状态：</span>
                    <el-select v-model="filterForm.status" placeholder="请选择" size="small">
                      <el-option label="待处理" value="WAITING"> </el-option>
                      <el-option label="处理中" value="PROCESSING"> </el-option>
                      <el-option label="处理完成" value="PROCESSED"> </el-option>
                      <el-option label="忽略" value="IGNORE"> </el-option>
                      <el-option label="已读" value="READ"> </el-option>
                    </el-select>
                  </div>
                </div>
              </action-header>
            </el-col>
          </el-row>
          <el-table :data="list_data" stripe border highlight-current-row v-loading="showLoading" @selection-change="handleSelectionChange" @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange">
            <el-table-column v-if="globalUpdateStatus" type="selection" width="50"></el-table-column>
            <el-table-column type="index" align="center" class="indexNum" label="序号" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="deviceId" label="类型" align="center">
              <template slot-scope="{ row }">
                <span>{{row.warnType|typeFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="{ row }">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag :type="row.status | statusFilterType" size="small" style="border-radius: 50px; padding: 0 10px; cursor: pointer">{{ row.status | statusFilter }}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <div>
                      <el-dropdown-item v-for="item in alarmStatus" :key="item.value" :command="item.value">
                        <p @click="handleReportStatus(item,row)">{{ item.label }}</p>
                      </el-dropdown-item>
                    </div>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column prop="warnContent" label="内容" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="warnTime" label="上报时间" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.warnTime|timeFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="processUserName" label="处理人" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column prop="processTime" label="处理时间" :show-overflow-tooltip="true" align="center"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="remark" label="备注">
              <template slot-scope="scope">
                <span class="rowUpdate" v-show="!scope.row.noteStatus" @click="focusNoteInput(scope.row)">{{ scope.row.remark || "--" }}</span>
                <el-input :ref="scope.row.id" size="mini" @blur="confirmUpdateNote(scope.row)" v-model="noteString" v-show="scope.row.noteStatus" :clearable="true" placeholder="输入备注"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :page-size="page.limit" @current-change="pageChange" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import mixin from "@/config/minxins";
import { deviceWarning, updateDeviceWarning } from "@/api/police";
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: { ActionHeader },
  filters: {
    typeFilter(status: string) {
      /** @description 类型显示过滤 */
      const data = {
        DEVICE_DOWN: "设备下线",
        CARE_MAN: "关注人员",
        ALERT_MAN: "关注人员",
      };
      return data[status];
    },
    timeFilter(status: string) {
      /** @description 类型显示过滤 */
      if (status.length > 19) {
        status = status.substring(0, 19);
      }
      return status;
    },

    statusFilterType(status: string) {
      /** @description 状态显示过滤 */
      const data = {
        WAITING: "danger",
        PROCESSED: "success",
        READ: "success",
        PROCESSING: "",
        IGNORE: "info",
      };
      return data[status];
    },

    statusFilter(status: string) {
      /** @description 状态显示过滤 */
      const data = {
        WAITING: "待处理",
        PROCESSING: "处理中",
        PROCESSED: "处理完成",
        IGNORE: "忽略",
        READ: "已读",
      };
      return data[status];
    },
  },
})
export default class extends Vue {
  config: any = config;
  initForm: object = {
    url: config.v2 + "/admin/dev-device-warning/page",
    method: "get",
  };
  filterForm: any = {
    type: "",
    status: "",
  };
  noteString: string = "";
  alarmStatus: Array<Object> = [
    //类型筛选
    {
      label: "待处理",
      value: "WAITING",
    },
    {
      label: "处理中",
      value: "PROCESSING",
    },
    {
      label: "处理完成",
      value: "PROCESSED",
    },
    {
      label: "忽略",
      value: "IGNORE",
    },
    {
      label: "已读",
      value: "READ",
    },
  ];
  pageSize: number = 10;
  tableData: Array<object> = [];
  tableLoading: boolean = false;
  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  handleReportStatus(val, row) {
    updateDeviceWarning({ status: val.value, id: row.id }).then((res) => {
      this.fetchData(this.initForm);
    });
  }

  focusNoteInput(row) {
    /**@description  修改备注自动获取焦点 */
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    console.log(row);
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  confirmUpdateNote(row) {
    /**@description 修改备注信息 */
    const form = { remark: this.noteString, id: row.id };
    if (row["remark"] !== form["remark"]) {
      updateDeviceWarning(form).then((res) => {
        this.$message.success("修改成功！");
        this.fetchData(this.initForm);
      });
    }
    this.noteString = "";
    row.noteStatus = false;
  }
}
</script>

<style></style>
