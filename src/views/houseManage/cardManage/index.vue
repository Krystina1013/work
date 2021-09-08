<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="rightContent">
          <el-row>
            <el-col :span="24">
              <action-header :dialogCreate.sync="dialogCreate" :dialogCreateDate.sync="dialogCreateDate" :initFormHeader="initForm" @fetchData="fetchData" ref="actionHeader" exportUrl="/admin/hsDoorCard/export" exportName="门禁卡.xlsx" :filterForm="filterForm" :total="page.total">
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="showExportIn">导入</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
                <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                  <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                    批量删除
                  </el-button>
                </div>
                <div slot="houseNum">
                  <div class="word-filter">
                    <span class="filter-name">门禁卡号:</span>
                    <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" placeholder="请输入卡号查找" v-model="filterForm.cardNo" size="small"></el-input>
                  </div>
                  <div class="word-filter">
                    <span class="filter-name">状态:</span> &nbsp;&nbsp;
                    <el-select multiple class="select-class" size="small" v-model="filterForm.status" placeholder="请选择">
                      <el-option label="正常" value="USED"></el-option>
                      <el-option label="过期" value="OVER_TIME"></el-option>
                      <el-option label="禁用" value="DISABLE"></el-option>
                    </el-select>
                  </div>
                </div>
              </action-header>
            </el-col>
          </el-row>
          <el-table :data="list_data" stripe border v-loading="showLoading" highlight-current-row @cell-mouse-enter="enterRowChange" @selection-change="handleSelectionChange" @cell-mouse-leave="leaveRowChange" @sort-change="sortChange">
            <el-table-column v-if="globalUpdateStatus" type="selection" width="50"></el-table-column>
            <el-table-column align="center" class="indexNum" type="index" label="序号" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" class="serial-num" prop="cardNo" label="卡号">
              <template slot-scope="scope">
                <el-button type="text" @click="queryIdetity(scope.row)">{{
                        scope.row.cardNo
                      }}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="userName" label="关联用户"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="phone" label="手机号"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="passCount" sortable='custom' label="刷卡次数"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="lastPassTime" label="最近刷卡时间"></el-table-column>
            <el-table-column align="center" width="220" :show-overflow-tooltip="true" prop="createTime" label="创建时间" sortable='custom'></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="validDate" sortable='custom' label="过期日期">
              <template slot-scope="scope">
                <span class="rowUpdate" @click="showUpdateTime(scope.row)" v-show="!scope.row.validDateStatus">{{ scope.row.validDate }}</span>
                <el-date-picker :clearable="false" v-show="scope.row.validDateStatus" :ref="scope.row.id" v-model="scope.row.validDate" type="date" format="yyyy - MM - dd" value-format="yyyy-MM-dd" @blur="blurDate(scope.row)" :picker-options="options" @change="validDateChange($event, scope.row.id)" placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column align="center" width="120" prop="status" label="状态">
              <template slot-scope="{ row }">
                <el-tag v-if="row.status === '-1'" style="border-radius: 50px;padding: 0 10px; " type="danger">过期</el-tag>
                <el-dropdown v-else @command="cardStatusChange" trigger="click">
                  <span class="el-dropdown-link">
                    <el-tag style="border-radius: 50px;padding: 0 10px; cursor: pointer;" :type="row.status === 'USED' ? 'success' : 'danger'">{{
                              row.status === "USED"
                                ? "正常"
                                : row.status === "DISABLE"
                                ? "禁用"
                                : "过期"
                            }}</el-tag>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="ComponentCommand('USED', row)">正常</el-dropdown-item>
                    <el-dropdown-item :command="ComponentCommand('DISABLE', row)">禁用</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center" v-if="globalUpdateStatus">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="pageChange" :page-size="page.limit" style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
        </div>
      </el-col>
    </el-row>

    <el-dialog class="newDialog" :close-on-click-modal="false" :title="'卡号: ' + detailDialog.cardNo" width="700px" :visible.sync="dialogFormVisible">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="详细信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <p class="detai-info">
                <span class="labelTitle">门禁卡号</span>
                :&nbsp;&nbsp;&nbsp;{{ detailDialog.cardNo }}
              </p>

              <p class="detai-info">
                <span class="labelTitle">关联用户</span>
                :&nbsp;&nbsp;&nbsp;{{ detailDialog.userName }}
              </p>

              <p class="detai-info">
                <span class="labelTitle">状态</span> :&nbsp;&nbsp;&nbsp;
                <el-tag style="border-radius: 50px;padding: 0 10px" :type="detailDialog.status === 'USED' ? 'success' : 'danger'">
                  {{
                    detailDialog.status === "USED"
                      ? "正常"
                      : detailDialog.status === "DISABLE"
                      ? "禁用"
                      : "过期"
                  }}
                </el-tag>
              </p>
            </el-col>
            <el-col :span="12">
              <p class="detai-info">
                <span class="labelTitle">创建时间</span>
                :&nbsp;&nbsp;&nbsp;{{ detailDialog.createTime }}
              </p>

              <p class="detai-info">
                <span class="labelTitle">过期日期</span>
                :&nbsp;&nbsp;&nbsp;{{ detailDialog.validDate }}
              </p>

              <p class="detai-info">
                <span class="labelTitle">最近刷卡时间</span>
                :&nbsp;&nbsp;&nbsp;{{ detailDialog.lastPassTime || "" }}
              </p>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="通行记录" name="通行记录">
          <el-table :data="dtailTable" stripe border style="width: 100%">
            <el-table-column align="center" prop="passTime" label="通行时间"></el-table-column>
            <el-table-column align="center" prop="deviceInfo.bindingAddress" label="通行地址"></el-table-column>
          </el-table>
          <el-pagination background @current-change="getTheCardPassList" layout="prev, pager, next" :total="theCardPassListForm.total"></el-pagination>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="newDialog" :close-on-click-modal="false" title="添加门禁卡" :visible.sync="dialogCreate" width="500px" :before-close="handleClose">
      <el-form :model="Form" :rules="rules" ref="Forms" label-position="right" label-width="130px" style="margin-right:40px;">
        <el-form-item label="卡号:" prop="cardNo">
          <el-input clearable v-model="Form.cardNo" placeholder="输入卡号"></el-input>
        </el-form-item>
        <el-form-item label="过期日期:" prop="validDate">
          <el-date-picker style="width:100%" v-model="Form.validDate" type="date" :picker-options="options" placeholder="选择过期日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="关联用户:" prop="houseName" :rules="{ required: true,message:'请选择需关联用户' }">
          <el-button size="mini" type="primary" @click="dialogChooseUser.visible = true" style="margin-left:10px">添加</el-button>
        </el-form-item>
        <el-form-item label="已选用户:">
          <p v-for="(item, i) in dialogChooseUser.selectedUser" :key="i">
            {{ item.name }}-{{item.phone}}
          </p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="createdCardConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="newDialog" :close-on-click-modal="false" title="门禁卡续期" :visible.sync="dialogCreateDate" width="500px" :before-close="handleCloseDate">
      <el-form ref='date' :rules="dateRules" :model="cardForm">
        <el-form-item label="过期日期" prop="date">
          <el-date-picker :clearable="false" type="date" v-model="cardForm.date" format="yyyy - MM - dd" value-format="yyyy-MM-dd" :picker-options="options" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseDate">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmCardDate">确 定</el-button>
      </span>
    </el-dialog>

    <DialogChoosePerson v-if="dialogChooseUser.visible" @selectUser="handleSelectRoom"></DialogChoosePerson>
    <ExportIn :uploadUrl="
        env === 'production'
          ? uploadUrl
          : uploadUrl
      " :downTemplateUrl="downTemplateUrl" @closeVisible="closeVisible" TmplateName="门禁卡导入模板.xlsx" @successUpload="fetchData(initForm)" :visible.sync="visible" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import config from "@/api/config";
