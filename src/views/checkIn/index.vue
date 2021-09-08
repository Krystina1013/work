<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <action-header :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :filterStatus="false" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="false" :pageStatus="false">
                <div slot="delBtn" v-if="selectVal.length > 1">
                  <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                    批量删除
                  </el-button>
                </div>
              </action-header>
            </el-col>
          </el-row>
          <el-table :data="list_data" stripe border v-loading="showLoading" highlight-current-row @selection-change="handleSelectionChange" @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange">
            <el-table-column align="center" type="selection" width="50"></el-table-column>
            <el-table-column align="center" class="indexNum" type="index" label="序号" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="考勤组名称">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="upTime" label="上班时间">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="downTime" label="下班时间">
            </el-table-column>
            <el-table-column label="操作" width="180" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="editCheckInfo(scope.row)">编辑</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" size="mini" @click="deleteData(scope.row)">删除</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" size="mini" @click="openDialogPerson(scope.row)">成员管理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-dialog class="newDialog" :title="roleTitle === '0' ? '添加考勤组' : '修改考勤组'" :visible.sync="dialogCreate" width="510px" :before-close="closeDialogName">
      <div>
        <el-form :model="ruleForm" :rules="rule" ref="Forms" label-width="100px" class="demo-ruleForm">
          <el-form-item label="考勤组名称" prop="name" required>
            <el-input v-model="ruleForm.name" placeholder="请输入考勤组名称"></el-input>
          </el-form-item>
          <el-form-item label="考勤时间" required>
            <el-time-picker is-range style="width:370px" format="HH:mm" value-format="HH:mm" v-model="checkTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialogName">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmAdd" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 成员管理 -->
    <el-dialog class="newDialog noPadding" title="成员管理" :visible.sync="dialogPerson" width="1080px" :before-close="closeDialogPerson" :close-on-click-modal="false">
      <div class="person-height">
        <el-tree :data="TreeData" node-key="id" :props="defaultProps" accordion :highlight-current="true" :default-expanded-keys="[1]" :expand-on-click-node="false" @node-click="handleNodeClick" />
        <div class="right_choose">
          <el-transfer ref="transfer" v-model="transferData" filterable :titles="['未添加', '已添加']" :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }" filter-placeholder="请输入姓名" :props="{ key: 'id', label: 'name' }" :data="tableData">
            <span slot-scope="{ option }">
              <span>{{ option.name }}</span> —
              <span>{{ option.phone.length>11?'无电话':option.phone }}</span>
            </span>
          </el-transfer>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialogPerson">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmAddPerson" :loading="personLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 考勤规范 -->
    <el-dialog class="newDialog" title="考勤规范" :visible.sync="dialogPlan" width="75%" :before-close="closeDialogPlan" @open="opendPlan" :close-on-click-modal="false">
      <div class="plan-height">
        <div class="choose-date">
          <el-date-picker v-model="planDate" type="month" placeholder="选择日期" @change='dateChange' value-format="yyyy-MM">
          </el-date-picker>
        </div>
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="flex">
              <span>自定义节假日</span>
              <el-button size="mini" type="primary" @click="openDialogAddPlan">添加</el-button>
            </div>
            <ul class="plan-layout cur">
              <li :class="item.isWork ? 'active' : ''" v-for="(item, i) in planScence" :key="i" :title="item.explain + '-' + item.date" @click="deletePlan(item)">
                {{ item.explain }} {{ item.date }}
              </li>
            </ul>
          </el-col>
          <el-col :span="14">
            <div class="plan-calendar" v-if='groupPlanArr'>
              <Calendar id="calendar" v-model="planDate">
                <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                <template slot="dateCell" slot-scope="{ data }">
                  <!--自定义内容-->
                  <div v-if="groupPlanArr.indexOf(data.day)!=-1" class="calendar-day" :class="isDay(data).is_work?'holiday':''">
                    <div style="text-align: center">
                      <span>{{ data.day.split("-").slice(2).join("-")}}</span>
                      <p class="explain" :title="isDay(data).explain">{{isDay(data).explain}}</p>
                    </div>
                  </div>
                  <div v-else>
                    <div class="calendar-day" style="text-align: center">
                      <span>{{
                        data.day
                          .split("-")
                          .slice(2)
                          .join("-")
                      }}</span>
                    </div>
                  </div>
                </template>
              </Calendar>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="flex">
              <span>国家法定节假日</span>
              <span></span>
            </div>
            <ul class="plan-layout">
              <li :class="item.isWork ? 'active' : ''" v-for="(item, i) in planSystem" :key="i" :title="item.explain + '-' + item.date">
                {{ item.explain }} {{ item.date }}
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialogPlan">取 消</el-button>
        <el-button size="small" type="primary" @click="closeDialogPlan">确 定</el-button>
      </span>
    </el-dialog>
    <DialogAddPlan :dialogAddPlanSync="dialogAddPlanSync" :id="attendanceGroupId" @submit="submitPlan" @close="dialogAddPlanSync = false"></DialogAddPlan>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import config from "@/api/config";
