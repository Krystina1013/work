<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <action-header :goToWork="true" @showDialogRuleDes="$refs.rule.dialog.visible = true" @changeWorkMonth="fetchInit" :initFormHeader="initForm" @fetchData="fetchInit" ref="actionHeader" :exportUrl="exportUrl" exportName="考勤.xlsx" :filterForm="filterForm" :total="page.total" :btnStatus='0' :check="true" @clearInput="clearInput">
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="export">导出</el-dropdown-item>
                </el-dropdown-menu>
                <div slot="houseNum" @click.stop>
                  <div class="word-filter">
                    <span class="filter-name">姓名:</span>
                    <el-input clearable @keyup.enter.native="emitFetchData" @input="$forceUpdate()" class="input-filter" v-model="filterForm.name" placeholder="输入用户姓名" size="small"></el-input>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">电话:</span>
                    <el-input clearable @keyup.enter.native="emitFetchData" @input="$forceUpdate()" class="input-filter" v-model="filterForm.phone" placeholder="输入用户电话" size="small" :maxlength="11" @keyup.native="UpNumber" @keydown.native="UpNumber"></el-input>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">日期: </span>
                    <el-date-picker v-model="filterForm.date" type="month" placeholder="选择日期" style="width:252px;margin-left:6px" value-format="yyyy-MM" :clearable='false' :editable='false'>
                    </el-date-picker>
                  </div>

                  <div class="word-filter">
                    <span class="filter-name">考勤组:</span>
                    <el-select v-model="filterForm.groupId" placeholder="请选择" style="width:252px;margin-left:6px">
                      <el-option v-for="item in attention" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </action-header>
            </el-col>
          </el-row>
          <el-table :cell-style="cellStyle" :header-cell-style="cellStyle" v-if="showTable" v-loading="showLoading" :data="list_data" stripe border @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange" @selection-change="handleSelectionChange">
            <el-table-column fixed v-if="globalUpdateStatus" type="selection" width="50"></el-table-column>
            <el-table-column fixed type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>

            <el-table-column fixed class="serial-num" prop="name" label="姓名" align="center" width="150px" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column prop="groupName" align="center" label="当前考勤组" width="110px" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column prop="phone" align="center" label="电话" width="110px" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.phone.length>11?'无电话':scope.row.phone}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="迟到/总时长" width="110px" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.lateCount }}次/{{ scope.row.lateMinute }}分钟</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="早退/总时长" width="110px" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.earlyCount }}次/{{ scope.row.earlyMinute }}分钟</span>
              </template>
            </el-table-column>

            <el-table-column prop="count" label="本月到岗(天)" align="center" width="110px"></el-table-column>
            <el-table-column v-for="(item,index) in days" :key="index" prop="timeData" :label="(index+1+'').split('').length<2?'0'+(index+1+''):(index+1+'')" align="center" width="80px" :show-overflow-tooltip="true">
              <el-table-column :label="item" align="center" width="80px" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <!-- <div v-if="!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockIn&&!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockOut">
                    <i class="el-icon-close"></i>
                  </div> -->
                  <div v-if="scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1)">
                    <el-tooltip placement="top">

                      <div slot="content">

                        <div>
                          上班时间：{{scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).upTime}}
                          <br />
                          下班时间：{{scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).downTime}}
                          <br />
                          <br />
                          上班打卡：{{scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockIn || "未打卡"}}
                          <br />
                          下班打卡：{{scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockOut || "未打卡"}}
                        </div>

                      </div>

                      <!-- <div v-if="!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockIn&&!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockOut">
                          <i class="el-icon-close"></i>
                        </div>
                        <div v-else-if="scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isLeaveEarly!==null&&scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isWorkLate!==null">
                           <i
                            style="color:#039A9A"
                              v-if="!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isLeaveEarly && !scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isWorkLate"
                              class="el-icon-check"
                            ></i>
                            <div v-else style="color:#FF0000">
                            <div>{{scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isWorkLate?"迟到":""}}</div>
                            <div>{{scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isLeaveEarly?"早退":""}}</div>
                          </div>
                        </div>
                        <div v-else style="color:#FF0000">
                          <div v-if="scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isLeaveEarly===null||scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isWorkLate===null">
                              <div v-if="!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockIn&&!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockOut">
                                <i class="el-icon-close"></i>
                              </div>
                          </div>
                          <div>{{scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isWorkLate?"迟到":""}}</div>
                          <div>{{scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isLeaveEarly?"早退":""}}</div>
                        </div> -->
                      <div class="flex">
                        <div class="check-style">
                          <span>上：</span>
                          <span class="icon" v-if="scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isWorkLate!==null&&!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isWorkLate"><i style="color:#039A9A" class="el-icon-check"></i></span>
                          <span class="icon" v-else-if="!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockIn"><i class="el-icon-close"></i></span>
                          <span style="color:#f56c6c;" v-else-if="scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isWorkLate">迟到</span>
                        </div>
                        <div class="line"></div>
                        <div class="check-style">
                          <span>下：</span>
                          <span class="icon" v-if="scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isLeaveEarly!==null&&!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isLeaveEarly"><i style="color:#039A9A" class="el-icon-check"></i></span>
                          <span class="icon" v-else-if="!scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).clockOut"><i class="el-icon-close"></i></span>
                          <span style="color:#f56c6c;" v-else-if="scope.row.timeData.find(item => item.writeDate.substring(8,10) == index+1).isLeaveEarly">早退</span>
                        </div>
                      </div>
                    </el-tooltip>
                  </div>
                  <div v-else-if="index+1 <= date&&filterForm.date.substring(5,8)<=month&&year>=filterForm.date.substring(0,4)" class="nocheck">
                  </div>
                  <div v-else-if="filterForm.date.substring(5,8)<month&&year>=filterForm.date.substring(0,4)" class="nocheck">
                  </div>
                  <span v-else></span>
                  <span></span>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="pageChange" :page-size="page.limit" style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { getMonth } from "@/utils";
