<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <action-header exportUrl="/admin/people-pass/export" exportName="人员通行.xls" ref="actionHeader" :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :btnStatus="0" :moreStatus='false' linkUrl="/statementManage/personPassChart" :total="page.total">
                <div slot="houseNum">
                  <div class="word-filter">
                    <span class="filter-name">用户姓名:</span>
                    <el-input style="width:250px" clearable @keyup.enter.native="emitFetchData" placeholder="请输入需查找的姓名" class="input-filter" v-model="filterForm.name" size="small"></el-input>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">通行位置:</span>&nbsp;&nbsp;
                    <el-autocomplete style="width:250px;height:32px" class="autoInput" clearable @keyup.enter.native="emitFetchData" v-model="filterForm.bindName" @input="changeLoc" :fetch-suggestions="querySearch" placeholder="请输入通行位置查找" @select="handleSelect">
                      <template slot-scope="{ item }">
                        <div class="value">{{ item.locationName }}</div>
                      </template>
                    </el-autocomplete>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">设备区分:</span>&nbsp;
                    <el-select style="width:250px" class="input-filter" size="small" v-model="filterForm.bindingType" placeholder="请选择">
                      <el-option label="全部" value></el-option>
                      <el-option label="单元楼" value="BUILDING"></el-option>
                      <el-option label="进出口" value="ENTER_EXIT"></el-option>
                    </el-select>
                  </div>

                  <!-- <div class="word-filter">
                    <span class="filter-name">通行时间:</span> &nbsp;&nbsp;
                    <el-date-picker style="width:300px;" v-model="timeRange" type="datetimerange" range-separator="-" size="small" @change="timeRangeChange" format="yyyy - MM - dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" :clearable="true" :picker-options="pickerOptions" end-placeholder="结束日期"></el-date-picker>
                  </div> -->
                  <div class="word-filter">
                    <span class="filter-name">开始时间: </span>
                    <el-date-picker v-model="filterForm.startTime" @change="startChange" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :clearable="false" size="mini" class="input-filter" style="width: 252px">
                    </el-date-picker>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">结束时间: </span>
                    <el-date-picker v-model="filterForm.endTime" @change="endChange" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" :clearable="false" size="mini" class="input-filter" style="width: 252px">
                    </el-date-picker>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">通行方式:</span>&nbsp;
                    <el-select multiple style="width:250px" class="input-filter" size="small" v-model="filterForm.passMethod" placeholder="请选择">
                      <el-option label="人脸" value="FACE_OPEN"></el-option>
                      <el-option label="访客" value="VISITOR_OPEN"></el-option>
                      <el-option label="远程" value="REMOTE_OPEN"></el-option>
                      <el-option label="扫码" value="SCAN_OPEN"></el-option>
                      <el-option label="刷卡" value="CARD_OPEN"></el-option>
                      <el-option label="动态密码" value="DYNAMIC_CODE_OPEN"></el-option>
                    </el-select>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">用户类型:</span>&nbsp;
                    <el-select style="width:250px" class="input-filter" size="small" v-model="filterForm.userType" placeholder="请选择">
                      <el-option label="全部" value></el-option>
                      <el-option label="办公成员" value="house"></el-option>
                      <el-option label="访客" value="rent"></el-option>
                    </el-select>
                  </div>
                </div>
              </action-header>
            </el-col>
          </el-row>
          <el-table :data="list_data" stripe v-loading="showLoading" border highlight-current-row @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange">
            <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="姓名">
              <template slot-scope="scope">
                <div v-if='scope.row.userType!="VISITOR"'>
                  <span class="serial-num" v-if='scope.row.scenceUser'>{{ scope.row.scenceUser.name||'' }}</span>
                  <span class="serial-num" v-else>--</span>
                </div>
                <div v-else>
                  <span class="serial-num" v-if='scope.row.visitorInfoList'>{{ scope.row.visitorInfoList[0].name||'' }}</span>
                  <span class="serial-num" v-else>--</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="passMethod" label="通行方式">
              <template slot-scope="{ row }">
                <span>{{ row.passMethod | passMethod }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cardNo" label="卡号">
              <template slot-scope="{ row }">
                <span v-if='row.passMethod=="CARD_OPEN"&&row.doorCard'>{{row.doorCard.cardNo||"--"}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="deviceInfo.inOut" label="出入类型"></el-table-column>

            <el-table-column :show-overflow-tooltip="true" width="120" align="center" prop="devId" label="通行设备">
              <template slot-scope="scope">
                <span class="serial-num">{{ scope.row.deviceInfo.name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="devType" label="通行位置">
              <template slot-scope="scope">
                <span class="serial-num">{{ scope.row.deviceInfo.bindingAddress }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" prop="img" label="抓拍人脸">
              <template slot-scope="scope">
                <img v-if="scope.row.photos" style="margin-top: 3px" class="capture-img" @mouseout="twoImg.visible = false" @mouseover="showImg(scope)" :src="scope.row.photos" alt />
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="passTime" label="通行时间" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          <el-pagination @current-change="pageChange" :page-size="page.limit" style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { getPassAddress } from "@/api/peopleApi.ts";
import { formatTimeObj } from "@/utils";
import mixin from "@/config/minxins";
import config from "@/api/config";
const ActionHeader = () => import("@/components/ActionHeader.vue");
// const ImageMagni = () => import("@/components/BigImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    // ImageMagni,
    TwoImg,
  },
  filters: {
    passMethod(val: string) {
      const data = {
        FACE_OPEN: "人脸开门",
        VISITOR_OPEN: "访客开门",
        SCAN_OPEN: "二维码开门",
        REMOTE_OPEN: "远程开门",
        CARD_OPEN: "刷卡开门",
        DYNAMIC_CODE_OPEN: "动态密码",
      };
      return data[val];
    },
    devType(val: string) {
      const data = {
        "1": "门禁",
        "2": "车禁",
        "3": "注册机",
        "4": "访客机",
      };
      return data[val];
    },
  },
})
export default class PersonPass extends Vue {
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  imgTitle: string = "人脸";
  twoImg: any = {
    visible: false,
    leftTitle: "",
    rightTitle: "",
    leftImg: "",
    rightImg: "",
  };
  filterForm: object = {
    bindName: "",
    buildingId: "",
    bindingType: "",
    name: "",
    startTime: "",
    endTime: "",
    passMethod: [],
    userType: "",
    isVisitor: null,
  };
  timeRange: Array<string> = [];
  pickerOptions: object = {
    disabledDate(time) {
      return time.getTime() > Date.now() - 8.64e7;
    },
  };
  initForm: object = {
    url: config.v2 + "/admin/peoplePass",
    method: "get",
  };
  pickOptionStart: any = [];
  pickOptionEnd: any = [];
  @Watch("filterForm.userType")
  isVistorChange() {
    const type = this.filterForm["userType"];
    this.filterForm["isVisitor"] =
      type === "" ? null : type === "house" ? false : true;
  }
  showImg(scope) {
    this.twoImg.visible = true;
    this.twoImg.leftImg = scope.row.photos;
    this.twoImg.leftTitle = "抓拍人脸";
    this.twoImg.rightImg = scope.row.facePhone;
    this.twoImg.rightTitle = "注册人脸";
  }
  startChange() {
    let time = this.comptime();
    if (time != undefined && time <= 0) {
      this.filterForm["startTime"] = "";
      this.$message.warning("开始时间不能大于等于结束时间");
    }
  }
  endChange() {
    let time = this.comptime();
    if (time != undefined && time <= 0) {
      this.filterForm["endTime"] = "";
      this.$message.warning("结束时间不能小于等于开始时间");
    }
  }
  // 时间比较
  comptime() {
    var beginTime = this.filterForm["startTime"];
    var endTime = this.filterForm["endTime"];
    if (!!beginTime && !!endTime) {
      var beginTimes = beginTime.substring(0, 10).split("-");
      var endTimes = endTime.substring(0, 10).split("-");

      beginTime =
        beginTimes[1] +
        "-" +
        beginTimes[2] +
        "-" +
        beginTimes[0] +
        " " +
        beginTime.substring(10, 19);
      endTime =
        endTimes[1] +
        "-" +
        endTimes[2] +
        "-" +
        endTimes[0] +
        " " +
        endTime.substring(10, 19);

      var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
      return a;
    }
  }

  setTime() {
    const today = new Date().getTime();
    const sevenDay = today - 30 * 24 * 60 * 60 * 1000;
    this.filterForm["startTime"] = formatTimeObj(sevenDay, "detail");
    this.filterForm["endTime"] = formatTimeObj(today, "detail");
    this.timeRange = [
      formatTimeObj(sevenDay, "detail"),
      formatTimeObj(today, "detail"),
    ];
  }

  created() {
    this.setTime();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  // 通行位置搜索建议
  querySearch(string: string, cb) {
    let result = [];
    getPassAddress(string).then((res) => {
      if (res.data.data) {
        result = res.data.data;
        result.splice(10);
        cb(result);
      }
    });
  }
  // 改变通行位置时 清空id
  changeLoc() {
    console.log(this.filterForm);
    this.filterForm["buildingId"] = "";
  }
  // 选择搜索建议列表某项 并赋值
  handleSelect(val: object) {
    this.filterForm["bindName"] = val["locationName"];
    this.filterForm["buildingId"] = val["id"];
  }
}
</script>

<style lang="scss" scoped>
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

.fun-btn {
  position: absolute;
  left: -64px;
  top: 38%;
  .iconfont {
    font-size: 19px;
    color: #8091a5;
    cursor: pointer;
  }
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

.icon-class {
  font-size: 12px;
  color: #e7eaeb;
  cursor: pointer;
  line-height: 48px;
  position: absolute;
  left: -1px;
}

.capture-img {
  width: 30px;
  height: 30px;
}
.floatForm {
  height: 32px;
}
</style>
