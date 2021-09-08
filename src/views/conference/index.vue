<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <action-header ref="actionHeader" :initFormHeader="initForm" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :moreStatus="false" :btnStatus="0" :total="page.total" @fetchData="fetchData">
                <div slot="btn">
                  <el-button class="createBtn" type="primary" size="small" icon="el-icon-plus" @click="
                dialogVisible = true;
                isUpdate = false;
              ">预定会议室</el-button>
                </div>
                <div slot="houseNum">
                  <div class="word-filter">
                    <span class="filter-name">日期:</span>
                    <el-date-picker v-model="filterForm.meetingDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
                    </el-date-picker>
                  </div>
                </div>
              </action-header>
            </el-col>
          </el-row>
          <el-table :data="tableData" border v-loading="showLoading" :span-method="arraySpanMethod" :header-cell-style="headerCell" ref="table">
            <el-table-column fixed prop="meetingRoom" label="会议室名称" :show-overflow-tooltip="true" align="center" width="180">
            </el-table-column>
            <el-table-column :label="time" v-for="(time, index) in times" :key="index" align="center">
              <el-table-column width="60" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div v-for="(item, i) in scope.row.showInfo" :key="i" class="height">
                    <span class="meet-name" v-if="isShow( time,item,1)" @contextmenu.prevent="rightClick(scope.row, i, $event)">{{ item.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="60" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <div v-for="(item, i) in scope.row.showInfo" :key="i" class="height">
                    <span class="meet-name" v-if="isShow( time,item,2)" @contextmenu.prevent="rightClick(scope.row, i, $event)">{{ item.name }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <!-- <el-pagination style="padding: 5px" background layout="prev, pager, next" :current-page="currentPage" :page-size="pageSize" :total="Total" @current-change="pageChange"></el-pagination> -->
          <div v-show="menuVisible">
            <ul class="menu" :id="`menuSearch`">
              <li @click="handleDelete">取消会议</li>
              <li @click="openUpdate">编辑会议</li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog class="newDialog" :title="isUpdate ? '修改会议室' : '预定会议室'" :visible.sync="dialogVisible" width="520px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="会议室" prop="meetingOfficeId" :rules="{ required: true, message: '请选择会议室' }">
          <el-button size="mini" type="primary" @click="dialogChooseRoom.visible = true">点击选择</el-button>
          <p>
            已选：<span class="selectedRoom blueCircleBtn" v-if="dialogChooseRoom.selectedRoom.length">{{
              dialogChooseRoom.selectedRoom[0].locationName || ""
            }}</span>
          </p>
        </el-form-item>
        <el-form-item label="会议主题" prop="meetingTheme" :rules="{
            required: true,
            message: '请输入会议主题',
            trigger: 'blur',
          }">
          <el-input v-model="ruleForm.meetingTheme" maxlength="20" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="会议日期" prop="date" :rules="{
            required: true,
            message: '请选择会议日期',
            trigger: 'change',
          }">
          <el-date-picker :clearable="false" style="width: 350px" v-model="ruleForm.date" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="changeDate" placeholder="选择会议日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议时间" v-show="ruleForm.meetingOfficeId" :rules="{ required: true, message: '请选择会议时间' }" prop="meetTime">
          <div>
            <el-select v-model="meet.startHH" placeholder="" v-if="startMeetTime.length" style="width: 80px" @change="changeStartHH">
              <el-option v-for="item in startMeetTime" :key="item.value" :label="item.label" :value="item.value" :disabled="checkTime(item.value,'start')">
              </el-option>
            </el-select>
            <el-select v-model="meet.startMM" placeholder="" style="width: 80px" @change="changeStartHH">
              <el-option key="00" label="00" value="00"></el-option>
              <el-option key="30" label="30" value="30" :disabled="meet.startHH==meet.endHH"></el-option>
            </el-select>
            <span>至</span>
            <el-select v-model="meet.endHH" placeholder="" v-if="endMeetTime.length" style="width: 80px" @change="changeStartHH">
              <el-option v-for="item in endMeetTime" :key="item.value" :label="item.label" :value="item.value" :disabled="checkTime(item.value,'end')">
              </el-option>
            </el-select>
            <el-select v-model="meet.endMM" placeholder="" style="width: 80px" @change="changeStartHH">
              <el-option key="00" label="00" value="00" :disabled="meet.startHH==meet.endHH"></el-option>
              <el-option key="30" label="30" value="30" :disabled="meet.endHH == 24"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="参与人" prop="userIds" :rules="{ required: true, message: '请选择参会人' }">
          <el-button size="mini" type="primary" @click="dialogChooseUser.visible = true">点击选择</el-button>
          <span>已选{{ dialogChooseUser.selectedUser.length }}人</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.meetingContent" maxlength="200" style="width: 350px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmAddMeet" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <DialogChoosePerson v-if="dialogChooseUser.visible" @selectUser="handleSelectUser" :multiple="true"></DialogChoosePerson>
    <DialogChooseRoom v-if="dialogChooseRoom.visible" @selectRoom="handleSelectRoom" :selectedIds="[]" :multiple="false" :officeType="2"></DialogChooseRoom>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import config from "@/api/config";
import { format, differenceInMinutes, getMinutes } from "date-fns";
import {
  addMeeting,
  searchMeetingRoomTime,
  allMeetingRoomTime,
  getOneMeeting,
  updateMeeting,
  delateMeeting,
} from "@/api/houseApi";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DialogChoosePerson = () =>
  import("../houseManage/cardManage/components/dialogChoosePerson.vue");
const DialogChooseRoom = () =>
  import("../personManage/ownerManage/components/DialogChooseRoom.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DialogChoosePerson,
    DialogChooseRoom,
  },
})
export default class extends Vue {
  menuVisible: boolean = false;
  // 关联用户
  dialogChooseUser: any = {
    visible: false,
    selectedUser: [],
  };
  //会议室
  dialogChooseRoom: any = {
    visible: false,
    selectedRoom: [],
  };
  config: any = config;
  initForm: object = {
    url: config.v5 + "/admin/meeting/allMeetingRoomTime",
    method: "get",
  };
  filterForm: object = {
    meetingDate: "",
  };
  isUpdate: boolean = false;
  dialogVisible: boolean = false;
  btnLoading: boolean = false;
  ruleForm: any = {
    meetingTheme: "",
    meetingStartTime: "",
    meetingEndTime: "",
    meetingContent: "",
    date: "",
    meetingOfficeId: "",
    meetTime: "",
    userIds: [],
  };
  rules: object = {
    time: { required: true },
  };
  meet: any = {
    startHH: "",
    startMM: "",
    endHH: "",
    endMM: "",
  };
  startMeetTime: Array<object> = [];
  endMeetTime: Array<object> = [];
  tableData: Array<object> = [];
  times: Array<any> = []; //时间间隔
  disbleTimes: Array<any> = []; //禁用的时间
  rowLine: any = []; //右键编辑
  rowIndex: any = "";
  updateId: any = ""; //修改id
  delIndex: number = 0; //需要减去的下标个数
  pickerOptions: Object = {};
  created() {
    const date = new Date();
    this.filterForm["meetingDate"] = format(date, "yyyy-MM-dd");
    this.ruleForm.date = format(date, "yyyy-MM-dd");
    for (let i = 0; i < 25; i++) {
      this.endMeetTime.push({
        value: i,
        label: i,
        disabled: false,
      });
      if (i == 24) break;
      this.startMeetTime.push({
        value: i,
        label: i,
        disabled: false,
      });
    }
  }
  mounted() {
    this.pickerOptions = {
      // 处理可选的时间范围
      disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;
      },
    };
  }
  pageChange(val) {}
  handleClose() {
    this.dialogVisible = false;
    this.$refs["ruleForm"]["resetFields"]();
    this.ruleForm = {
      meetingTheme: "",
      meetingStartTime: "",
      meetingEndTime: "",
      meetingContent: "",
      date: "",
      meetingOfficeId: "",
      meetTime: "",
      userIds: [],
    };
    const date = new Date();
    this.ruleForm.date = format(date, "yyyy-MM-dd");
    this.meet = {
      startHH: "",
      startMM: "",
      endHH: "",
      endMM: "",
    };
    this.dialogChooseUser.selectedUser = [];
    this.dialogChooseRoom.selectedRoom = [];
  }
  confirmAddMeet() {
    this.$refs["ruleForm"]["validate"]((valid) => {
      if (valid) {
        let param = {
          meetingContent: this.ruleForm.meetingContent,
          meetingOfficeId: this.ruleForm.meetingOfficeId,
          meetingTheme: this.ruleForm.meetingTheme,
          userIds: this.ruleForm.userIds,
          meetingStartTime: `${
            this.meet.startHH < 10 ? "0" + this.meet.startHH : this.meet.startHH
          }:${this.meet.startMM}`,
          meetingEndTime: `${
            this.meet.endHH < 10 ? "0" + this.meet.endHH : this.meet.endHH
          }:${this.meet.endMM}`,
          meetingDate: this.ruleForm.date,
        };

        this.btnLoading = true;
        if (this.isUpdate) {
          param["id"] = this.updateId;
          updateMeeting(param)
            .then((res) => {
              this.$message.success("修改成功");
              this.btnLoading = false;
              this.fetchData();
              this.handleClose();
            })
            .catch((err) => {
              this.btnLoading = false;
            });
          return;
        }
        addMeeting(param)
          .then((res) => {
            this.$message.success("预定成功");
            this.btnLoading = false;
            this.fetchData();
            this.handleClose();
          })
          .catch((err) => {
            this.btnLoading = false;
          });
      } else {
        return false;
      }
    });
  }
  //选择的用户
  handleSelectUser(item) {
    this.dialogChooseUser.selectedUser = item;
    item.map((res) => {
      this.ruleForm.userIds.push(res.id);
    });
  }
  handleSelectRoom(item) {
    this.dialogChooseRoom.selectedRoom = item;
    this.ruleForm.meetingOfficeId = item[0].id;
    if (this.ruleForm.date && item[0].id) {
      this.queryMeetRoomTime();
    }
  }
  changeDate(val) {
    if (val && this.ruleForm.meetingOfficeId) {
      this.queryMeetRoomTime();
    }
  }
  queryMeetRoomTime() {
    let param = {
      meetingDate: this.ruleForm.date,
      meetingRoomId: this.ruleForm.meetingOfficeId,
    };
    searchMeetingRoomTime(param).then((res) => {
      this.disbleTimes = res.data.data.time;
    });
  }
  changeStartHH(val) {
    let isEmpty = true;
    for (const i in this.meet) {
      if (this.meet[i] != "") {
        isEmpty = false;
      } else {
        isEmpty = true;
      }
    }
    if (!isEmpty) {
      this.ruleForm.meetTime = "meetTime";
      this.$refs["ruleForm"]["validateField"](["meetTime"]);
    }
  }
  checkTime(time, type) {
    if (type == "start") {
      if (time > this.meet.endHH && this.meet.endHH != "") {
        return true;
      } else if (this.meet.endHH == time && this.meet.endMM == "00") {
        return true;
      }
    } else if (type == "end") {
      if (time == 24 && this.meet.endMM == 30) {
        return true;
      } else if (time < this.meet.startHH && this.meet.startHH != "") {
        return true;
      } else if (this.meet.startHH == time && this.meet.startMM == 30) {
        return true;
      }
    }
    for (let i = 0; i < this.disbleTimes.length; i++) {
      if (
        time >= Number(this.disbleTimes[i].split("-")[0].split(":")[0]) &&
        time <= Number(this.disbleTimes[i].split("-")[1].split(":")[0])
      ) {
        return true;
      }
    }
  }
  fetchData() {
    this.times = [];
    for (let i = 0; i < 24; i++) {
      this.times.push(`${i < 10 ? "0" + i : i}:00-${i + 1}:00`);
    }
    allMeetingRoomTime(this.filterForm)
      .then((res) => {
        this.tableData = res.data.data;
        this.Total = res.data.total;
        this.page["total"] = res.data.data.length;
        this["showLoading"] = false;
        this.tableData.map((item: any, index) => {
          let arr: any = [];
          let delIndex = 0;
          item.time.map((el, i) => {
            //获取两个时间间隔的分钟
            let timeArr = el.split("-");
            let splitTime = differenceInMinutes(
              new Date("2020-01-01 " + timeArr[0]),
              new Date("2020-01-01 " + timeArr[1])
            );
            //获取合并的列数
            let rowCount = Math.abs(splitTime) / 30;
            //获取合并开始的下标
            let aTime = timeArr[0].split(":");
            let startIndex = Number(aTime[0]) + (aTime[1] == "30" ? 0.5 : 0);
            startIndex = startIndex / 0.5 - delIndex;
            delIndex = delIndex + rowCount - 1;
            arr.push({
              time: el,
              index: startIndex,
              name: item.meetingTheme[i],
            });
          });
          item.showInfo = arr;
        });
        document.getElementsByClassName(
          "el-table__body-wrapper"
        )[0].scrollLeft = 950;
      })
      .catch((err) => {
        this["showLoading"] = false;
      });
  }
  arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    if (rowIndex >= 0) {
      let resIndex: any = [];
      let delIndex = 0;
      for (let i = 0; i < row.time.length; i++) {
        let item: any = row.time[i];

        let timeArr = item.split("-");
        //获取两个时间间隔的分钟
        let splitTime = differenceInMinutes(
          new Date("2020-01-01 " + timeArr[0]),
          new Date("2020-01-01 " + timeArr[1])
        );
        //获取合并的列数
        let rowCount = Math.abs(splitTime) / 30;
        //获取合并开始的下标
        let aTime = timeArr[0].split(":");
        let startIndex = Number(aTime[0]) + (aTime[1] == "30" ? 0.5 : 0);
        startIndex = startIndex / 0.5 + 1;
        resIndex.push({ delIndex: startIndex - delIndex, count: rowCount });
        delIndex = delIndex + rowCount - 1;
      }
      for (let i = 0; i < resIndex.length; i++) {
        const element = resIndex[i];
        if (columnIndex == element.delIndex) {
          return [1, element.count];
        }
      }
    }
  }
  headerCell({ row, column, rowIndex, columnIndex }) {
    if (rowIndex === 0) {
      return { padding: "20px 0 !important" };
    }
    if (rowIndex === 1) {
      return { display: "none" };
    }
  }
  isShow(now, showInfo, type) {
    let time2 = now.split("-")[0].split(":");
    let index2 = Number(time2[0]) + (time2[1] == "30" ? 0.5 : 0);
    index2 = index2 / 0.5;

    if (showInfo.index == index2 && type == 1) {
      return true;
    } else if (showInfo.index == index2 + 1 && type == 2) {
      return true;
    }
  }
  rightClick(item: any, index: any, mouseEvent: MouseEvent) {
    this.rowLine = item;
    this.rowIndex = index;
    this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
    this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
    let menu: any = document.querySelector(`#menuSearch`);
    menu.style.left = mouseEvent.clientX + 10 + "px";
    document.addEventListener("click", this.foo); // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
    menu.style.top = mouseEvent.clientY - 10 + "px";
  }
  // 取消鼠标监听事件 菜单栏
  foo() {
    this.menuVisible = false;
    document.removeEventListener("click", this.foo);
  }
  startSelectableRange(val) {
    return ["08:00", "10:00"];
  }
  endSelectableRange() {}
  handleDelete() {
    this.$confirm("此操作将取消该时段会议, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      delateMeeting([this.rowLine.meetingId[this.rowIndex]]).then((res) => {
        this.$message({
          type: "success",
          message: "取消成功!",
        });
        this.fetchData();
      });
    });
  }
  // 打开编辑
  openUpdate() {
    let param = {
      meetingDate: this.rowLine.meetingDate,
      meetingRoomId: this.rowLine.meetingRoomId,
      meetingEndTime: this.rowLine.time[this.rowIndex].split("-")[1],
      meetingStartTime: this.rowLine.time[this.rowIndex].split("-")[0],
    };
    getOneMeeting(param).then((res) => {
      let data = res.data.data;
      this.meet = {
        startHH: Number(data.meetingStartTime.split(":")[0]),
        startMM:
          Number(data.meetingStartTime.split(":")[1]) == 0
            ? "00"
            : Number(data.meetingStartTime.split(":")[1]),
        endHH: Number(data.meetingEndTime.split(":")[0]),
        endMM:
          Number(data.meetingEndTime.split(":")[1]) == 0
            ? "00"
            : Number(data.meetingEndTime.split(":")[1]),
      };
      this.updateId = data.id;
      this.ruleForm.meetTime = "meetTime";
      this.ruleForm.meetingTheme = data.meetingTheme;
      this.ruleForm.meetingContent = data.meetingContent;
      this.ruleForm.meetingOfficeId = data.meetingOfficeId;
      this.ruleForm.date = data.meetingDate;
      this.ruleForm.meetingStartTime = data.meetingStartTime;
      this.ruleForm.meetingEndTime = data.meetingEndTime;
      this.ruleForm.meetingOfficeId = data.meetingOffice.id;
      this.dialogChooseUser.selectedUser = data.users;
      this.dialogChooseRoom.selectedRoom = [data.meetingOffice];
      this.queryMeetRoomTime();
      data.users.map((res) => {
        this.ruleForm.userIds.push(res.id);
      });
      this.dialogVisible = true;
      this.isUpdate = true;
    });
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .components-container {
    .el-table {
      th {
        width: 50px !important;
        padding: 0 !important;
      }
      td {
        padding: 0 !important;
        height: 60px;
      }
    }
    .el-table .cell {
      padding: 0 !important;
    }
  }
}
.rightContent {
  overflow-y: auto;
}
.height {
  .meet-name {
    display: inline-block;
    width: 100%;
    height: inherit;
    text-align: center;
    background: #f0f0f0;
    line-height: 60px;
    padding: 0 10px;
  }
}

.menu {
  position: fixed;
  top: 0;
  right: 0;
  font-size: 30px;
  z-index: 2;
  width: 120px;
  height: 60px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  ul {
    list-style-type: none;
  }

  li {
    width: 100%;
    height: 30px;
    font-size: 14px;
    padding-left: 10px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    list-style-type: none;
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }
}
.blueCircleBtn {
  color: #589ff8;
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid #dcecfd;
  background: #eef5fe;
  outline: none;
}
</style>