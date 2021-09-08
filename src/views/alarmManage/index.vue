<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <!--
          houseStatus: 住宅管理是否显示
          initFormHeader: 初始化的地址 方式
          fetchData: 筛选后重新init
          filterForm: 关键字查询条件
          dialogCreate:添加弹出框
          btnStatus:2为显示导出按钮 1为显示添加按钮
          moreStatus:是否显示 更多菜单 按钮
          exportUrl:导出路径
          exportName:导出文件名
          total:总条数
        -->
        <ActionHeader
          ref="actionHeader"
          :btnStatus="2"
          :moreStatus="false"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :total="page.total"
          :exportUrl="'/admin/usr-early-report/export/'"
          :exportName="'告警列表'"
        >
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name filter-rewrite">告警类型:</span>
              <el-select
                class="select-class"
                size="small"
                multiple
                v-model="filterForm.reportTypeList"
                placeholder="请选择告警类型"
              >
                <el-option
                  v-for="item in alarmType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">告警状态:</span>
              <el-select
                class="select-class"
                size="small"
                multiple
                v-model="filterForm.reportStatusList"
                placeholder="请选择告警状态"
              >
                <el-option
                  v-for="item in alarmStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>

            <div class="word-filter">
              <span class="filter-name filter-rewrite">上报时间:</span>
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="dateRange"
                type="datetimerange"
                size="small"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy - MM - dd HH:mm:ss"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateRangeChange"
              ></el-date-picker>
            </div>
          </div>
        </ActionHeader>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-table
            height="61vh"
            v-loading="showLoading"
            :data="list_data"
            stripe
            border
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-if="globalUpdateStatus"
              :selectable="isDisabled"
              type="selection"
              width="50"
            ></el-table-column>
            <el-table-column
              type="index"
              align="center"
              label="序号"
              class="indexNum"
              width="50"
            >
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
                <!-- <div v-if="globalUpdateStatus" class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                    <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                      <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                    </el-tooltip>

                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="returnCommand('delete', scope.row)"
                      >{{ deleteForm.data.length ? '批量删除' : '删除' }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>-->
              </template>
            </el-table-column>

            <el-table-column
              prop="reportType"
              align="center"
              width="95px"
              label="告警类型"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row }">
                <span>{{ row.reportType | reportType }}</span>
                <!-- <el-dropdown trigger="click" @command="handleReportType">
                  <span class="el-dropdown-link">
                    <el-tag
                      type="info"
                      size="small"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                      @click="editStatus(row)"
                    >{{ row.reportType | reportType}}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in alarmType"
                      :key="item.value"
                      :command="item.value"
                    >{{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </template>
            </el-table-column>

            <el-table-column
              prop="reportStatus"
              align="center"
              width="90px"
              label="告警状态"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row }">
                <el-dropdown trigger="click" @command="handleReportStatus">
                  <span class="el-dropdown-link">
                    <el-tag
                      :type="row.reportStatus | statusFilterType"
                      size="small"
                      style="border-radius: 50px;padding: 0 10px; cursor: pointer;"
                      @click="editStatus(row)"
                      >{{ row.reportStatus | statusFilter }}</el-tag
                    >
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in alarmStatus"
                      :key="item.value"
                      :command="item.value"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <el-table-column
              prop="reportContent"
              align="center"
              min-width="150px"
              label="告警内容"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="createTime"
              align="center"
              width="160px"
              label="上报时间"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="solver"
              align="center"
              width="90px"
              label="处理人"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="{ row }">
                <p class="boder-style-primary">{{ row.solver }}</p>
              </template>
            </el-table-column>

            <el-table-column
              prop="updateTime"
              align="center"
              width="160px"
              label="处理时间"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              align="center"
              :show-overflow-tooltip="true"
              prop="note"
              label="备注"
            >
              <template slot-scope="scope">
                <span
                  class="rowUpdate"
                  v-show="!scope.row.noteStatus"
                  @click="focusNoteInput(scope.row)"
                  >{{ scope.row.note || "--" }}</span
                >
                <el-input
                  size="mini"
                  :ref="scope.row.id"
                  @blur="noteBlur(scope.row)"
                  v-model="noteString"
                  v-show="scope.row.noteStatus"
                  :clearable="true"
                  placeholder="输入备注"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageChange"
            style="margin-top:10px;"
            background
            layout="prev, pager, next,total"
            :page-size="page.limit"
            :total="page.total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";

import { editStall } from "@/api/alarmApi.ts"; //获取目标访客受访人信息
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader
  },
  filters: {
    reportType(status: string) {
      /** @description 状态显示过滤 */
      const data = {
        "1": "设备",
        "2": "关注人员",
        "3": "布控人员"
      };
      return data[status];
    },

    statusFilterType(status: string) {
      /** @description 状态显示过滤 */
      const data = {
        "1": "danger",
        "2": "success",
        "3": "info",
        "4": "info"
      };
      return data[status];
    },

    statusFilter(status: string) {
      /** @description 状态显示过滤 */
      const data = {
        "1": "待处理",
        "2": "处理中",
        "4": "已处理",
        "3": "忽略"
      };
      return data[status];
    }
  }
})
export default class VistoryManage extends Vue {
  filterForm: object = {
    startTime: null, //上报开始时间
    endTime: null, //上报结束时间
    reportTypeList: [], //告警类型
    reportStatusList: [] //告警状态
  }; //根据关键字查询

  initForm: object = {
    //获取访客名单列表url
    url: "/admin/usr-early-report/",
    method: "get"
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-visitor/batch-delete/",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的告警信息,删除后告警信息将丢失,请谨慎操作!`
  };

