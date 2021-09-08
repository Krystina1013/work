<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
        :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :dialogCreate.sync="dialogCreate"
          :total="page.total"
          :moreStatus="false"
          :pageStatus="true"
        >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="export">导出</el-dropdown-item>
          </el-dropdown-menu>
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
              <el-input
                clearable
                placeholder="请输入需要查找的姓名"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model="filterForm.name"
                size="small"
              ></el-input>
            </div>
            <div class="word-filter">
              <span class="filter-name">电&nbsp;&nbsp;&nbsp;话:</span>
              <el-input
                clearable
                placeholder="请输入需要查找的电话"
                @keyup.enter.native="emitFetchData"
                class="input-filter"
                v-model="filterForm.phone"
                size="small"
              ></el-input>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            height="65vh"
            :data="tableData"
            stripe
            border
            highlight-current-row
            @selection-change="handleSelectionChange"
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
            v-loading="tableLoading"
          >
            <el-table-column
              v-if="globalUpdateStatus"
              type="selection"
              width="50"
            ></el-table-column>

            <el-table-column
              type="index"
              align="center"
              class="indexNum"
              label="序号"
              width="50"
            >
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
                <div v-if="globalUpdateStatus" class="fun-btn">
                  <el-dropdown trigger="click" placement="bottom-start">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="点击操作"
                      placement="top"
                    >
                      <i v-show="scope.row.showMenu" class="iconfont icon-gengduo"></i>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                      <div @click="openUpdate(scope.row)">
                        <el-dropdown-item command="update">修改</el-dropdown-item>
                      </div>
                      <div @click="handleDelete(scope.row)">
                        <el-dropdown-item command="delete">
                          {{ selectList.length > 1 ? "批量删除" : "删除" }}
                        </el-dropdown-item>
                      </div>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="name"
              :show-overflow-tooltip="true"
              label="姓名"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="img" align="center" label="注册人脸">
              <template slot-scope="scope">
                <img
                  class="capture-img cur-img"
                  :src="scope.row.face"
                  alt
                  @click="openDialogFace(scope.row)"
                />
              </template>
            </el-table-column>
            <!-- <el-table-column prop="age" align="center" label="年龄"></el-table-column> -->
            <el-table-column
              prop="houseName"
              align="center"
              label="房间"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="phone" align="center" label="电话">
              <template slot-scope="scope">
                <span>{{
                  scope.row.phone.length > 11 ? "无电话" : scope.row.phone
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="phone"
              align="center"
              label="紧急联系人1"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  >{{ scope.row.emergencyContactName1 }}-{{
                    scope.row.emergencyContactPhone1
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="phone"
              align="center"
              label="紧急联系人2"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  >{{ scope.row.emergencyContactName2 }}-{{
                    scope.row.emergencyContactPhone2
                  }}</span
                >
              </template></el-table-column
            >

            <el-table-column
              :show-overflow-tooltip="true"
              prop="note"
              label="备注"
              align="center"
            >
              <!-- <template slot-scope="scope"> -->
              <template slot-scope="scope">
                <span
                  class="rowUpdate"
                  v-show="!scope.row.noteStatus"
                  @click="focusNoteInput(scope.row)"
                  >{{ scope.row.note || "--" }}</span
                >
                <!-- @keyup.enter.native="confirmUpdateNote(scope.row)" -->
                <el-input
                  :ref="scope.row.id"
                  size="mini"
                  @blur="confirmUpdateNote(scope.row)"
                  v-model="noteString"
                  v-show="scope.row.noteStatus"
                  :clearable="true"
                  placeholder="输入备注"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmDay"
              align="center"
              label="预警周期(天)"
            ></el-table-column>
          </el-table>
        </div>
        <el-pagination
          :page-size="page.limit"
          @current-change="pageChange"
          style="margin-top: 10px"
          background
          layout="prev, pager, next"
          :total="page.total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialog.curType ? '添加关注人员' : '修改关注人员'"
      :visible="dialogCreate"
      :before-close="handleClose"
      width="800px"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <div class="flex">
          <el-form-item label="用户" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请选择用户"
              style="width: 200px"
              readonly
              @focus="dialogChooseUser.visible = true"
            ></el-input>
          </el-form-item>
          <el-form-item label="关联房屋" prop="houseName">
            <el-input
              v-model="ruleForm.houseName"
              placeholder="请选择房屋"
              style="width: 200px"
              readonly
              @focus="dialogChooseRoom.visible = true"
            ></el-input>
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item label="预警周期" prop="alarmDay">
            <el-input-number
              v-model="ruleForm.alarmDay"
              :min="1"
              label="预警周期"
              style="width: 200px"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="ruleForm.note"
              placeholder="请输入备注"
              style="width: 200px"
              type="textarea"
              maxlength="200"
            ></el-input>
          </el-form-item>
        </div>

        <div>
          <p class="form-title">紧急联系人1：</p>
          <div class="flex">
            <el-form-item label="姓名" prop="emergencyContactName1">
              <el-input
                v-model="ruleForm.emergencyContactName1"
                placeholder="请输入姓名"
                style="width: 200px"
                maxlength="32"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="emergencyContactPhone1">
              <el-input
                v-model="ruleForm.emergencyContactPhone1"
                placeholder="请输入电话"
                style="width: 200px"
                maxlength="11"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div>
          <p class="form-title">紧急联系人2：</p>
          <div class="flex">
            <el-form-item label="姓名">
              <el-input
                v-model="ruleForm.emergencyContactName2"
                placeholder="请输入姓名"
                style="width: 200px"
                maxlength="32"
              ></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input
                v-model="ruleForm.emergencyContactPhone2"
                placeholder="请输入电话"
                style="width: 200px"
                maxlength="11"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmAddOrUpdate" :loading="load"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <DialogChooseRoom
      v-if="dialogChooseRoom.visible"
      @selectRoom="handleSelectRoom"
    ></DialogChooseRoom>
    <DialogChoosePerson
      v-if="dialogChooseUser.visible"
      @selectUser="handleSelectUser"
    ></DialogChoosePerson>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import mixin from "@/config/minxins";
import { getBase64 } from "@/utils/index.js";
import { getCareUser, addCareUser, deleteCareUser, updateCareUser } from "@/api/police";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DialogChoosePerson = () => import("./components/DialogChoosePerson.vue");
const DialogChooseRoom = () =>
  import("../../personManage/ownerManage/components/DialogChooseRoom.vue");
@Component({
  mixins: [mixin],
  components: { ActionHeader, DialogChooseRoom, DialogChoosePerson },
})
export default class extends Vue {
  config: any = config;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  deleteForm: object = {
    url: config.v4 + "/admin/scence-admin/delete",
    method: "delete",
    data: [],
    message: "此操作将永久删除选中的关注人员, 删除后关注人员将不存在,请谨慎操作!",
  };
  load: boolean = false;
  filterForm: object = {
    name: "",
    phone: "",
  }; // 筛选条件
  noteString: string = "";
  dialog: any = {
    curType: true,
  };
  ruleForm: any = {
    emergencyContactName1: "",
    emergencyContactPhone1: "",
    emergencyContactName2: "",
    emergencyContactPhone2: "",
    alarmDay: "",
    note: "",
    sceneUserId: "",
    name: "",
    houseName: "",
    houseId: "",
  };
  dialogChooseRoom: any = {
    visible: false,
    selectedRoom: [],
  };
  dialogChooseUser: any = {
    visible: false,
    selectedUser: [],
  };
  rules: object = {
    name: [{ required: true, message: "请选择用户", trigger: "change" }],
    houseName: [{ required: true, message: "请选择房屋", trigger: "change" }],
    alarmDay: [{ required: true, message: "请输入预警周期", trigger: "change" }],
    emergencyContactName1: [
      { required: true, message: "请输入紧急联系人姓名", trigger: "blur" },
    ],
    emergencyContactPhone1: [
      { required: true, message: "请输入紧急联系人电话", trigger: "blur" },
    ],
  };
  selectList: Array<object> = [];
  tableData: Array<object> = [];
  tableLoading: boolean = false;
  currentId: string = "";
  initForm:object={};
  pageSize:number=10;
  created() {
    this["isPolice"] = true;
    this.getTableData();
  }
  fetchData(option){
    
    this.pageSize = option.params.limit;
    this.page["page"]=option.params.page;
    this.getTableData();
  }
  getTableData() {
    let param = {
      page: this.page["page"],
      pageSize: this.pageSize,
      ...this.filterForm
    };
    console.log()
    this.tableLoading = true;
    getCareUser(param)
      .then((res) => {
        this.tableData = res.data.data.records;
        this.page["total"] = res.data.data.total;
        this.tableLoading = false;
      })
      .catch((err) => {
        this.tableLoading = false;
      });
  }
  openDialogFace(item) {}
  handleClose() {
    this["dialogCreate"] = false;
    this.$refs["ruleForm"]["resetFields"]();
    this.ruleForm = {
      emergencyContactName1: "",
      emergencyContactPhone1: "",
      emergencyContactName2: "",
      emergencyContactPhone2: "",
      alarmDay: "",
      note: "",
      sceneUserId: "",
      name: "",
      houseName: "",
      houseId: "",
    };
    this.dialogChooseRoom.selectedRoom = [];
    this.dialogChooseUser.selectedUser = [];
    this.load = false;
    this.dialog.curType = true;
  }
  confirmAddOrUpdate() {
    this.$refs["ruleForm"]["validate"]((valid) => {
      if (valid) {
        this.load = true;
        let param: any = {
          emergencyContactName1: this.ruleForm.emergencyContactName1,
          emergencyContactPhone1: this.ruleForm.emergencyContactPhone1,
          emergencyContactName2: this.ruleForm.emergencyContactName2,
          emergencyContactPhone2: this.ruleForm.emergencyContactPhone2,
          alarmDay: this.ruleForm.alarmDay,
          note: this.ruleForm.note,
          sceneUserId: this.ruleForm.sceneUserId,
          houseId: this.ruleForm.houseId,
        };
        if (this.dialog.curType) {
          //添加
          addCareUser(param)
            .then((res) => {
              this.load = false;
              this.$message.success("添加成功！");
              this.handleClose();
              this.getTableData();
            })
            .catch((err) => {
              this.load = false;
            });
        } else {
          //修改
          param.id = this.currentId;
          updateCareUser(param)
            .then((res) => {
              this.load = false;
              this.$message.success("修改成功！");
              this.handleClose();
              this.getTableData();
            })
            .catch((err) => {
              this.load = false;
            });
        }
      } else {
        return false;
      }
    });
  }
  // 修改
  openUpdate(item) {
    this.dialog.curType = false;
    this["dialogCreate"] = true;
    this.currentId = item.id;
    this.ruleForm = {
      emergencyContactName1: item.emergencyContactName1,
      emergencyContactPhone1: item.emergencyContactPhone1,
      emergencyContactName2: item.emergencyContactName2,
      emergencyContactPhone2: item.emergencyContactPhone2,
      alarmDay: item.alarmDay,
      note: item.note,
      sceneUserId: item.sceneUserId,
      name: item.name,
      houseName: item.houseName,
      houseId: item.houseId,
    };
    this.dialogChooseRoom.selectedRoom = [{ id: item.houseId }];
    this.dialogChooseUser.selectedUser = [{ id: item.sceneUserId }];
  }
  // 删除
  handleDelete() {
    if (!this.selectList.length) {
      this.$message.error("请先选择用户！");
      return;
    }
    this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        let arr: any = [];
        this.selectList.map((item: any) => {
          arr.push(item.id);
        });
        deleteCareUser(arr).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getTableData();
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
  }
  handleSelectionChange(val) {
    this.selectList = val;
  }
  handleSelectRoom(item) {
    this.dialogChooseRoom.selectedRoom = item;
    this.ruleForm.houseName = item[0].locationName;
    this.ruleForm.houseId = item[0].id;
  }
  handleSelectUser(item) {
    this.dialogChooseUser.selectedUser = item;
    this.ruleForm.name = item[0].name;
    this.ruleForm.sceneUserId = item[0].id;
  }
  // 修改备注
  focusNoteInput(row) {
    /**@description  修改备注自动获取焦点 */
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }
  confirmUpdateNote(row) {
    /**@description 修改车位备注信息 */
    const form = { note: this.noteString, id: row.id };
    if (row["note"] !== form["note"]) {
      updateCareUser(form).then((res) => {
        this.$message.success("修改成功！");
        this.getTableData();
      });
    }
    this.noteString = "";
    row.noteStatus = false;
  }
}
</script>

<style lang="scss" scoped>
.cur-img {
  cursor: pointer;
}
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
.form-title {
  padding-left: 20px;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
