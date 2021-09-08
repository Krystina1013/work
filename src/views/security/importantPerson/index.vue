<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <div :class="['treeHeader', highlightStatus ? '' : 'highlight']" @click="handleNodeClick({ id: '' })">
              <i class="iconfont icon-shuji"></i>
              所有
              <el-dropdown class="dropdownAll" placement="bottom-start">
                <i class="iconfont icon-gengduo"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><span @click="openDialogAdd">新建关注人员分组</span></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="bottom">
              <el-tree :data="TreeData" node-key="id" accordion :highlight-current="highlightStatus" :default-expand-all="false" :expand-on-click-node="false" @node-click="handleNodeClick" :props="defaultProps">
                <span slot-scope="{ node, data }" @mouseenter="MouseNnter(node.id)" @mouseleave="MouseLeave(node.id)" :class="[
                    'custom-tree-node',
                    currentTreeId == data.id ? 'highlight' : '',
                  ]">
                  <span :title="`${data.name} (${data.count})`">
                    {{
                      node.label.length > 8
                        ? node.label.substring(0, 8) + "..."
                        : node.label
                    }}
                    ({{ data.count }})
                  </span>
                  <div style="position: relative">
                    <el-dropdown v-if="UpdateStatus" placement="bottom-start">
                      <i v-show="node.id === showMenu" class="iconfont icon-gengduo"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><span @click="openDialogUpdate(data)">修改</span></el-dropdown-item>
                        <el-dropdown-item><span @click="deleteGroup(data.id)">删除</span></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </span>
              </el-tree>
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <action-header :initFormHeader="initForm" :exportUrl="exportUrl" exportName="关注人员导出.xls" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="false" :pageStatus="true" :police="true" :addDisabled="!currentTreeId" @clearFilter="clearFilter">
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="export">导出</el-dropdown-item>
                  </el-dropdown-menu>
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
                      <el-input clearable placeholder="请输入需要查找的姓名" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.name" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">电&nbsp;&nbsp;&nbsp;话:</span>
                      <el-input clearable placeholder="请输入需要查找的电话" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.phone" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">证件号码:</span>
                      <el-input clearable placeholder="请输入需要查找的证件号码" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.cardNo" size="small"></el-input>
                    </div>
                  </div>
                </action-header>
              </el-col>
            </el-row>
            <div v-loading="showLoading">
              <ScrollList class="scollList" ref="scrollList" :height="height_w - 245" :canPullUp="canPullUp" @scrollToBottom="scrollToBottom">
                <div class="card" :key="index" v-for="(item, index) in tableData">
                  <div class="imgWrapper">
                    <img :src="item.faceUrl" style="cursor: pointer" />
                  </div>
                  <div class="detailWrapper">
                    <span class="name moreWord" :title="item.name" style="word-break: break-all">{{ item.name }}</span>
                    <span class="flex-1 moreWord" :title="item.createTime">{{
                    item.createTime | ignoreYearAndSecond
                  }}</span>
                  </div>
                  <div class="buttonWrapper">
                    <el-button type="text" size="small" class="detailBtn" @click="showDetailDialog(item)">详情</el-button>
                    <el-button type="text" size="small" @click="showDeleteDialog(item.id)">删除</el-button>
                    <el-button type="text" size="small" @click="showUpdateDialog(item)">修改</el-button>
                  </div>
                </div>
              </ScrollList>
            </div>
          </div>
        </template>
      </split-pane>
    </div>

    <AddPersonPic ref="addpersonPic" :dialogCreate="dialogCreate" @submit="confirmAddOrUpdate" @close="dialogCreate = false"></AddPersonPic>

    <el-dialog :close-on-click-modal="false" :title="personTitle ? '添加关注人员分组' : '修改关注人员分组'" :visible.sync="dialogAddPerson" width="510px" :before-close="handleClose">
      <el-form :model="libraryRuleForm" :rules="libraryRules" ref="libraryRuleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="libraryRuleForm.name" maxlength="32" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="报警阈值：" prop="alertCnt" :rules="{
            required: true,
            message: '请选择报警阈值',
            trigger: 'change',
          }">
          <el-select v-model="libraryRuleForm.alertCnt" placeholder="请选择" style="width: 250px">
            <el-option v-for="item in similarityList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控点位：" prop="cameraList" :rules="{
            required: true,
            message: '请选择监控点位',
            trigger: 'change',
          }">
          <el-button type="primary" size="small" class="aBtn" @click="choosePoint">选择点位</el-button>
        </el-form-item>

        <el-form-item label="已选点位：">
          <span class="dib" style="margin-right: 20px; line-height: 25px" :key="index" v-for="(item, index) in libraryRuleForm.cameraList">{{ item.name }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmAddPerson" :loading="addGroupLoad">确 定</el-button>
      </span>
    </el-dialog>

    <ChooseCamera :visible="chooseCamera.visible" :camera="chooseCamera.camera" @close="chooseCamera.visible = false" @submit="confirmChoose"></ChooseCamera>
    <DialogDetail :visible="dialogDetail.visible" :form="dialogDetail.form" :title="dialogDetail.title" @close="dialogDetail.visible = false"></DialogDetail>
    <AddOrUpdatePerson @close="dialogEditPortrait.visible = false" :visible="dialogEditPortrait.visible" :form="dialogEditPortrait.form" :title="dialogEditPortrait.title" @submit="updatePerson"></AddOrUpdatePerson>
  </div>
</template>

<script lang="ts">
import splitPane from "vue-splitpane";
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import config from "@/api/config";
import {
  importantGroup,
  AddimportantGroup,
  getCameraNoPage,
  updateImportantGroup,
  delateImportantGroup,
  addImportantPerson,
  getImportantPerson,
  deleteImportantPerson,
} from "@/api/police";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
import { getBase64 } from "@/utils/index.js";
import AddPersonPic from "./components/addPersonPic.vue";
import DialogDetail from "./components/dialogDetail.vue";
import ChooseCamera from "./components/chooseCamera.vue";
import AddOrUpdatePerson from "./components/addOrUpdatePerson.vue";
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    splitPane,
    AddPersonPic,
    ScrollList,
    ChooseCamera,
    DialogDetail,
    AddOrUpdatePerson,
  },
})
export default class importantPerson extends Vue {
  defaultProps: object = {
    children: "children",
    label: "name",
  };
  chooseCamera: any = {
    visible: false,
    camera: [],
  };
  config: any = config;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  highlightStatus: boolean = false; // 高亮状态
  private rowSpan: number = 16;
  private showMenu: Number = 0;
  UpdateStatus: boolean = true; // 是否具有修改权限
  initForm: object = {};
  libraryRuleForm: any = {
    name: "",
    alertCnt: "",
    cameraList: [],
    originalCameraList: [],
  };
  currentTreeId: string = "";
  libraryRules: object = {
    name: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
  };