import splitPane from "vue-splitpane";
import {
  changeCardStstus,
  createCard,
  searchSuggestHouse,
  cardvalidDateChange,
  theCardPassList,
  getHouseTreeData,
  updateCardDate,
} from "@/api/houseApi.ts";
import { formatTimeObj } from "@/utils";
import { getPassAddress } from "@/api/peopleApi.ts";
const DataTree = () => import("@/components/DataTree.vue");
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
const DialogChoosePerson = () => import("./components/dialogChoosePerson.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    ExportIn,
    DialogChoosePerson,
    splitPane,
    DataTree,
  },
})
export default class CardManage extends Vue {
  downTemplateUrl: string = config.v5 + "/admin/door-card/model";
  uploadUrl: string = config.v5 + "/admin/door-card/import";
  Form: any = {
    cardNo: "",
    validDate: "",
    houseName: "",
    scenceUserId: "",
  };
  dateRules: any = {
    date: [{ required: true, message: "请选择过期日期", trigger: "blur" }],
  };
  rules: any = {
    cardNo: [{ required: true, message: "请输入卡号", trigger: "blur" }],
    validDate: [{ required: true, message: "请输入过期日期", trigger: "blur" }],
    houseName: [
      { required: true, message: "请选择需关联的用户", trigger: "blur" },
    ],
  };
  // 关联办公室
  dialogChooseUser: any = {
    visible: false,
    selectedUser: [],
  };
  env: string = process.env.NODE_ENV;
  private dialogFormVisible: Boolean = false;
  theCardPassListForm: object = {
    page: 1,
    cardId: "",
    total: 1,
  };
  options: object = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    },
  };
  private detailDialog: Object = {
    //查看目标详情
  };
  filterForm: Object = {
    // houseName: "",
    bindName: "", //筛选选择的楼栋
    cardNo: "",
    status: [],
    // typeCard:'card',//筛选把楼栋和门牌号拼接
    buildingId: "",
  };
  initForm: Object = {
    url: config.v5 + "/admin/door-card/list",
    method: "get",
  };
  deleteForm: Object = {
    url: config.v5 + "/admin/door-card/delete",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的门禁卡, 删除后门禁卡将不存在,请谨慎操作!`,
  };

  selectVal: Array<Object> = [];
  visible: boolean = false; // 导入框状态
  updateArray: Array<string> = ["cardStatus", "validDateStatus"];
  private activeName: String = "详细信息";
  private dtailTable: Array<Object> = [];
  private rowSpan: number = 12;
  TreeData: Array<Object> = []; // 树形结构数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  cardForm: object = {
    date: "",
  };

  ComponentCommand(status: string, row: object) {
    return {
      ...row,
      status,
    };
  }
  mounted() {
    this.Form["validDate"] = new Date().valueOf() + 365 * 24 * 60 * 60 * 1000;
  }
  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
  }
  //选择的办公室
  handleSelectRoom(item) {
    console.log(item);
    this.dialogChooseUser.selectedUser = item;
    this.Form.scenceUserId = item[0].id;
    this.Form.houseName = item[0].name;
  }
  // 切换到修改时间框
  showUpdateTime(row) {
    this["list_data"].forEach((element) => {
      element["validDateStatus"] = false;
    });
    row.validDateStatus = !row.validDateStatus;
    this.$nextTick(() => {
      const timeInput = this.$refs[row.id] as HTMLElement;
      timeInput.focus();
    });
  }
  // 时间修改失去焦点
  blurDate(row) {
    row.validDateStatus = false;
  }
  /// 修改门禁卡过期时间
  validDateChange(date: string, id: string) {
    cardvalidDateChange({ date, id })
      .then((res: any) => {
        if (res.data.code === 200) {
          this["message"]("success", "修改过期日期成功");
          this.fetchData(this.initForm);
        }
      })
      .catch((err) => {
        this.fetchData(this.initForm);
      });
  }
  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  showExportIn() {
    this.visible = true;
  }
  // 修改门禁卡状态
  cardStatusChange(Obj: object) {
    const id = Obj["id"];
    const status = Obj["status"];
    this.$confirm(
      `此操作将改变当前门禁卡为${
        status === "USED" ? "正常" : "禁用"
      }状态, 是否继续?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        changeCardStstus(status, id).then((res) => {
          if (res.data.code === 200) {
            this["message"](
              "success",
              `${status === "USED" ? "恢复" : "禁用"}成功`
            );
            this.fetchData(this.initForm);
          }
        });
      })
      .catch(() => {
        this["message"]("error", `已取消删除`);
      });
  }
  // 选择搜索建议列表某项 并赋值
  handleSelect(val: object) {
    this["filterForm"]["bindName"] = val["locationName"];
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
  // 创建门禁卡
  createdCardConfirm() {
    this.Form.validDate = formatTimeObj(this.Form.validDate);
    console.log(this.Form);

    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        createCard(this.Form).then((res) => {
          if (res.data.code === 200) {
            this["message"]("success", `创建成功`);
            this.fetchData(this.initForm);
            this["handleClose"]();
          }
        });
      } else {
        return false;
      }
    });
  }
  handleClose() {
    this.dialogChooseUser.selectedUser = [];
    for (let key in this.Form) {
      this.Form[key] = "";
    }
    this.Form["house"] = [];
    this.$refs["Forms"]["resetFields"]();
    this["dialogCreate"] = false;
  }
  queryIdetity(row) {
    this.detailDialog = row;
    this.dialogFormVisible = true;
    this.getTheCardPassList(1, row.id);
  }
  // 获取指定门禁卡的同行记录
  getTheCardPassList(page: number, id?: string) {
    this.theCardPassListForm["cardId"] = id
      ? id
      : this.theCardPassListForm["cardId"];
    this.theCardPassListForm["page"] = page;
    theCardPassList(this.theCardPassListForm).then((res: any) => {
      if (res.data.code === 200) {
        this.dtailTable = res.data.data.records;
        this.theCardPassListForm["total"] = res.data.data.total;
      }
    });
  }
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
    });
  }
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 12;
    } else {
      this.rowSpan = 0;
    }
  }
  handleBuildingId(data) {
    /**@description 获取宿舍楼id */
    this.filterForm["buildingId"] = data.id;
  }
  created() {
    this.getHouseTreeData();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  //门禁卡批量续期
  confirmCardDate() {
    let ids = this["createDate"].join("&ids=");
    this.$refs["date"]["validate"]((valid) => {
      if (valid) {
        updateCardDate(ids, this.cardForm["date"]).then((res) => {
          this["message"]("success", `续期成功`);
          this.fetchData(this.initForm);
          this.handleCloseDate();
        });
      }
    });
  }
  handleCloseDate() {
    this.cardForm["date"] = "";
    this["dialogCreateDate"] = false;
  }
  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order == "descending";
    this["fetchData"](this.initForm);
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
.detai-info {
  font-size: 14px;
}
</style>
