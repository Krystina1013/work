<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent property-left">
            <DataTree @fetchData="fetchData" :page="page" :initFormHeader="initForm" @fetchRoleGroup="fetchRoleGroup" @handleBuildingId="handleBuildingId" :TreeData="TreeData" :type="'role'" />
            <ul class="property-device">
              <li>物业人员通行权限</li>
              <li v-for='(item,index) in propertyData' :key='index'>
                <span :title="item.bindingAddress">{{item.bindingAddress}}</span>
                <span :title="item.name">{{item.name}}</span>
              </li>
            </ul>
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <ActionHeader :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" ref="actionHeader" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="false">
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div @click="showExportIn">导入</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                  <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                    <el-button type="primary" size="small" icon="el-icon-delete" @click="returnCommand({ action: 'delete', row: selectVal })">
                      批量删除
                    </el-button>
                  </div>
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" placeholder="输入需要查找的姓名" v-model="filterForm.name" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">电话号码:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" maxlength="11" class="input-filter" placeholder="输入需要查找的电话号码" v-model="filterForm.phone" size="small"></el-input>
                    </div>
                  </div>
                </ActionHeader>
              </el-col>
            </el-row>
            <el-table :data="list_data" stripe border v-loading="showLoading" height="65vh" @selection-change="handleSelectionChange" @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange" @sort-change="sortChange">
              <el-table-column v-if="globalUpdateStatus" type="selection" align="center"></el-table-column>
              <el-table-column type="index" width="60" align="center" class="indexNum" label="序号">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" :show-overflow-tooltip="true" align="center" label="姓名">
                <template slot-scope="{ row }">
                  <el-button type="text" @click="showDetail(row)">
                    {{ row.name }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="电话号码">
                <template slot-scope="scope">
                  <span v-if="scope.row.phone.length == 11">{{
                    scope.row.phone
                  }}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column prop="face" align="center" label="注册人脸">
                <template slot-scope="scope">
                  <img v-if="scope.row.face" class="capture-img cursor" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = scope.row.face)" :src="scope.row.face" alt @click="openUpload(scope.row,'update')" />
                  <span v-else>
                    <el-button size="mini" type="primary" @click="openUpload(scope.row)">上传人脸</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="birthday" :show-overflow-tooltip="true" width="120" align="center" label="出生日期"></el-table-column>
              <el-table-column prop="sex" width="120" align="center" label="性别">
                <template slot-scope="{ row }">
                  <span>
                    {{ row.sex === "1" ? "男" : row.sex === "0" ? "女" : "" }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="idcardType" :show-overflow-tooltip="true" align="center" label="证件类型"></el-table-column>
              <el-table-column prop="idcardNo" :show-overflow-tooltip="true" align="center" label="证件号"></el-table-column>
              <el-table-column prop="authName" width="120" align="center" label="权限组">
                <template slot-scope="{ row }">
                  <el-dropdown @command="changeGroupRole" trigger="click">
                    <span class="el-dropdown-link">
                      <el-tag size="small" type="info" style="border-radius: 50px;padding: 0 10px; cursor: pointer;color:#606266">{{ row.authName }}</el-tag>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(item, index) in TreeData" :key="index" :command="ComponentCommand(item.id, row.id)">{{ item.name }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
                <template slot-scope="scope">
                  <span class="rowUpdate" v-show="!scope.row.noteStatus" @click="focusNoteInput(scope.row)">{{ scope.row.note || "--" }}</span>
                  <el-input :clearable="true" :ref="scope.row.id" @blur="confirmUpdateNote(scope.row)" v-model="noteString" v-show="scope.row.noteStatus" placeholder="输入备注"></el-input>
                </template>
              </el-table-column>
              <el-table-column width="200" :show-overflow-tooltip="true" prop="createTime" align="center" sortable='custom' label="创建时间"></el-table-column>
              <el-table-column label="操作" width="80" align="center" v-if="globalUpdateStatus">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="returnCommand({ action: 'delete', row: scope.row })">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :current-page="page.page" :page-size="page.limit" style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
          </div>
        </template>
      </split-pane>
    </div>

    <el-dialog class="newDialog spPadding" :close-on-click-modal="false" width="650px" :title="Dialog.name" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
          <div class=" reg-face">
            <span class="right">注册人脸:</span>&nbsp;&nbsp;
            <img v-if='Dialog.face' :src="Dialog.face" @mouseout="imgVisible = false" @mouseover="(imgVisible = true), (bigImg = Dialog.face)" alt="">
            <img v-else class="personner-img" src="../../../assets/none.png" alt />
          </div>
          <div class="singleInfo flex">
            <span class="right">姓名:</span>
            &nbsp;&nbsp;<span class="texthidden" :title="Dialog.name">{{ Dialog.name }}</span>
          </div>
          <div class="singleInfo">
            <span class="right">性别:</span>&nbsp;&nbsp;
            <span>
              {{ Dialog.sex === "1" ? "男" : Dialog.sex === "0" ? "女" : "" }}
            </span>
          </div>
          <div class="singleInfo flex">
            <span class="right">电话号码:</span>
            &nbsp;&nbsp;<span class="texthidden" :title="Dialog.phone">{{ Dialog.phone }}</span>
          </div>
          <div class="singleInfo">
            <span class="right">出生日期:</span>
            &nbsp;&nbsp;{{ Dialog.birthday || "" }}
          </div>
          <div class="singleInfo flex">
            <span class="right">身份证号:</span>
            &nbsp;&nbsp;<span class="texthidden" :title="Dialog.idcardNo">{{ Dialog.idcardNo }}</span>
          </div>
          <div class="singleInfo">
            <span class="right">年龄:</span>
            &nbsp;&nbsp;{{ Dialog.age }}
          </div>
          <div class="singleInfo">
            <span class="right">权限组:</span>
            &nbsp;&nbsp;{{ Dialog.authName || "" }}
          </div>
          <div class="singleInfo">
            <span class="right">备注:</span>
            &nbsp;&nbsp;{{ Dialog.note}}
          </div>
          <div class="singleInfo">
            <span class="right">创建时间:</span>
            &nbsp;&nbsp;{{ Dialog.createTime}}
          </div>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="second">
          <el-table :data="passListData" border stripe>
            <el-table-column prop="scenceUser.name" align="center" label="姓名" width="100px"></el-table-column>
            <el-table-column prop="passTime" :show-overflow-tooltip="true" align="center" label="通行时间" width="150px"></el-table-column>
            <el-table-column prop="deviceInfo.inOut" align="center" label="进/出" width="80px"></el-table-column>
            <el-table-column prop="passMethod" align="center" label="通行方式">
              <template slot-scope="{ row }">
                <span>{{ row.passMethod | passMethod }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="抓拍图片">
              <template slot-scope=" scope">
                <img v-if="scope.row.photos" style="margin-top: 3px" class="capture-img" @mouseout="twoImg.visible = false" @mouseover="showImg(scope)" :src="scope.row.photos" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="pagePassChange" :current-page="passList.page" :page-size="passList.limit" :total="passList.total" style="margin-top:10px;" background layout="prev, pager, next"></el-pagination>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="newDialog" :close-on-click-modal="false" title="添加物业人员" :visible.sync="dialogCreate" width="650px" :before-close="handleClose">
      <el-form :model="Form" :rules="FormRules" ref="Forms" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="name">
              <el-input clearable v-model="Form.name" maxlength="10" placeholder="输入物业人员姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码:" prop="phone">
              <el-input clearable v-model="Form.phone" maxlength="11" placeholder="输入物业人员电话号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="margin-bottom:16px;" label="人脸:" prop="baseFace">
              <el-upload ref="upload" class="avatar-uploader" :action='config.v5+"/admin/scence-user/upFace"' accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期:" prop="birthday">
              <el-date-picker style="width:190px" v-model="Form.birthday" type="date" format="yyyy - MM - dd" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别:" prop="sex">
              <el-select style="width:190px" v-model="Form.sex" placeholder="请选择">
                <el-option label="请选择" value></el-option>
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限组:" prop="authId">
              <el-select style="width:190px" v-model="Form.authId" placeholder="请选择">
                <el-option v-for="item in TreeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型:" prop="otherCardName">
              <el-select @change="(Form.idcardNo = ''), (Form.idcardType = '')" style="width:190px" v-model="Form.otherCardName" placeholder="请选择证件类型">
                <el-option label="身份证" value="身份证"></el-option>
                <el-option label="护照" value="护照"></el-option>
                <el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
                <el-option label="其它" value="其它"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="Form.otherCardName === '其它'" label="证件名称:" prop="idcardType">
              <el-input maxlength="10" v-model="Form.idcardType" clearable placeholder="输入证件名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item style="clear:both" label="证件号:" prop="idcardNo">
              <el-input :maxlength="Form.otherCardName === '身份证' ? '18' : '20'" clearable v-model="Form.idcardNo" :placeholder="'输入证件号'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" style="clear:both" prop="note">
              <el-input type="textarea" maxlength="200" v-model="Form.note" placeholder="输入备注" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmAddPropert" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 上传人脸 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="300px" :title="uploadFaceTitle" :visible.sync="uploadFaceVisible">
      <el-upload ref='upload' class="avatar-uploader " :action='config.v5+"/admin/scence-user/upFace"' accept='image/*' :auto-upload="false" :show-file-list="false" :on-change="beforeFaceUpload">
        <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar avatar-single">
        <i v-else class="el-icon-plus avatar-uploader-icon avatar-single"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadFaceVisible = false;uploadImageUrl=''">取 消</el-button>
        <el-button size="small" type="primary" :loading='upfaceLoading' @click="confirmUploadFace">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 人脸相似重新上传 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="500px" title="提示" :visible.sync="uploadFaceReplayVisible">
      <p>{{uploadFaceReplaymessage}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadFaceReplayVisible = false">取 消</el-button>
        <el-button size="small" type="primary" :loading='replayUpfaceLoading' @click="replayConfirmUploadFace">继续上传</el-button>
      </div>
    </el-dialog>

    <ExportIn :uploadUrl="
        env === 'production'
          ? 'http://139.196.14.225:8084/admin/scence-user/propertyUser/import'
          : config.v5+'/admin/scence-user/propertyUser/import'
      " :downTemplateUrl='config.v5+"/admin/scence-user/propertyUser/model"' TmplateName="物业人员导入模板.xlsx" @closeVisible="closeVisible" @successUpload="fetchData(initForm)" :visible.sync="visible" />
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import config from "@/api/config";
const BigImg = () => import("@/components/BigImg/index.vue");
import {
  getRoleGroup,
  addPropert,
  resetDisabledUser,
  watchPropert,
  getUserPropertyPass,
  changeRoleGroup,
  updateUserPhone,
  updateUser,
  uploadFace,
  getGroupInfoById,
} from "@/api/peopleApi.ts";
import { getUserPropertyCar } from "@/api/carApi.ts";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
import splitPane from "vue-splitpane";
import { getBase64 } from "@/utils/index.js";

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    ExportIn,
    splitPane,
    BigImg,
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
      };
      return data[val];
    },
  },
})
export default class PropertyManage extends Vue {
  config: any = config;
  uploadFaceVisible: boolean = false;
  upfaceLoading: boolean = false;
  uploadImageUrl: string = ""; //单独上传人脸
  propertyData: Array<object> = []; //物业权限列表-设备
  rowline: object = {}; //每行数据
  private activeName: string = "first";
  private confirmLoading: boolean = false;
  private imageUrl: string = "";
  private dialogFormVisible: boolean = false;
  private title: string = "详情";
  private rowSpan: number = 15;
  env: string = process.env.NODE_ENV;
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  passListData: Array<object> = []; // 物业人员通行记录
  carList: Array<object> = []; // 物业人员车辆信息
  noteString: string = ""; // 备注信息
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  Form: object = {
    name: "",
    phone: "",
    age: "",
    note: "",
    sex: "",
    authId: "",
    birthday: "",
    idcardNo: "",
    idcardType: "",
    otherCardName: "身份证",
    baseFace: "",
  };
  twoImg: any = {
    visible: false,
    leftTitle: "",
    rightTitle: "",
    leftImg: "",
    rightImg: "",
  };
  pickerOptions: object = {
    disabledDate(time) {
      return time.getTime() > Date.now() - 8.64e7;
    },
  };
  initForm: object = {
    url: config.v5 + "/admin/scence-user/propertyUser/page",
    method: "get",
  };
  filterForm: object = {
    name: "",
    phone: "",
  };
  deleteForm: object = {
    url: config.v5 + "/admin/scence-user/propertyUser",
    method: "delete",
    data: [],
    message:
      "此操作将永久删除选中的物业人员,删除后物业人员将不存在,请谨慎操作!",
  };
  passList: object = {
    scenceUserId: "",
    page: 1,
    limit: 10,
    total: 1,
  };
  visible: boolean = false; // 导入框状态
  phoneString: string = ""; // 手机号
  updateArray: Array<string> = ["noteStatus", "phoneStatus"]; //需要行内修改的
  selectVal: Array<Object> = [];
  TreeData: Array<object> = []; // 权限组
  FormRules: object = {
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    phone: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (value.length !== 11 || !/^1[123456789]\d{9}$/.test(value)) {
            callback(new Error("填写正确的手机号"));
          } else {
            callback();
          }
        },
      },
    ],
    idcardNo: [
      {
        required: false,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (
            !(value.length === 15 || value.length === 18 || value == "") &&
            this.Form["otherCardName"] === "身份证"
          ) {
            callback(new Error("填写正确的证件号码"));
          } else {
            callback();
          }
        },
      },
    ],
  };
  Dialog: object = {
    name: "", // 物业人员详细记录
  };
  uploadFaceTitle: string = "上传人脸";
  replayUpfaceLoading: boolean = false; //重新上传
  uploadFaceReplayVisible: boolean = false; //重新上传dialog
  uploadFaceReplaymessage: string = ""; //重新上传dialog 的title
  handleBuildingId(data) {
    /**@description 物业权限id */
    if (!data.id) {
      this.propertyData = [];
      return;
    }
    getGroupInfoById(data.id).then((res) => {
      if (res.data.code === 200) {
        this.propertyData = res.data.data.devices;
      } else {
        this.$message("获取权限组信息失败");
      }
    });
  }
  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  showExportIn() {
    this.visible = true;
  }
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 15;
    } else {
      this.rowSpan = 0;
    }
  }
  showImg(scope) {
    this.twoImg.visible = true;
    this.twoImg.leftImg = scope.row.photos;
    this.twoImg.leftTitle = "抓拍人脸";
    this.twoImg.rightImg = scope.row.facePhone;
    this.twoImg.rightTitle = "注册人脸";
  }
  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
  }
  resize() {}
  beforeAvatarUpload(file) {
    getBase64(file.raw).then((res) => {
      this.imageUrl = res;
    });
  }
  // 改变物业人员权限组
  changeGroupRole(Obj: object) {
    changeRoleGroup(Obj["Status"], Obj["id"]).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "设置成功");
        this["fetchData"](this.initForm);
      }
    });
  }
  // 修改备注自动获取焦点
  focusNoteInput(row) {
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }
  // 确定修改 电话
  confirmUpdatePhone(row) {
    if (!/^1[123456789]\d{9}$/.test(this.phoneString)) {
      this["message"]("error", "请输入正确的手机格式");
      this.$set(row, "phoneStatus", false);
      return;
    }
    this.$confirm(`此操作将修改${row.name}的手机号,请谨慎操作!`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        let param = {
          id: row.id,
          phone: this.phoneString,
        };
        updateUserPhone(param).then((res) => {
          if (res.data.code === 200) {
            this["message"]("success", "修改成功");
            row.phoneStatus = false;
            this.phoneString = "";
            this.fetchData(this.initForm);
          } else {
            this["message"]("error", res.data.message);
          }
        });
      })
      .catch(() => {
        this.$set(row, "phoneStatus", false);
        this["message"]("error", "已取消修改");
      });
  }
  // 修改电话离开输入框
  phoneBlur(row) {
    row.phoneStatus = false;
    this.phoneString = "";
  }
  // 修改手机号
  phoneChange(row) {
    this.phoneString = row.phone;
    this["list_data"].forEach((el) => {
      this.$set(el, "phoneStatus", false);
    });
    row.phoneStatus = !row.phoneStatus;
    this.$nextTick(() => {
      const input = this.$refs["name" + row.id] as HTMLElement;
      input.focus();
    });
  }
  // 修改备注
  confirmUpdateNote(row) {
    updateUser({ id: row.id, note: this.noteString }).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "修改成功");
        row.noteStatus = false;
        this.noteString = "";
        this.fetchData(this.initForm);
      } else {
        this["message"]("error", res.data.message);
      }
    });
  }
  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false;
    this.noteString = "";
  }
  /*** row 列表数据*/
  showDetail(row) {
    this.activeName = "first";
    this.dialogFormVisible = true;
    this.passList["scenceUserId"] = row.id;
    this.passList["page"] = 1;
    this.Dialog = Object.assign(this.Dialog, row);
    // 获取无业人员记录
    getUserPropertyPass(this.passList).then((res) => {
      this.passListData = res.data.data.records;
      this.passList["total"] = res.data.data.total;
    });
  }
  // 物业人员通行记录翻页
  pagePassChange(page: number) {
    this.passList["page"] = page;
    getUserPropertyPass(this.passList).then((res) => {
      this.passListData = res.data.data.records;
      this.passList["total"] = res.data.data.total;
    });
  }
  // 获取权限组
  fetchRoleGroup() {
    getRoleGroup(null).then((res) => {
      this.TreeData = res.data.data;
      this.FormRules["authId"].push({
        required: true,
        trigger: "change",
        validator: (rule, value, callback) => {
          if (!this.TreeData.length) {
            callback(new Error("请先添加权限组"));
          } else {
            callback();
          }
        },
      });
    });
  }
  created() {
    this.fetchRoleGroup();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  beforeFaceUpload(file) {
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   this.$message.error('上传人脸图片大小不能超过 2MB!');
    //   return;
    // }
    getBase64(file.raw).then((res) => {
      this.uploadImageUrl = res;
    });
  }
  openUpload(row, type) {
    this.rowline = row;
    this.uploadFaceTitle = type == "update" ? "修改人脸" : "上传人脸";
    this.uploadImageUrl = type == "update" ? row.face : "";
    this.uploadFaceVisible = true;
  }
  confirmUploadFace() {
    if (this.uploadImageUrl == "") {
      this.$message.error("请先添加人脸");
      return;
    }
    this.upfaceLoading = true;
    let param = {
      baseFace: this.uploadImageUrl,
      id: this.rowline["id"],
    };
    this.uploadFace(param);
  }
  uploadFace(data) {
    if (data.baseFace.indexOf("http") != -1) {
      this.upfaceLoading = false;
      this.uploadFaceVisible = false;
      this.replayUpfaceLoading = false;
      this.uploadFaceReplayVisible = false;
      this.uploadImageUrl = "";
      return;
    }
    uploadFace(data)
      .then((res) => {
        this.upfaceLoading = false;
        this.$message.success("添加成功！");
        this.uploadFaceVisible = false;
        this.uploadImageUrl = "";
        this.fetchData(this.initForm);
        this.replayUpfaceLoading = false;
        this.uploadFaceReplayVisible = false;
      })
      .catch((err) => {
        this.upfaceLoading = false;
        if (err.message.indexOf("相似") != -1) {
          this.uploadFaceReplayVisible = true;
          this.uploadFaceReplaymessage = err.message;
        }
      });
  }
  replayConfirmUploadFace() {
    this.replayUpfaceLoading = true;
    if (this["dialogCreate"]) {
      this.confirmAddPropert("force");
      return;
    }
    let param = {
      baseFace: this.uploadImageUrl,
      id: this.rowline["id"],
      isForce: true,
    };
    this.uploadFace(param);
  }
  // 修改物业人员状态
  changeStatus(Obj: object) {
    const form = { status: Obj["Status"], id: Obj["id"] };
    resetDisabledUser(form).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "修改成功");
        this["fetchData"](this.initForm);
      }
    });
  }
  ComponentCommand(Status: string, id: string) {
    return {
      id,
      Status,
    };
  }
  // 确定添加物业人员
  confirmAddPropert(type: string) {
    if (this.Form["otherCardName"] !== "其它") {
      this.Form["idcardType"] = this.Form["otherCardName"];
    }
    this.Form["baseFace"] = this.imageUrl;
    let param = { ...this.Form };
    if (type == "force") {
      param["force"] = true;
    }
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        this.confirmLoading = true;
        addPropert(param)
          .then((res) => {
            if (res.data && res.data.code === 200) {
              this.confirmLoading = false;
              this["message"]("success", "添加成功");
              this["dialogCreate"] = false;
              this["fetchData"](this.initForm);
              this["handleClose"]();
              this.replayUpfaceLoading = false;
              this.uploadFaceReplayVisible = false;
            }
          })
          .catch((err) => {
            this.confirmLoading = false;
            if (err.message.indexOf("相似") != -1) {
              this.uploadFaceReplayVisible = true;
              this.uploadFaceReplaymessage = err.message;
            }
          });
      }
    });
  }
  handleClose() {
    this.imageUrl = "";
    this["dialogCreate"] = false;
    for (let key in this.Form) {
      this.Form[key] = "";
    }
    this.$refs["Forms"]["resetFields"]();
    this.$refs["upload"]["clearFiles"]();
  }
  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order == "descending";
    this["fetchData"](this.initForm);
  }
}
</script>

