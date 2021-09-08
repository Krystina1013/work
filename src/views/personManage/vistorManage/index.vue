<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <ActionHeader ref="actionHeader" :btnStatus="0" :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :total="page.total" :exportUrl="'/admin/usr-visitor/export'" :exportName="'访客列表'" :moreStatus="false" @clearInput="clearInput">
                <el-dropdown-menu slot="dropdown">
                  <router-link to="/statementManage/visitorChart">
                    <el-dropdown-item>进出次数排序</el-dropdown-item>
                  </router-link>
                  <router-link to="/statementManage/visitorChart">
                    <el-dropdown-item>次数统计</el-dropdown-item>
                  </router-link>
                </el-dropdown-menu>
                <div slot="houseNum">
                  <!-- <div class="word-filter">
                    <span class="filter-name filter-rewrite">有效时间:</span>
                    <el-date-picker :picker-options="pickerOptions" v-model="dateRange" type="daterange" size="small" value-format="yyyy-MM-dd" format="yyyy - MM - dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateRangeChange"></el-date-picker>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name filter-rewrite">创建时间:</span>
                    <el-date-picker :picker-options="pickerOptions" v-model="createDateRange" type="daterange" size="small" value-format="yyyy-MM-dd" format="yyyy - MM - dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateRangeChange"></el-date-picker>
                  </div> -->
                  <div class="word-filter">
                    <span class="filter-name">有效开始时间: </span>
                    <el-date-picker v-model="filterForm.validDateStart" @change="startChange" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" :picker-options="pickerOptions" :clearable="false" size="mini" class="input-filter" style="width: 252px">
                    </el-date-picker>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">有效结束时间: </span>
                    <el-date-picker v-model="filterForm.validDateEnd" @change="endChange" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" :picker-options="pickerOptions" :clearable="false" size="mini" style="width: 252px" class="input-filter">
                    </el-date-picker>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">创建开始时间: </span>
                    <el-date-picker v-model="filterForm.inviteTimeStart" @change="startChange1" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" :picker-options="pickerOptions" :clearable="false" size="mini" class="input-filter" style="width: 252px">
                    </el-date-picker>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">创建结束时间: </span>
                    <el-date-picker v-model="filterForm.inviteTimeEnd" @change="endChange1" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期时间" :picker-options="pickerOptions" :clearable="false" size="mini" style="width: 252px" class="input-filter">
                    </el-date-picker>
                  </div>
                </div>
              </ActionHeader>
            </el-col>
          </el-row>
          <el-table v-loading="showLoading" :data="list_data" stripe border highlight-current-row @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange" @selection-change="handleSelectionChange">
            <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" align="center" min-width="80px" label="邀请人姓名" :show-overflow-tooltip="true">
              <template slot-scope="{ row }">
                {{row.userName ? row.userName : "未填写"}}
              </template>
            </el-table-column>
            <el-table-column prop="name" align="center" min-width="80px" label="接受邀请人数" :show-overflow-tooltip="true">
              <template slot-scope="{ row }">
                <el-button type="text" @click="showDetail(row)">{{
                  row.personCnt
                }}</el-button>
              </template>
            </el-table-column>

            <el-table-column prop="houseLocationName" align="center" label="到访地址" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="note" align="center" label="备注" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="validDateStart" align="center" label="开始时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="validDateEnd" align="center" label="结束时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          <el-pagination @current-change="pageChange" style="margin-top:10px;" background layout="prev, pager, next,total" :page-size="page.limit" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 目标详情 -->
    <el-dialog width="800px" :visible.sync="detailDialogVisible" :before-close="handleClose">
      <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="受访人" name="second">
          <el-table :data="invateList" stripe border style="width: 100%">
            <el-table-column align="center" :show-overflow-tooltip="true" prop="name" label="姓名"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="phone" label="电话"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="acceptTime" label="接受时间"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="firstVisitTime" label="第一次访问时间"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { getOwnerUser } from "@/api/carApi.ts"; //获取目标访客受访人信息