  editForm: object = {
    //修改状态
    reportType: "", //告警类型
    reportStatus: "" //告警状态
  };

  updateArray: Array<string> = ["noteStatus"];
  noteString: string = ""; // 修改的备注

  private alarmType: Array<Object> = [
    {
      label: "设备",
      value: "1"
    },
    {
      label: "关注人员",
      value: "2"
    },
    {
      label: "布控人员",
      value: "3"
    }
  ];

  alarmStatus: Array<Object> = [
    //车辆类型筛选
    {
      label: "待处理",
      value: "1"
    },
    {
      label: "处理中",
      value: "2"
    },
    {
      label: "已处理",
      value: "4"
    },
    {
      label: "忽略",
      value: "3"
    }
  ];

  pickerOptions: Object = {};
  dateRange: Array<Object> = [];

  mounted() {
    const _this = this;
    this.pickerOptions = {
      // 处理可选的时间范围
      disabledDate(time) {
        return time.getTime() > Date.now();
      }
    };
  }

  dateRangeChange() {
    if (this.dateRange) {
      this.filterForm["startTime"] = this.dateRange[0];
      this.filterForm["endTime"] = this.dateRange[1];
    } else {
      this.filterForm["startTime"] = null;
      this.filterForm["endTime"] = null;
    }
  }

  handleSelectionChange(val) {
    /**@description  获取需要操作的数据列表 */
    this.deleteForm["data"] = [];
    val.forEach(ele => {
      this.deleteForm["data"].push(ele.id);
    });
  }

  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  refreshInfo() {
    /**@description 刷新数据 */
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    );
    this["fetchData"](this.initForm);
  }

  handleReportType(val) {
    /**@description 单独修改告警类型 事件 */
    const form = { reportType: val, id: this.editForm["id"] };
    editStall(form)
      .then(res => {
        this["message"]("success", `修改告警类型成功!`);

        this.fetchData(this.initForm);
      })
      .catch(() => {
        console.log("修改告警类型失败");
      });
  }

  handleReportStatus(val) {
    /**@description 单独修改告警状态 事件 */
    const form = { reportStatus: val, id: this.editForm["id"] };
    editStall(form)
      .then(res => {
        this["message"]("success", `修改告警状态成功!`);
        this.$store.dispatch("GET_WARNING");
        this.fetchData(this.initForm);
        this["getWarning"]();
      })
      .catch(() => {
        console.log("修改告警状态失败");
      });
  }

  editStatus(val) {
    /**@description 单独修改车位状态 */
    this.editForm = val;
  }

  focusNoteInput(row) {
    /**@description  修改备注自动获取焦点 */
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  noteBlur(row) {
    /**@description 修改车位备注信息 */
    const form = { note: this.noteString, id: row.id };
    if (row["note"] !== form["note"]) {
      editStall(form)
        .then(res => {
          this["message"]("success", `修改告警备注信息成功!`);

          this.fetchData(this.initForm);
        })
        .catch(() => {
          console.log("修改告警备注信息失败");
        });
    }
    this.noteString = "";
    row.noteStatus = false;
  }

  isDisabled(row, index) {
    /**@discription 禁用多选 */
    if (row.auditResult == 3) {
      return 0;
    }
  }

  /**
   * row 列表数据
   */
  // showDetail(row, inviter) {
  //   this.detailDialogVisible = true;
  //   this.visitorDialogForm = Object.assign({}, row);
  //   if (inviter) {
  //     this.activeName = inviter;
  //     this.fetchUser();
  //   }
  // }

  // async handleClick(tab) {
  //   /**@description 查看车辆管理名单目标详情 */
  //   if (tab.name === "second") {
  //     this.fetchUser();
  //   } else if (tab.name === "thirdly") {
  //     this.listQuery["page"] = 1;
  //     this.fetchPass();
  //   }
  // }

  // async fetchUser() {
  //   /**@description 查看受访人员详情 */
  //   const info = {
  //     id: this.visitorDialogForm["scenceUserId"],
  //     houseId: this.visitorDialogForm["houseId"]
  //   };
  //   try {
  //     const { data } = await getOwnerUser(info);
  //     this.interUserDetail = data.data.user;
  //     if (data.data.house) {
  //       this.houseInviterDetail = data.data.house[0];
  //     }
  //     console.log(this.houseInviterDetail, 789456);
  //   } catch (err) {
  //     console.log(err.response);
  //   }

  // try {
  //   const { data } = await getRegisterHouse({
  //     houseId: this.visitorDialogForm["houseId"]
  //   });
  //   console.log(data, 789789);
  //   this.houseInviterDetail = data.data;
  // } catch (err) {
  //   console.log(err);
  // }
  // }

  // async fetchPass() {
  //   /**@description 查看访客通行通行记录 */
  //   this.passTarget = true;
  //   const info = { ...this.listQuery, id: this.visitorDialogForm["id"] };
  //   const { data } = await getTargrtRecord(info);
  //   this.passList = data.data.records;
  //   this.listQuery["total"] = data.data.total;
  //   this.passTarget = false;
  // }

  // handleCurrentChange(val) {
  //   /** @description 处理目标访客通行记录录翻页事件
  //    * @augments val: 页数
  //    */
  //   this.listQuery["page"] = val;
  //   this.fetchPass();
  // }

  // handleClose() {
  //   /** @description 关闭添加/修改diolog */
  //   this.detailDialogVisible = false; //车辆详情dialog
  //   this.activeName = "first";
  //   this.interUserDetail = {};
  //   this.houseInviterDetail = {};
  // }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  .rightContent {
    flex: 1;
    box-shadow: 0px 6px 5px 0px lightgray;
  }
}

.el-dropdown-link {
  color: #20a0ff;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}
</style>