  filterForm: object = {
    name: "",
    cardNo: "",
    phone: "",
  }; // 筛选条件
  exportUrl: string = "";
  TreeData: Array<object> = [];
  dialogAddPerson: boolean = false; //添加人像库
  addGroupLoad: boolean = false; //添加人像库-按钮
  personTitle: boolean = false;
  canPullUp: boolean = true;
  tableData: Array<object> = [];
  //人像详情
  dialogDetail: any = {
    visible: false,
    title: "",
    form: {},
  };
  //修改人像
  dialogEditPortrait: any = {
    visible: false,
    form: {},
    title: "",
  };
  similarityList: Array<object> = localStorage.similarityList
    ? JSON.parse(localStorage.similarityList)
    : [];
  pagination: any = {
    total: 0,
    page: 1,
    pageSize: 20,
  };
  showLoading: boolean = false;
  created() {
    this["isPolice"] = true;
    this.getLeftTree();
    this.getTableData();
  }
  resize() {}
  clearFilter() {
    this.filterForm = {
      name: "",
      cardNo: "",
      phone: "",
    };
  }
  fetchData() {
    this.getTableData();
  }
  getLeftTree() {
    importantGroup({ page: 1, pageSize: 100 }).then((res) => {
      this.TreeData = res.data.data.records;
    });
  }