import { formatTimeObj, getMonth } from "@/utils";
import {
  attendanceGroup,
  attendanceGroupDelete,
  attendanceGroupUpdate,
  attendanceGroupinGroup,
  attendanceGroupOutGroup,
  attendanceGroupPlanScence,
  attendanceGroupPlanSystem,
  attendanceGroupPlanTotal,
  attendanceGroupPlanDelete,
} from "@/api/peopleApi.ts";
import { getHouseTreeData } from "@/api/houseApi.ts";
import { jsonp } from "vue";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const DialogAddPlan = () => import("./component/DialogAddPlan.vue");
const Calendar = () => import("./component/calendar/src/main.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    DialogAddPlan,
    Calendar,
  },
})
export default class check extends Vue {
  filterForm: object = { tag: "pagination" }; //根据关键字查询
  private roleTitle: String = "0";
  btnLoading: boolean = false;
  personLoading: boolean = false;
  dialogPlan: boolean = false;
  dialogAddPlanSync: boolean = false; //添加自定义节假日
  initForm: object = {
    url: config.v5 + "/admin/attendance-group",
    method: "get",
  };
  ruleForm: any = {
    name: "",
    upTime: "",
    downTime: "",
  };
  checkTime: any = [new Date(2016, 9, 10, 9, 0), new Date(2016, 9, 10, 18, 0)];
  rule: any = {
    name: [{ required: true, message: "请输入考勤组名称", trigger: "blur" }],
    upTime: [
      {
        type: "date",
        required: true,
        message: "请选择时间",
        trigger: "change",
      },
    ],
    downTime: [
      {
        type: "date",
        required: true,
        message: "请选择时间",
        trigger: "change",
      },
    ],
  };
  deleteForm: object = {
    url: config.v5 + "/admin/attendance-group",
    method: "delete",
    data: [],
    message: "此操作将永久删除考勤组,请谨慎操作!",
  };
  rowLineId: string = "";
  deleteVal: Array<any> = [];
  dialogPerson: boolean = false;
  selectVal: Array<Object> = [];
  TreeData: Array<object> = [];
  defaultProps: object = {
    children: "subBuildings",
    label: "name",
  };
  tableData: Array<any> = []; //没在考勤组
  chooseTableData: Array<any> = []; //在考勤组
  attendanceGroupId: string = ""; //考勤id
  queryOutGroup: any = {
    buildingId: "",
    groupId: "",
    name: "",
    attendanceGroupId: "",
  };
  transferData: Array<any> = []; //选择要添加的用户
  transferInData: Array<any> = []; //已经添加的用户
  planDate: string = ""; //年月
  planScence: Array<object> = []; //自定义节假日
  planSystem: Array<object> = []; //法定节假日
  groupPlanTotal: Array<object> = []; //日历数据
  groupPlanMap: Map<string, object> = new Map(); //日历数据-map
  groupPlanArr: Array<object> = []; //日历数据-arr
  created() {
    this.planDate = getMonth();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.getHouseTreeData();
  }
  isDay(data) {
    let res;
    if (this.groupPlanMap.get(data.day)) res = this.groupPlanMap.get(data.day);
    return res;
  }
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = [
        {
          id: 1,
          name: "所有",
          subBuildings: res["data"]["data"],
          type: "all",
        },
      ];
    });
  }
  //未在考勤组
  getUserGroup() {
    attendanceGroupOutGroup(this.queryOutGroup).then((res) => {
      this.tableData = res.data.data;
    });
  }
  // 在考勤组
  getUserInGroup() {
    attendanceGroupinGroup({ attendanceGroupId: this.attendanceGroupId }).then(
      (res) => {
        res.data.data.map((item) => {
          this.transferData.push(item.id);
          this.transferInData.push(item.id);
        });
      }
    );
  }
  //选择要加入考勤组的用户
  selectionUser(val) {
    this.chooseTableData = val;
  }
  closeDialogName() {
    /** @description 关闭添加/修改dialog */
    this["dialogCreate"] = false;
    this.roleTitle = "0";
    this.ruleForm = {
      name: "",
      upTime: "",
      downTime: "",
    };
    this.checkTime = [
      new Date(2016, 9, 10, 9, 0),
      new Date(2016, 9, 10, 18, 0),
    ];
    this.$refs["Forms"]["resetFields"]();
  }
  confirmAdd() {
    if (typeof this.checkTime[0] == "object") {
      this.checkTime[0] = formatTimeObj(this.checkTime[0], "time");
      this.checkTime[1] = formatTimeObj(this.checkTime[1], "time");
    }
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        this.btnLoading = true;
        let param: any = {
          name: this.ruleForm.name,
          upTime: this.checkTime[0],
          downTime: this.checkTime[1],
        };
        if (this.roleTitle === "0") {
          attendanceGroup(param)
            .then((res) => {
              this.btnLoading = false;
              this["message"]("success", "添加成功");
              this.closeDialogName();
              this["fetchData"](this.initForm);
            })
            .catch((err) => {
              this.btnLoading = false;
            });
        } else {
          param.id = this.rowLineId;
          attendanceGroupUpdate(param)
            .then((res) => {
              this.btnLoading = false;
              this["message"]("success", "修改成功");
              this.closeDialogName();
              this["fetchData"](this.initForm);
            })
            .catch((err) => {
              this.btnLoading = false;
            });
        }
      } else {
        this.btnLoading = false;
      }
    });
  }
  handleSelectionChange(val) {
    this.deleteVal = val;

    this.deleteForm["data"] = [];
    val.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = val;
  }

  deleteData(row) {
    this.$confirm("此操作将永久删除该考勤分组, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        let param: any = [];
        if (this.deleteVal.length) {
          this.deleteVal.map((item: any) => {
            param.push(item.id);
          });
        } else {
          param = [row.id];
        }

        attendanceGroupDelete(param).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this["fetchData"](this.initForm);
        });
      })
      .catch(() => {});
  }
  editCheckInfo(row) {
    this.rowLineId = row.id;
    this.ruleForm.name = row.name;
    this.ruleForm.upTime = row.upTime;
    this.ruleForm.downTime = row.downTime;
    this.checkTime = [row.upTime, row.downTime];
    this["dialogCreate"] = true;
    this.roleTitle = "1";
  }

  openDialogPerson(row) {
    this.attendanceGroupId = row.id;
    this.queryOutGroup.attendanceGroupId = row.id;
    this.dialogPerson = true;
    this.transferData = [];
    this.transferInData = [];
    this.getUserInGroup();
    this.getUserGroup();
  }
  handleNodeClick(data) {
    if (data.type == "group") {
      this.queryOutGroup.groupId = data.id;
      this.queryOutGroup.buildingId = "";
    } else if (data.type == "building") {
      this.queryOutGroup.groupId = "";
      this.queryOutGroup.buildingId = data.id;
    } else {
      this.queryOutGroup.groupId = "";
      this.queryOutGroup.buildingId = "";
    }
    this.getUserGroup();
  }
  closeDialogPerson() {
    this.dialogPerson = false;
    this.transferData = [];
    this.tableData = [];
    this.$refs.transfer.$children["0"]._data.query = "";
    this.$refs.transfer.$children["3"]._data.query = "";
  }
  confirmAddPerson() {
    let remove: any = [];
    this.transferInData.map((item) => {
      if (this.transferData.indexOf(item) == -1) {
        remove.push(item);
      }
    });
    let param = {
      insertScenceUserIds: this.transferData,
      id: this.attendanceGroupId,
      removeScenceUserIds: remove,
    };
    this.personLoading = true;
    attendanceGroupUpdate(param)
      .then((res) => {
        this.personLoading = false;
        this["message"]("success", "修改成功");
        this.closeDialogPerson();
        this["fetchData"](this.initForm);
      })
      .catch((err) => {
        this.personLoading = false;
      });
  }
  opendPlan() {
    this.attendanceGroupPlanScence();
    this.attendanceGroupPlanSystem();
    this.attendanceGroupPlanTotal();
  }
  // 考勤规范
  openDialogPlan(row) {
    this.attendanceGroupId = row.id;
    this.dialogPlan = true;
  }
  attendanceGroupPlanScence() {
    attendanceGroupPlanScence({
      attendanceGroupId: this.attendanceGroupId,
    }).then((res) => {
      this.planScence = res.data.data;
    });
  }
  attendanceGroupPlanSystem() {
    attendanceGroupPlanSystem().then((res) => {
      this.planSystem = res.data.data;
    });
  }
  dateChange() {
    this.attendanceGroupPlanTotal();
  }
  //中间日期数据
  attendanceGroupPlanTotal() {
    let param = {
      data: this.planDate,
      attendanceGroupId: this.attendanceGroupId,
    };
    attendanceGroupPlanTotal(param).then((res) => {
      this.groupPlanTotal = res.data.data;
      this.$nextTick(() => {
        res.data.data.map((item) => {
          this.groupPlanMap.set(item.date, item);
          this.groupPlanArr.push(item.date);
        });
      });
    });
  }
  openDialogAddPlan() {
    this.dialogAddPlanSync = true;
  }
  //添加自定义节假日
  submitPlan() {
    this.attendanceGroupPlanScence();
    this.attendanceGroupPlanTotal();
    this.dialogAddPlanSync = false;
  }
  closeDialogPlan() {
    this.planDate = getMonth();
    this.groupPlanArr = [];
    this.groupPlanMap = new Map();
    this.dialogPlan = false;
  }
  deletePlan(row) {
    this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        attendanceGroupPlanDelete([row.id]).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.groupPlanArr = [];
          this.groupPlanMap = new Map();
          this.attendanceGroupPlanScence();
          this.attendanceGroupPlanTotal();
        });
      })
      .catch(() => {});
  }
}
</script>

