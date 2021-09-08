<template>
  <div class="app-container">
    <div class="rightContent">
      <el-row>
        <el-col :span="24">
          <div class="plan-height">
            <div class="choose-date">
              <el-date-picker v-model="planDate" type="month" placeholder="选择日期" @change="dateChange" value-format="yyyy-MM">
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
                <div class="plan-calendar" v-if="groupPlanArr">
                  <Calendar id="calendar" v-model="planDate">
                    <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                    <template slot="dateCell" slot-scope="{ data }">
                      <!--自定义内容-->
                      <div v-if="groupPlanArr.indexOf(data.day) != -1" class="calendar-day" :class="isDay(data).is_work ? 'holiday' : ''">
                        <div style="text-align: center">
                          <span>{{ data.day.split("-").slice(2).join("-") }}</span>
                          <p class="explain" :title="isDay(data).explain">
                            {{ isDay(data).explain }}
                          </p>
                        </div>
                      </div>
                      <div v-else>
                        <div class="calendar-day" style="text-align: center">
                          <span>{{ data.day.split("-").slice(2).join("-") }}</span>
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
        </el-col>
      </el-row>
    </div>
    <DialogAddPlan :dialogAddPlanSync="dialogAddPlanSync" :id="attendanceGroupId" @submit="submitPlan" @close="dialogAddPlanSync = false"></DialogAddPlan>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import config from "@/api/config";
import { formatTimeObj, getMonth } from "@/utils";
const Calendar = () => import("./component/calendar/src/main.vue");
const DialogAddPlan = () => import("./component/DialogAddPlan.vue");
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
@Component({
  mixins: [mixin],
  components: {
    Calendar,
    DialogAddPlan,
  },
})
export default class check extends Vue {
  planDate: string = ""; //年月
  planScence: Array<object> = []; //自定义节假日
  planSystem: Array<object> = []; //法定节假日
  groupPlanTotal: Array<object> = []; //日历数据
  groupPlanMap: Map<string, object> = new Map(); //日历数据-map
  groupPlanArr: Array<object> = []; //日历数据-arr
  attendanceGroupId: any = "";
  dialogAddPlanSync: boolean = false;
  created() {
    this.planDate = getMonth();
    this.attendanceGroupPlanScence();
    this.attendanceGroupPlanSystem();
    this.attendanceGroupPlanTotal();
  }
  isDay(data) {
    // setTimeout(() => {
    let res;
    if (this.groupPlanMap.get(data.day)) res = this.groupPlanMap.get(data.day);
    return res;
    // }, 500);
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
  attendanceGroupPlanScence() {
    attendanceGroupPlanScence().then((res) => {
      this.planScence = res.data.data;
    });
  }
  attendanceGroupPlanSystem() {
    attendanceGroupPlanSystem().then((res) => {
      this.planSystem = res.data.data;
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
}
</script>

<style lang="scss">
.plan-height {
  background: #fff;
  height: 80vh;
  padding: 20px;
  .choose-date {
    margin-bottom: 15px;
    text-align: center;
  }
}
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
.el-calendar__header {
  display: none;
}
.el-calendar__header {
  display: none;
}
.el-calendar__body,
.el-calendar-table {
  height: 66vh !important;
}
.el-calendar-table .el-calendar-day {
  height: 100%;
  padding: 0;
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