  getTableData() {
    if (this.currentTreeId) {
      this.highlightStatus = true;
    }
    this.pagination.page = 1;
    this.tableData = [];
    this.loadData();
  }
  loadData() {
    let param = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      alertTaskId: this.currentTreeId,
      ...this.filterForm,
    };
    this.showLoading = true;
    getImportantPerson(param)
      .then((res) => {
        let data = res.data.data;
        this.showLoading = false;
        this.pagination.total = parseInt(data.total);
        this.page["total"] = res.data.data.total;
        if (this.pagination.page == 1) {
          this.tableData = data.records;
          // this.$refs.scrollList.scrollToTop();
        } else {
          this.tableData = [...this.tableData, ...data.records];
        }
        this.$nextTick(() => {
          if (this.tableData.length == parseInt(data.total)) {
            this.canPullUp = false;
          } else {
            this.canPullUp = true;
          }
        });
      })
      .catch((err) => {
        this.showLoading = false;
      });
  }
  scrollToBottom() {
    this.canPullUp = false;
  }
  handleNodeClick(data) {
    this.highlightStatus = !!data.id;

    this.currentTreeId = data.id;
    this.getTableData();
  }
  /**显示更多操作图标 */
  MouseNnter(val) {
    this.showMenu = val;
  }
  MouseLeave(val) {
    this.showMenu = 0;
  }
  // 选择监控点位
  choosePoint() {
    this.chooseCamera.camera = this.libraryRuleForm.cameraList;
    this.chooseCamera.visible = true;
  }
  //增加关注人员分组
  openDialogAdd() {
    this.personTitle = true;
    this.dialogAddPerson = true;
  }
  // 修改关注人员分组
  openDialogUpdate(item: object) {
    if (item) {
      this.libraryRuleForm["name"] = item["name"];
      this.libraryRuleForm["alertCnt"] = item["alertCnt"];
      getCameraNoPage({ alertTaskId: item["id"] }).then((res) => {
        this.libraryRuleForm["cameraList"] = [...res.data.data];
        this.libraryRuleForm["originalCameraList"] = [...res.data.data];
      });
      this.currentTreeId = item["id"];
    }
    this.personTitle = false;
    this.dialogAddPerson = true;
  }
  // 删除分组
  deleteGroup(id) {
    this.$confirm(
      "此操作将永久删除选中的分组, 删除后分组将不存在,请谨慎操作!",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    ).then(() => {
      let param = [id];
      delateImportantGroup(param).then((res) => {
        this.$message.success("删除成功！");
        this.getLeftTree();
      });
    });
  }
  handleClose() {
    this.libraryRuleForm["name"] = "";
    this.libraryRuleForm.cameraList = [];
    this.addGroupLoad = false;
    this.dialogAddPerson = false;
    this.$refs["libraryRuleForm"]["resetFields"]();
  }
  //分组
  confirmAddPerson() {
    this.$refs["libraryRuleForm"]["validate"]((valid) => {
      if (valid) {
        this.addGroupLoad = true;
        let similarity = JSON.parse(localStorage.similarity);
        let examineLevel;
        for (let i in similarity) {
          if (similarity[i] == this.libraryRuleForm.alertCnt) {
            examineLevel = i;
          }
        }
        let cameraIds: any = [];
        this.libraryRuleForm.cameraList.map((item: any) => {
          cameraIds.push(item.id);
        });
        let param = {
          alertCnt: this.libraryRuleForm.alertCnt,
          name: this.libraryRuleForm.name,
          examineLevel,
          cameraIds,
          cameraList: this.libraryRuleForm.cameraList,
        };

        if (this.personTitle) {
          //增加
          this.addGroup(param);
        } else {
          this.updateGroup(param);
        }
      }
    });
  }
  //新增分组
  addGroup(param) {
    AddimportantGroup(param)
      .then((res) => {
        this.addGroupLoad = false;
        this.$message.success("添加成功！");
        this.getLeftTree();
        this.handleClose();
      })
      .catch((err) => {
        this.addGroupLoad = false;
      });
  }
  // 修改分组
  updateGroup(param) {
    param.id = this.currentTreeId;
    let sameList = param.cameraList.filter((item) =>
      this.libraryRuleForm.originalCameraList.find(
        (item1) => item1.id == item.id
      )
    );
    let differentList = param.cameraList.filter(
      (item) =>
        !this.libraryRuleForm.originalCameraList.find(
          (item1) => item1.id == item.id
        )
    );
    let deleteList = this.libraryRuleForm.originalCameraList.filter(
      (item) => !sameList.find((item1) => item1.id == item.id)
    );
    param.cameraIdsAdd = differentList.map((item) => item.id);
    param.cameraIdsDelete = deleteList.map((item) => item.id);
    updateImportantGroup(param)
      .then((res) => {
        this.addGroupLoad = false;
        this.$message.success("修改成功！");
        this.getLeftTree();
        this.handleClose();
      })
      .catch((err) => {
        this.addGroupLoad = false;
      });
  }
  deletePerson(id) {
    this.$confirm("此操作将永久删除该人像库, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
  }
  //人员弹窗
  showDetailDialog(item) {
    this.dialogDetail.form = item;
    this.dialogDetail.visible = true;
  }
  showDeleteDialog(id) {
    this.$confirm("此操作将永久删除该人像, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      deleteImportantPerson([id]).then((res) => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.getLeftTree();
        this.getTableData();
      });
    });
  }
  showUpdateDialog(item) {
    this.dialogEditPortrait.form = { ...item };
    this.dialogEditPortrait.visible = true;
    this.dialogEditPortrait.title = "修改人像";
  }
  // 选择的摄像机
  confirmChoose(val) {
    this.libraryRuleForm.cameraList = val;
    this.chooseCamera.visible = false;
  }
  //确认添加关注人员
  confirmAddOrUpdate(val) {
    val.id = this.currentTreeId;
    addImportantPerson(val).then((res) => {
      this.$message.success("添加成功！");
      this["dialogCreate"] = false;

      this.$refs["addpersonPic"]["clearAllPortrait"]();
      this.getLeftTree();
      this.getTableData();
    });
  }
  //修改人像信息
  updatePerson(val) {
    this.dialogEditPortrait.visible = false;
    this.getLeftTree();
    this.getTableData();
  }
}
</script>