<style lang="scss">
.noPadding {
  .el-dialog__body {
    padding: 0;
  }
  .el-tree {
    width: 220px;
    .el-tree-node:focus > .el-tree-node__content,
    .el-tree-node.is-current > .el-tree-node__content {
      background-color: transparent !important;
    }
    .el-tree-node__content {
      height: 32px;
      line-height: 32px;
    }
    .el-tree-node__content:hover {
      background: transparent;
    }
    .is-current {
      background: #e6f1fc;
      .el-tree-node__children {
        background: #fff;
        border-right: 4px solid #fff;
      }
    }
  }
  > .el-tree {
    > .el-tree-node {
      min-width: 100%;
      height: 32px;
      line-height: 32px;
      display: inline-block;
    }
  }
  .el-transfer-panel {
    width: 340px;
    height: 470px;
  }
  .el-transfer-panel__list.is-filterable {
    height: 370px;
  }
  .el-transfer__buttons {
    padding: 0 15px;
  }
}
</style>

<style lang="scss" scoped>
.cur {
  li {
    cursor: pointer;
  }
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 28px;
}
.plan-layout {
  width: 100%;
  height: 460px;
  box-shadow: 0px 0px 8px 0px lightgrey;
  margin-top: 15px;
  overflow-y: scroll;
  li {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .active {
    background: #409eff;
    color: #fff;
  }
}
.plan-height {
  height: 550px;
  .choose-date {
    margin-bottom: 15px;
    text-align: center;
  }
}
.plan-calendar {
  width: 100%;
  height: 500px;
}

.person-height {
  display: flex;
  width: 1080px;
  height: 500px;
  .right_choose {
    width: 860px !important;
    padding: 10px;
  }
}
// ::v-deep {
//   .el-transfer-panel__body {
//     height: 100%;
//     .el-transfer-panel__list.is-filterable {
//       height: inherit;
//     }
//   }
//   .el-tree-node__content {
//     &:hover {
//       background: #fff;
//     }
//   }
//   .is-current > .el-tree-node__content {
//     background-color: #409eff !important;
//     color: #fff;
//   }
//   .el-table td,
//   .el-table th {
//     padding: 6px 0 !important;
//   }
//   .el-button + .el-button {
//     margin: 0;
//   }
//   .el-transfer {
//     width: 100%;
//     .el-transfer__buttons {
//       button {
//         display: block;
//       }
//     }
//   }
//   .el-transfer-panel {
//     width: 38%;
//     height: 500px;
//   }
//   .el-calendar__header {
//     display: none;
//   }
//   .el-calendar__body,
//   .el-calendar-table {
//     height: 500px !important;
//   }
//   .el-calendar-table .el-calendar-day {
//     height: 100%;
//     padding: 0;
//   }
// }
.button-arrow {
  display: flex;
  align-items: center;
  height: 500px;
  .el-button {
    margin-bottom: 20px;
  }
}
.holiday {
  display: inline-block;
  background: #409eff;
  color: #fff;
}
.calendar-day {
  width: 100%;
  height: 100%;
  padding: 8px;
  .explain {
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
