<template>
  <div class="app-container">
    <div class="rightContent">
      <el-row>
        <el-col :span="10">
          <el-button type="primary" size="small" @click="openDialogAddPlan">添加</el-button>
          <div class="table-con">
            <el-table :data="planScence" stripe border v-loading="showLoading" height="544px" highlight-current-row @row-click="rowClick">
              <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="类型" width="110">
                <template slot-scope="scope">
                  <span>
                    {{ scope.row.is_work ? "自定义工作日" : "自定义假日" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="explain" label="名称" width="180">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="date" label="日期">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="handle" width="80" label="操作">
                <template scope="{row}">
                  <el-button type="text" @click="deletePlan(row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="14">
          <div style="margin-left:20px">
            <el-date-picker size="small" v-model="planDate" type="month" placeholder="选择日期" @change="dateChange" value-format="yyyy-MM">
            </el-date-picker>
            <el-button size="small" style="margin-left: 10px" type="primary" @click="currentBack">返回当前月</el-button>
          </div>
          <div class="plan-calendar" v-if="groupPlanArr">
            <Calendar id="calendar" v-model="planDate">
              <template slot="dateCell" slot-scope="{ data }">
                <div v-if="groupPlanArr.indexOf(data.day) != -1" class="calendar-day" :class="[
                      isDay(data).is_work ? 'holiday' : '',
                      `${data.day}`,
                    ]">
                  <div style="text-align: center">
                    <span>{{ data.day.split("-").slice(2).join("-") }}</span>
                    <p class="explain" :title="isDay(data).explain">
                      {{ isDay(data).explain }}
                    </p>
                    <p class="explain" :title="isDay(data).is_work ? '工作日' : '假日'">
                      {{ isDay(data).is_work ? "工作日" : "假日" }}
                    </p>
                  </div>
                </div>
                <div v-else class="calendar-day" :class="`${data.day}`">
                  <div class="calendar-day" style="text-align: center">
                    <span>{{ data.day.split("-").slice(2).join("-") }}</span>
                  </div>
                </div>
              </template>
            </Calendar>
          </div>
        </el-col>
        <!-- <el-col :span="5">
          <div class="flex">
            <span>国家法定节假日</span>
            <span></span>
          </div>
          <ul class="plan-layout">
            <li :class="item.is_work ? 'active' : ''" v-for="(item, i) in planSystem" :key="i" :title="item.explain + '-' + item.date">
              {{ item.explain }} {{ item.date }}
            </li>
          </ul>
        </el-col> -->
      </el-row>
    </div>
    <DialogAddPlan :dialogAddPlanSync="dialogAddPlanSync" :id="attendanceGroupId" @submit="submitPlan" @close="dialogAddPlanSync = false"></DialogAddPlan>
  </div>
</template>

<script>
const Calendar = () => import("./component/calendar/src/main.vue");
const DialogAddPlan = () => import("./component/DialogAddPlan.vue");

import { getMonth } from "@/utils";
import {
  attendanceGroupPlanScence, attendanceGroupPlanSystem, attendanceGroupPlanTotal, attendanceGroupPlanDelete
} from "@/api/peopleApi.ts";

export default {
  components: { Calendar, DialogAddPlan },

  data() {
    return {
      planDate: '',
      showLoading: false,
      planScence: [], //自定义节假日
      planSystem: [], //法定节假日
      attendanceGroupId: '',
      groupPlanArr: [],
      groupPlanMap: new Map(),
      dialogAddPlanSync: false
    }
  },

  created() {
    this.planDate = getMonth();
    this.attendanceGroupPlanScence();
    this.attendanceGroupPlanSystem();
    this.attendanceGroupPlanTotal();
  },
  methods: {
    openDialogAddPlan() {
      this.dialogAddPlanSync = true;
    },
    dateChange() {
      this.attendanceGroupPlanTotal();
    },
    currentBack() {
      this.planDate = getMonth();
      this.attendanceGroupPlanTotal();
    },

    // 行内点击事件
    rowClick(row) {
      if (row.date) {
        this.planDate = row.date.substring(0, 7); //点击的时间
        this.attendanceGroupPlanTotal().then((res) => {
          //请求成功后再执行样式操作
          if (res.data.code !== 200) return;
          let dom = document.getElementsByClassName(row.date); // 当前点击的日期  对应上  右边的日期class
          let allClass = document.getElementsByClassName("calendar-day"); // 所有可能需要加上 高亮属性的class
          for (let v in allClass) {
            if (allClass[v].className) {
              if (allClass[v].className.includes("holidayHight")) {
                // 切换高亮，只存在一个 删除其他的
                allClass[v].classList.remove("holidayHight");
              }
            }
          }
          dom[0].className += " holidayHight"; // 为当前点击的对应日期加上高亮属性
        });
      }
    },

    attendanceGroupPlanScence() {
      attendanceGroupPlanScence().then((res) => {
        this.planScence = res.data.data;
      });
    },
    attendanceGroupPlanSystem() {
      attendanceGroupPlanSystem().then((res) => {
        this.planSystem = res.data.data;
      });
    },
    //中间日期数据
    attendanceGroupPlanTotal() {
      let _that = this;
      var p = new Promise(function (resolve, reject) {
        let param = {
          data: _that.planDate,
          groupId: _that.attendanceGroupId,
        };
        attendanceGroupPlanTotal(param).then((res) => {
          _that.groupPlanTotal = res.data.data;
          _that.$nextTick(() => {
            res.data.data.map((item) => {
              _that.groupPlanMap.set(item.date, item);
              _that.groupPlanArr.push(item.date);
            });
          });
          resolve(res);
        });
      });
      return p;
    },
    isDay(data) {
      let res;
      if (this.groupPlanMap.get(data.day)) res = this.groupPlanMap.get(data.day);
      return res;
    },

    //添加自定义节假日
    submitPlan() {
      this.attendanceGroupPlanScence();
      this.attendanceGroupPlanTotal();
      this.dialogAddPlanSync = false;
    },
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
        .catch(() => { });
    },

  }
}
</script>

<style lang="scss">
.el-calendar__header {
  display: none;
}
.table-con {
  .el-table {
    box-shadow: none;
  }
}
.table-con tr {
  cursor: pointer;
}
.el-calendar-table .el-calendar-day {
  height: 82px;
  padding: 0;
}
</style>

<style lang="scss" scoped>
.app-container {
  padding: 10px;
  background-color: transparent;
  .rightContent {
    margin-left: 0;
    margin-right: 0;
    height: calc(100vh - 111px);
  }
  .table-con {
    margin-top: 30px;
  }

  .plan-calendar {
    margin-top: 18px;
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
  .holiday,
  .holidayHight {
    display: inline-block;
    background: #409eff;
    color: #fff;
    width: 100%;
    height: 100%;
  }
  .holidayHight {
    background: #67c23a;
  }

  .plan-layout {
    width: 100%;
    height: 63vh;
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
}
</style>