<style lang="scss" scoped>
.components-container {
  position: relative;
  height: calc(100vh - 111px);
}
.leftContent {
  position: relative;
  background: #fff;
  box-shadow: 0px 0px 8px 0px lightgrey;
  .bottom {
    height: calc(100vh - 121px);
    color: #333;
    li {
      cursor: pointer;
      font-size: 14px;
      padding: 5px;
    }
    .active {
      background: #409eff;
      color: #fff;
    }
  }
  .treeHeader {
    &:hover {
      cursor: pointer;
    }
    width: 100%;
    height: 40px;
    text-align: left;
    text-indent: 1em;
    line-height: 40px;
    position: relative;
    i {
      font-size: 20px;
    }
    .icon-gengduo {
      display: none;
    }
    .dropdownAll {
      width: 10px;
      height: 10px;
      position: absolute;
      right: 30px;
      top: 0px;
    }
    &:hover .icon-gengduo {
      display: block;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    padding-left: 8px;
  }
  .highlight {
    background-color: #409eff;
    color: white;
  }
  .highlight .icon-gengduo {
    color: white;
  }
}
.rightContent {
  flex: 1;
  height: 100%;
  background: #fff;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
  .scollList {
    padding: 10px;
    color: #333;
    > div {
      display: inline-block;
    }
    .card {
      margin: 0 20px 15px 0;
      box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13),
        0 2px 4px rgba(0, 0, 0, 0.12);
      padding: 5px 5px 10px 5px;
      width: 160px;
      font-size: 12px;
      .imgWrapper {
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 150px;
        img {
          width: 150px;
          height: 150px;
          object-fit: contain;
          max-width: 150px;
          max-height: 150px;
        }
      }
      .detailWrapper {
        display: flex;
        margin-top: 5px;
        .name {
          width: 60%;
        }
        .commonRow {
          font-size: 12px;
          margin-bottom: 2px;
          > .label {
            width: 70px;
          }
        }
      }
      .buttonWrapper {
        display: flex;
        align-items: center;
      }
    }
  }
}
.moreWord {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
