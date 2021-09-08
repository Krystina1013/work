<template>
  <div class="app-container">
    <div class="rightContent">
      <el-row>
        <el-col :span="24">
          <action-header :moreStatus="false" :filterStatus="false" :initFormHeader="initForm" @fetchData="fetchData" :dialogCreate.sync="dialogCreate" :total="page.total">
            <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
              <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                批量删除
              </el-button>
            </div>
          </action-header>
        </el-col>
      </el-row>
      <el-table :data="list_data" height="calc(100vh - 183px)" stripe border highlight-current-row @selection-change="handleSelectionChange" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange">
        <el-table-column v-if="globalUpdateStatus" type="selection" width="50"></el-table-column>
        <el-table-column type="index" align="center" class="indexNum" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
            <!-- <div v-if="globalUpdateStatus" class="fun-btn">
              <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                  <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                </el-tooltip>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="
                          scope.row.roleName !== '初始管理员' &&
                            deleteForm.data.length < 2
                        " :command="returnCommand('update', scope.row)">修改</el-dropdown-item>
                  <el-dropdown-item v-if="deleteForm.data.length < 2" :command="returnCommand('resetPassword', scope.row)">重置密码</el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.roleName !== '初始管理员'" :command="returnCommand('delete', scope.row)">
                    {{ deleteForm.data.length ? "批量删除" : "删除" }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div> -->
          </template>
        </el-table-column>

        <el-table-column prop="account" :show-overflow-tooltip="true" width="200" class="serial-num" label="账号名" align="center">
          <template slot-scope="scope">
            <span style="display:inline-block;padding:8px 0px">{{
                  scope.row.account
                }}</span>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" prop="note" label="备注" align="center">
          <!-- <template slot-scope="scope">
            <span class="rowUpdate" v-show="!scope.row.noteStatus" @click="focusNoteInput(scope.row)">{{ scope.row.note || "--" }}</span>
            <el-input :ref="scope.row.id" size="mini" @blur="confirmUpdateNote(scope.row)" v-model="noteString" v-show="scope.row.noteStatus" :clearable="true" placeholder="输入备注"></el-input>
          </template> -->
          <template slot-scope="scope">
            <span class="showIconBtn" v-show="!scope.row.noteStatus">
              <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'note')?'':'transparent'}" @click="focusNoteInput(scope.row)"></i>
              {{ scope.row.note || "--" }}
            </span>
            <el-input :ref="scope.row.id" size="mini" @blur="confirmUpdateNote(scope.row)" v-model.trim="noteString" v-show="scope.row.noteStatus" :clearable="true" :maxlength="200" placeholder="输入备注"></el-input>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" width="180" label="状态" align="center">
          <template slot-scope="{ row }">
            <el-dropdown @command="changeStatus" trigger="click">
              <span class="el-dropdown-link">
                <el-tag style="border-radius: 50px;padding: 0px 10px; cursor: pointer;" :type="row.status === 'USED' ? 'error' : 'danger'">{{ row.status === "USED" ? "正常" : "禁用" }}
                </el-tag>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="ComponentCommand('USED', row)">正常</el-dropdown-item>
                <el-dropdown-item :command="ComponentCommand('DISABLE', row)">禁用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" v-if="globalUpdateStatus">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="scope.row.roleName !== '初始管理员'" @click="commandClick({ action: 'update', row: scope.row })">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" @click="commandClick({ action: 'resetPassword', row: scope.row })">重置密码</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="mini" v-if="scope.row.roleName !== '初始管理员'" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <el-pagination :page-size="page.limit" @current-change="pageChange" style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination> -->

    <!-- 添加或修改 -->
    <el-dialog class="newDialog" :title="Form.id ? '修改管理员' : '添加管理员'" :visible.sync="dialogCreate" width="460px" :close-on-click-modal="false" :before-close="handleClose">
      <el-form :rules="rules" ref="Forms" :model="Form" label-width="80px">
        <el-form-item prop="account" label="账号">
          <el-input clearable style="position:fixed;bottom:-999999px" type="password"></el-input>
          <el-input style="width:300px" auto-complete="off" maxlength="10" type="text" clearable placeholder="请输入账号" v-model="Form.account"></el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="!Form.id" label="密码">
          <el-input clearable style="position:fixed;bottom:-999999px" type="password"></el-input>
          <el-input clearable style="width:300px" auto-complete="off" maxlength="16" placeholder="请输入密码" type="password" v-model="Form.password"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input style="width:300px" maxlength="200" placeholder="请输入备注" type="textarea" v-model="Form.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="addManagerConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 重置密码 -->
    <el-dialog class="newDialog updatePw" title="重置密码" :visible.sync="resetVisible" width="460px" :close-on-click-modal="false" :before-close="handleCloseReset">
      <el-form :rules="resetRules" ref="resetForms" :model="resetForms" label-width="80px">
        <el-form-item label="账号">
          <span>{{ resetForms.account }}</span>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input maxlength="16" clearable style="width:300px" type="password" placeholder="请输入修改后的密码" v-model="resetForms.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="reNewPassword">
          <el-input maxlength="16" clearable style="width:300px" type="password" placeholder="请再次确认密码" v-model="resetForms.reNewPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseReset">取 消</el-button>
        <el-button size="small" type="primary" @click="resetPasswordConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import config from "@/api/config";