import { getTargrtRecord } from "@/api/peopleApi.ts"; //获取目标车辆通行记录
import { getRegisterHouse } from "@/api/houseApi.ts"; //获取受房人信息的办公室信息
import config from "@/api/config";
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
  },
  filters: {
    devTypes(val: string) {
      const data = {
        "1": "门禁",
        "2": "车禁",
        "3": "注册机",
        "4": "访客机",
      };
      return data[val] + "设备";
    },
  },
})
export default class VistoryManage extends Vue {
  filterForm: object = {
    // name: null, //来访者姓名
    // visitName: null, //受访者姓名
    // cardNo: null, //证件号码
    // minNumPeople: null, //最小随行人数
    // maxNumPeople: null, //最大随行人数
    inviteTimeStart: null, //创建开始时间
    inviteTimeEnd: null, //创建结束时间
    validDateEnd: null, //有效期开始时间
    validDateStart: null, //有效期结束时间
    // visitType: null, //访客类型
    // multiStatus: [] //访客状态
  }; //根据关键字查询
  initForm: object = {
    //获取访客名单列表url
    url: config.v3 + "/admin/visitor",
    method: "get",
  };

  deleteForm: Object = {
    //单个或批量删除
    url: "/admin/usr-visitor/batch-delete/",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的访客,删除后访客将不能通行,请谨慎操作!`,
  };

  private listQuery: Object = {
    // 访客目标通行记录翻页
    total: 0,
    limit: 10,
    page: 1,
  };

  private commandType: string = "all"; //根据访客类型筛选 all默认为显示全部
  private commandStatus: String = "0"; //根据访客状态  0 默认显示为全部
  private pitchOn: string = "y"; //选中A
  private unchecked: string = "n"; //未选中
  private interUserDetail: Object = {}; //受访人的身份详细信息
  private houseInviterDetail: Object = {}; //受访人的办公室信息
  private passTarget: Boolean = true; //目标访客通行记录的loadding
  private passList: Array<Object> = []; // 访客目标通行记录

  private detailDialogVisible: boolean = false; // 详细信息dialog弹框
  private visitorDialogForm: Object = {}; // 访客详情
  private activeName: string = "second"; //目标访客详细信息 tab Title
  private selectType: Array<Object> = [
    {
      command: "1",
      lable: "待访问",
    },
    {
      command: "2",
      lable: "已访问",
    },
    {
      command: "3",
      lable: "过期",
    },
  ];
  invateList: Array<object> = [];
  visitType: Array<Object> = [
    //车辆类型筛选
    {
      label: "全部",
      value: null,
    },
    {
      label: "App",
      value: "1",
    },
    {
      label: "访客机",
      value: "2",
    },
  ];

  pickOptionStart: object = {}; //按照时间段查询的开始时间
  pickOptionEnd: object = {}; //按照时间段查询的结束时间

  passMethod(val) {
    /**@description 过滤通行方式 */
    switch (val) {
      case "1":
        return "人脸开门";
      case "2":
        return "二维码开门";
      case "3":
        return "蓝牙开门";
      case "4":
        return "远程开门";
      case "5":
        return "密码开门";
      case "6":
        return "刷卡开门";
      case "7":
        return "WIFI开门";
    }
  }
  pickerOptions: Object = {};
  dateRange: Array<Object> = [];
  createDateRange: Array<Object> = [];
  mounted() {
    const _this = this;
    this.pickerOptions = {
      // 处理可选的时间范围
      disabledDate(time) {
        // return time.getTime() > Date.now();
      },
    };
  }
  // dateRangeChange() {
  //   if (this.dateRange) {
  //     this.filterForm["validDateStart"] = this.dateRange[0];
  //     this.filterForm["validDateEnd"] = this.dateRange[1];
  //   } else {
  //     this.filterForm["validDateStart"] = null;
  //     this.filterForm["validDateEnd"] = null;
  //   }
  //   if (this.createDateRange) {
  //     this.filterForm["inviteTimeStart"] = this.createDateRange[0];
  //     this.filterForm["inviteTimeEnd"] = this.createDateRange[1];
  //   } else {
  //     this.filterForm["inviteTimeStart"] = null;
  //     this.filterForm["inviteTimeEnd"] = null;
  //   }
  //   console.log(this.filterForm);
  // }
  startChange() {
    let time = this.comptime(
      this.filterForm["validDateStart"],
      this.filterForm["validDateEnd"]
    );
    if (time != undefined && time <= 0) {
      this.filterForm["validDateStart"] = "";
      this.$message.warning("开始时间不能大于等于结束时间");
    }
  }
  endChange() {
    let time = this.comptime(
      this.filterForm["validDateStart"],
      this.filterForm["validDateEnd"]
    );
    if (time != undefined && time <= 0) {
      this.filterForm["validDateEnd"] = "";
      this.$message.warning("结束时间不能小于等于开始时间");
    }
  }
  startChange1() {
    let time = this.comptime(
      this.filterForm["inviteTimeStart"],
      this.filterForm["inviteTimeEnd"]
    );
    if (time != undefined && time <= 0) {
      this.filterForm["inviteTimeStart"] = "";
      this.$message.warning("开始时间不能大于等于结束时间");
    }
  }
  endChange1() {
    let time = this.comptime(
      this.filterForm["inviteTimeStart"],
      this.filterForm["inviteTimeEnd"]
    );
    if (time != undefined && time <= 0) {
      this.filterForm["inviteTimeEnd"] = "";
      this.$message.warning("结束时间不能小于等于开始时间");
    }
  }
  // 时间比较
  comptime(time1, time2) {
    var beginTime = time1;
    var validDateEnd = time2;
    if (!!beginTime && !!validDateEnd) {
      var beginTimes = beginTime.substring(0, 10).split("-");
      var endTimes = validDateEnd.substring(0, 10).split("-");

      beginTime =
        beginTimes[1] +
        "-" +
        beginTimes[2] +
        "-" +
        beginTimes[0] +
        " " +
        beginTime.substring(10, 19);
      validDateEnd =
        endTimes[1] +
        "-" +
        endTimes[2] +
        "-" +
        endTimes[0] +
        " " +
        validDateEnd.substring(10, 19);

      var a = (Date.parse(validDateEnd) - Date.parse(beginTime)) / 3600 / 1000;
      return a;
    }
  }

  handleSelectionChange(val) {
    /**@description  获取需要操作的数据列表 */
    this.deleteForm["data"] = [];
    val.forEach((ele) => {
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

  statusFilter(status) {
    /** @description 状态显示过滤 */
    switch (status) {
      case "1":
        return "待访问";
      case "2":
        return "已访问";
      case "3":
        return "过期";
    }
  }

  typeFilter(type) {
    /**@descripution 过滤邀请人类型*/
    switch (type) {
      case "1":
        return "业主";
        break;
      case "2":
        return "租户";
        break;
      case "3":
        return "家庭成员";
        break;
    }
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

  /**
   * row 列表数据
   */
  showDetail(row, inviter) {
    this.detailDialogVisible = true;
    this.visitorDialogForm = Object.assign({}, row);
    this.fetchUser();
    this.activeName = "second";
    // if (inviter) {
    //   this.activeName = inviter;
    //   this.fetchUser();
    // }
  }

  async handleClick(tab) {
    /**@description 查看车辆管理名单目标详情 */
    if (tab.name === "second") {
      this.fetchUser();
    } else if (tab.name === "thirdly") {
      this.listQuery["page"] = 1;
      // this.fetchPass();
    }
  }

  async fetchUser() {
    /**@description 查看受访人员详情 */
    const info = {
      id: this.visitorDialogForm["id"],
    };
    try {
      const { data } = await getOwnerUser(info);
      this.invateList = data.data;
      // if (data.data.house) {
      //   this.houseInviterDetail = data.data.house[0];
      // }
      // console.log(this.houseInviterDetail, 789456);
    } catch (err) {
      console.log(err.response);
    }

    // try {
    //   const { data } = await getRegisterHouse({
    //     houseId: this.visitorDialogForm["houseId"]
    //   });
    //   console.log(data, 789789);
    //   this.houseInviterDetail = data.data;
    // } catch (err) {
    //   console.log(err);
    // }
  }

  async fetchPass() {
    /**@description 查看访客通行通行记录 */
    this.passTarget = true;
    const info = { ...this.listQuery, id: this.visitorDialogForm["id"] };
    const { data } = await getTargrtRecord(info);
    this.passList = data.data.records;
    this.listQuery["total"] = data.data.total;
    this.passTarget = false;
  }

  handleCurrentChange(val) {
    /** @description 处理目标访客通行记录录翻页事件
     * @augments val: 页数
     */
    this.listQuery["page"] = val;
    this.fetchPass();
  }

  handleClose() {
    /** @description 关闭添加/修改diolog */
    this.detailDialogVisible = false; //车辆详情dialog
    this.activeName = "first";
    this.interUserDetail = {};
    this.houseInviterDetail = {};
  }
  clearInput() {
    this.dateRange = [];
    this.createDateRange = [];
    console.log(this.dateRange);
  }
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
.y {
  color: #20a0ff;
  background: #ecf5ff;
}
.n {
  color: black;
  background: #fff;
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