import { getAttendanceGroup } from "@/api/peopleApi";
import config from "@/api/config";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const Rule = () => import("./components/Rule.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    Rule,
  },
})
export default class CardManage extends Vue {
  filterForm: object = { name: "", phone: "", date: "", groupId: "" }; //根据关键字查询
  initForm: object = {
    url: config.v5 + "/admin/attendance-record",
    method: "get",
    params: {
      date: this["$util"].getOffsetDate(0).substring(0, 7),
    },
  };
  exportUrl: string = config.v5 + "/admin/attendance-record/export";
  days: any = [];
  timeDataIndex = 0;
  date = new Date().getDate();
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  showTable = true;
  planDate: string = "";
  searchMonth: any = "";
  attention: Array<object> = [];
  mounted() {}

  created() {
    this.getAttention();
    this.filterForm["date"] = getMonth();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let d = new Date(year, month, 0);
    let days = new Array(d.getDate());
    this.days = [];
    for (let i = 0; i < days.length; i++) {
      let eachDate = new Date(year, month - 1, i + 1);
      this.days.push("日一二三四五六".charAt(eachDate.getDay()));
    }
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  clearInput() {
    this.filterForm["name"] = "";
    this.filterForm["phone"] = "";
    this.filterForm["groupId"] = "";
  }
  getAttention() {
    getAttendanceGroup().then((res) => {
      this.attention = res.data.data;
    });
  }
  handleSelectionChange(val) {
    const param = this.initForm["params"];
    param.scenceUserIds = JSON.stringify(val.map((item) => item.scenceUserId));
  }

  cellStyle({ row, column, rowIndex, columnIndex }) {
    if (column.label == "六" || column.label == "日") {
      // return { background: "#F1E9CB" };
    }
  }

  async fetchInit(option: object) {
    this.showTable = false;
    this.$nextTick(() => {
      this.showTable = true;
    });
    const param = this.initForm["params"];
    param.page = 1;
    // param.date = this.$refs.actionHeader["workMonth"];
    let date = new Date(param.date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let d = new Date(year, month, 0);
    let days = new Array(d.getDate());
    this.searchMonth = month;
    this.days = [];
    for (let i = 0; i < days.length; i++) {
      let eachDate = new Date(year, month - 1, i + 1);
      this.days.push("日一二三四五六".charAt(eachDate.getDay()));
    }
    this.fetchData(this.initForm);
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table__fixed {
    height: 64vh !important;
  }
  .el-table td,
  .el-table .cell {
    padding: 0 !important;
  }
}
.el-icon-close {
  color: #f56c6c;
  font-size: 20px;
}
.main {
  display: flex;
  .rightContent {
    flex: 1;
  }
}

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -5px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -8px;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}
.labelTitle {
  width: 85px;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  text-align: right;
}
.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .value {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .id {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.detai-info {
  font-size: 14px;
}
.nocheck {
  width: 100%;
  height: 60px;
  background: rgb(207, 207, 207);
}
.line {
  width: 100%;
  height: 1px;
  background: rgb(153, 153, 153);
}
.flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0;
}
.check-style {
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    display: inline-block;
    width: 28px;
    display: flex;
    align-items: center;
  }
}
</style>