import {
  addManager,
  updateManager,
  getRoleList,
  manageStatus,
  resetPassword,
} from "@/api/systemApi.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
  },
})
export default class InformIssue extends Vue {
  private dialogLibrary: any = false;
  private dialogFormVisible: Boolean = false;
  private roleTitle: String = "0";
  roleList: Array<object> = []; // 角色列表
  resetVisible: boolean = false; // 重置密码框状态
  resetForms: object = {
    newPassword: "",
    reNewPassword: "",
    account: "",
  };
  private Form: Object = {
    account: null,
    roleId: null,
    note: null,
    password: "",
    // roleName: ""
  };
  rules: object = {
    account: [
      { required: true, message: "请输入管理员名称", trigger: "blur" },
      { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" },
    ],
    roleId: [
      { required: true, message: "请选择管理员的角色", trigger: "blur" },
    ],
    roleName: [
      { required: true, message: "请选择管理员的角色", trigger: "change" },
    ],
    password: [
      { required: true, message: "请输入管理员的密码", trigger: "blur" },
      {
        min: 8,
        max: 16,
        message: "长度为8-16个字符,必须含数字和字母2种组合,不能含有空格!",
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (this.passwordDiff(value) !== 2) {
            callback(new Error("必须包含数字及英文"));
          } else {
            callback();
          }
        },
      },
    ],
  };
  resetRules: object = {
    newPassword: [
      { required: true, message: "请输入管理员的密码", trigger: "blur" },
      {
        min: 8,
        max: 16,
        message: "长度为8-16个字符,必须含数字和字母2种组合,不能含有空格!",
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (this.passwordDiff(value) !== 2) {
            callback(new Error("必须包含数字及英文"));
          } else {
            callback();
          }
        },
      },
    ],
    reNewPassword: [
      { required: true, message: "请确认管理员的密码", trigger: "blur" },
      {
        min: 8,
        max: 16,
        message: "长度为8-16个字符,必须含数字和字母2种组合,不能含有空格!",
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (this.passwordDiff(value) !== 2) {
            callback(new Error("必须包含数字及英文"));
          } else {
            callback();
          }
        },
      },
    ],
  };
  initForm: object = {
    url: config.v5 + "/admin/scence-admin/select",
    method: "get",
  };
  filterForm: object = {
    name: "",
  };
  updateArray: Array<string> = ["noteStatus"]; //需要行内修改的
  deleteForm: object = {
    url: config.v5 + "/admin/scence-admin/delete",
    method: "delete",
    data: [],
    message: "此操作将永久删除选中的管理员, 删除后管理员将不存在,请谨慎操作!",
  };
  selectVal: Array<Object> = [];

  rowId: String = "";
  showProperty: String = "";
  noteString: string = ""; // 修改备注
  created() {
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    // this.fetchRoleList();//权限
  }
  // 密码复杂度
  passwordDiff(str: string) {
    let diffcult: number = 0;
    if (/[0-9]/.test(str)) {
      diffcult++;
    }
    if (/[a-z]/i.test(str)) {
      diffcult++;
    }
    return diffcult;
  }
  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
  }

  enterCellChange(row, column, cell, event) {
    this.showProperty = column.property;
    this.rowId = row.id;
  }
  leaveCellChange(row, column) {
    this.showProperty = "";
    this.rowId = "";
  }

  // 修改备注自动获取焦点
  focusNoteInput(row) {
    this.noteString = row.note;
    row["noteStatus"] = true;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  // 修改备注
  confirmUpdateNote(row) {
    updateManager({
      id: row.id,
      note: this.noteString,
    })
      .then((res) => {
        if (res.data.code === 200) {
          this["message"]("success", "修改成功");
          row.noteStatus = false;
          this.noteString = "";
          this.fetchData(this.initForm);
        } else {
          row.noteStatus = false;
          this["message"]("error", res.data.message);
        }
      })
      .catch((error) => {
        row.noteStatus = false;
      });
  }

  // // 修改备注
  // confirmUpdateNote(row) {
  //   let roleId = "";
  //   // this.roleList.forEach(ele => {
  //   //   if (ele["name"] === row["roleName"]) {
  //   //     roleId = ele["id"];
  //   //   }
  //   // });
  //   updateManager({
  //     ...row,
  //     roleId,
  //     note: this.noteString,
  //   }).then((res) => {
  //     if (res.data.code === 200) {
  //       this["message"]("success", `修改成功`);
  //       row.noteStatus = false;
  //       this.noteString = "";
  //       this.fetchData(this.initForm);
  //     } else {
  //       row.noteStatus = false;
  //       this["message"]("error", res.data.message);
  //     }
  //   });
  // }
  // 确定添加/修改管理员
  addManagerConfirm() {
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        // this.roleList.forEach(ele => {
        //   if (ele["name"] === this.Form["roleName"]) {
        //     this.Form["roleId"] = ele["id"];
        //   }
        // });
        console.log(this.Form);
        let addOrUpdate = this.Form["id"] ? updateManager : addManager;

        addOrUpdate(this.Form).then((res) => {
          if (res.data.code === 200) {
            this["fetchData"](this.initForm);
            this["message"](
              "success",
              `${this.Form["id"] ? "修改成功" : "添加成功"}`
            );
          } else {
            this["message"](
              "error",
              `${this.Form["id"] ? "修改失败" : "添加失败"}`
            );
          }
          this["handleClose"]();
        });
      }
    });
  }
  ComponentCommand(status: string, row: object) {
    return {
      ...row,
      status,
    };
  }
  // 修改管理员状态
  changeStatus(Obj: object) {
    manageStatus(Obj["status"], Obj["id"]).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", `修改成功`);
        this["fetchData"](this.initForm);
      }
    });
  }
  // 确认重置密码
  resetPasswordConfirm() {
    this.$refs["resetForms"]["validate"]((valid) => {
      if (valid) {
        if (
          this.resetForms["newPassword"] !== this.resetForms["reNewPassword"]
        ) {
          this["message"]("error", `两次密码不一致`);
          return;
        }
        const Obj = {
          id: this.resetForms["id"],
          newPassword: this.resetForms["newPassword"],
        };
        resetPassword(Obj).then((res) => {
          if (res.data.code === 200) {
            this["message"]("success", `修改密码成功`);
          } else {
            this["message"]("error", `修改密码失败`);
          }
          this.resetVisible = false;
        });
      }
    });
  }
  // 关闭重置密码框
  handleCloseReset() {
    this.resetVisible = false;
    this.resetForms["newPassword"] = "";
  }
  // 获取角色列表
  fetchRoleList() {
    getRoleList(null).then((res) => {
      this.roleList = res.data.data;
      this.rules["roleName"].push({
        trigger: "change",
        validator: (rule, value, callback) => {
          if (!this.roleList.length) {
            callback(new Error("请在角色权限里面添加角色"));
          } else {
            callback();
          }
        },
      });
    });
  }
}
</script>

<style lang="scss">
.updatePw {
  .el-form-item {
    margin-bottom: 34px;
  }
}
</style>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 81px);
  padding-top: 10px;
  .rightContent {
    margin-top: 0;
  }
}
.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.close-menu {
  width: 10px;
  height: 48px;
  background: #acb7c1;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
}

.capture-img {
  width: 60px;
}
</style>