<style lang="scss">
.spPadding {
  .spPadding {
    .el-dialog__body {
      padding: 0 15px 10px;
    }
    .el-button--small {
      width: auto !important;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #f1f3f4;
    }
    .el-tabs__active-bar {
      height: 4px;
    }
    .el-table th,
    .el-table td {
      padding: 9px 0;
    }
  }
}
</style>

<style lang="scss" scoped>
.property-left {
  .content {
    height: calc(50vh - 41px);
  }
  .property-device {
    width: 100%;
    height: calc(50vh - 41px);
    text-align: left;
    background: #fff;
    border: 1px solid #ebeef5;
    overflow-y: auto;
    overflow-x: auto;
    box-shadow: 0px 0px 8px 0px lightgrey;
    padding-bottom: 10px;
    li:first-child {
      width: 100%;
      background: #409eff;
      color: #fff;
      font-size: 15px;
      padding: 5px 10px;
    }
    li {
      height: 40px;
      padding: 0 10px;
      list-style: none;
      margin-bottom: 10px;
      font-size: 14px;
      color: #606266;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        display: inline-block;
        width: 45%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-button--mini {
    padding: 5px 10px;
  }
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.right {
  width: 62px;
  display: inline-block;
  height: 30px;
  text-align: right;
}
.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}
// .float {
//   width: 250px;
//   float: left;
//   position: relative;
//   z-index: 99;
// }

.menu-control {
  position: absolute;
  top: 32vh;
  left: -10px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -11px;
}
.singleInfo {
  width: 40%;
  height: 40px;
  padding: 0px 10px;
  text-align: left;
  line-height: 40px;
  float: left;
  &:nth-child(2),
  &:nth-child(3),
  &:nth-child(5),
  &:nth-child(8),
  &:nth-child(9),
  &:nth-child(6) {
    width: 30%;
  }
}
.components-container {
  position: relative;
  height: 65vh;
}
.reg-face {
  padding: 0 10px;
}
.reg-face img {
  width: 100px;
  height: 100px;
}
.cursor {
  cursor: pointer;
}
.texthidden {
  display: inline-block;
  width: 89px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 30px;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
