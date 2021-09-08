<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" :min-percent="10" :default-percent="15">
        <template slot="paneL">
          <div class="leftContent">
            <DataTree @fetchData="fetchData" :page="page" @getHouseTreeData='getTreeData' :TreeData="TreeData" :initFormHeader="initForm" @handleBuildingId="handleGroupId" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <ActionHeader :initFormHeader="initForm" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus="false" :pageStatus="true" :police="true" @clearFilter="clearFilterForm" btnStatus="0">
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">设备名称:</span>
                      <el-input clearable placeholder="请输入需要查找的设备名称" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.name" size="small" :maxlength="30"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">IP地址:</span>
                      <el-input clearable placeholder="请输入查找的IP地址" @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.activeIp" size="small" :maxlength="30"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">状&nbsp;&nbsp;&nbsp;态:</span>&nbsp;&nbsp;
                      <el-select v-model="filterForm.liveStatus" placeholder="请选择" class="select-class" size="small">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">厂&nbsp;&nbsp;&nbsp;商:</span>&nbsp;&nbsp;
                      <el-select v-model="filterForm.vendor" placeholder="请选择" class="select-class" size="small">
                        <el-option v-for="item in vendorList" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </div>
                  </div>
                </ActionHeader>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24" class="table-col">
                <el-table ref="table" :data="tableData" stripe border highlight-current-row @sort-change="sortChange" v-loading="tableLoading" @cell-click="tableDbEdit" @cell-mouse-enter="enterCellChange" @cell-mouse-leave="leaveCellChange">
                  <el-table-column type="index" align="center" class="indexNum" label="序号" width="50">
                    <template slot-scope="scope">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="设备名称" min-width="100" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-input size="small" v-model="scope.row.name" :maxlength="30" v-if="showInput == `name${scope.row.id}`" v-focus @blur="blurInput(scope.row, 'name' , scope.row.name)"></el-input>
                      <span v-else class="showIconBtn">
                        <i class="el-icon-edit-outline" :style="{'color':(scope.row.id==rowId && showProperty == 'name')?'':'transparent'}" @click="getFocus(scope.row, 'name')"></i>
                        {{ scope.row.name || "--" }}
                      </span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="bindAddress" label="绑定位置" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                      {{ scope.row.bindAddress }}
                      <img class="myFont" v-if="scope.row.inOut == 'out'" src='../../../assets/out.png' />
                      <img class="myFont" v-if="scope.row.inOut == 'in'" src='../../../assets/in.png' />
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="typeDesc" label="型号" show-overflow-tooltip align="center"></el-table-column>
                  <el-table-column prop="activeIp" label="IP地址" width="90" show-overflow-tooltip align="center" sortable='custom'></el-table-column>
                  <el-table-column prop="ipAddr" label="设备id" show-overflow-tooltip align="center"></el-table-column>
                  <el-table-column prop="cameraGroupName" label="所属分组" show-overflow-tooltip align="center"></el-table-column>
                  <el-table-column prop="vendor" label="厂商" show-overflow-tooltip align="center"></el-table-column>
                  <el-table-column prop="aiEnable" label="AI能力" show-overflow-tooltip align="center" width="80">
                    <template slot-scope="scope">
                      <div>
                        <span v-if="scope.row.aiEnable === 'on'">开启</span>
                        <span v-if="scope.row.aiEnable === 'off'">关闭</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" show-overflow-tooltip align="center" width="80">
                    <template slot-scope="scope">
                      <div>
                        <span v-if="scope.row.liveStatus === 'on'">在线</span>
                        <span v-if="scope.row.liveStatus === 'off'">离线</span>
                        <span v-if="scope.row.liveStatus === 'failed'">配置错误</span>
                        <span v-if="scope.row.liveStatus === 'none'">无直播</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                      <div class="table-btn">
                        <el-button type="text" size="mini" @click="viewVideo(scope.row)" v-if="scope.row.liveStatus == 'on'">实况</el-button>
                        <!-- <el-button type="text" size="mini" @click="deviceBindBtn(scope.row)" v-if="!scope.row.bindId">绑定位置</el-button> -->
                        <!-- <el-divider direction="vertical" v-if="!scope.row.bindId"></el-divider> -->
                        <!-- <el-button type="text" size="mini" @click="deviceOffBind(scope.row)" v-if="!!scope.row.bindId">解除绑定</el-button> -->
                        <el-divider direction="vertical" v-if="scope.row.liveStatus == 'on'"></el-divider>
                        <el-button type="text" size="mini" v-if="!scope.row.isClassroom && !scope.row.bindId" @click="warnSetBtn(scope.row)">预警设置</el-button>
                        <el-divider direction="vertical" v-if="!scope.row.isClassroom && !scope.row.bindId"></el-divider>
                        <el-button type="text" size="mini" style="margin-left:0" @click="editName(scope.row)">编辑</el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination :page-size="pageSize" :current-page='page["page"]' @current-change="pageChange" style="margin-top: 10px" background layout="prev, pager, next" :total="tableTotal"></el-pagination>
              </el-col>
            </el-row>
          </div>
        </template>
      </split-pane>
    </div>
    <el-dialog class="video-dialog" :title="'实况：' + currentPlayCamera.name" :visible.sync="dialogVisible" :before-close="handleClose">
      <Reflv data-name="single" v-show="reflvUrl" :style="{ width: '840px', height: '540px',margin: '0 auto' }" :name="'single'" :url="reflvUrl" ref="reflv" :isPc="isPc" />
    </el-dialog>

    <!-- 设备绑定 -->
    <!-- <el-dialog class="newDialog" :close-on-click-modal="false" width="1000px" title="设备绑定" :before-close="handleCloseBind" :visible.sync="deviceBindingVisible">
      <el-form :model="Form">
        <el-form-item label="设备位置区分：" :label-width="formLabelWidth">
          <el-select @change="bindingTypeChange" style="width: 310px" v-model="Form.bindingType" placeholder="请选择设备位置区分">
            <el-option label="宿舍楼" value="BUILDING"></el-option>
            <el-option label="出入口" value="ENTER_EXIT"></el-option>
            <el-option label="教室" value="CLASS_ROOM"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出入类型：" :label-width="formLabelWidth" v-if="Form.bindingType === 'ENTER_EXIT'">
          <el-switch v-model="Form.inOut" active-text="进" inactive-text="出" active-color="#13ce66" inactive-color="#ff4949" active-value="in" inactive-value="out"></el-switch>
        </el-form-item>
      </el-form>
      <el-row v-if="Form.bindingType == 'CLASS_ROOM'">
        <el-col :span="6" class="tree-class">
          <el-tree :expand-on-click-node="false" node-key="name" :current-node-key="currentNodeKey" :default-expanded-keys="defaultExpandedKeys" highlight-current :data="treeData" :props="{ children: 'subBuildings', label: 'name' }" @node-click=" pagination.page = 1; currentNode = $event; getTableData();"></el-tree>
        </el-col>
        <el-col :span="18">
          <el-table height="400px" :data="classTableData" border stripe size="small">
            <el-table-column type="index" label="序号" align="center" width="72"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="locationName" align="center" label="教室名称" v-show="Form.bindingType == 'CLASS_ROOM'"></el-table-column>
            <el-table-column prop="note" :show-overflow-tooltip="true" align="center" label="备注">
              <template slot-scope="{ row }">
                <span>{{ row.note || "暂无" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" align="center" label="操作" width="155">
              <template slot-scope="{ row }">
                <el-button :style="{ color: '#409EFF' }" type="text" v-if="!row.bindStatus" @click="bindDevice(row)">{{ "点击绑定" }}</el-button>
                <el-button :style="{ color: '#f56c6c' }" type="text" v-else>{{
                  "已绑定"
                }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin-top: 15px; margin-left: 15px" @size-change=" pagination.pageSize = $event; getTableData();" @current-change=" pagination.page = $event; getTableData();" :page-sizes="$constant.pagination.pageSizes" :page-size="pagination.pageSize" layout="prev, pager, next, jumper, total, sizes" :total="pagination.total"></el-pagination>
        </el-col>
      </el-row>

      <el-table height="400px" :data="deviceBindingData" border stripe v-else size="small">
        <el-table-column type="index" label="序号" align="center" width="72"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="locationName" align="center" label="地址" v-if="Form.bindingType == 'BUILDING'"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="地址" v-if="Form.bindingType == 'ENTER_EXIT'"></el-table-column>
        <el-table-column prop="note" :show-overflow-tooltip="true" align="center" label="备注">
          <template slot-scope="{ row }">
            <span>{{ row.note || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" align="center" label="操作" width="155">
          <template slot-scope="{ row }">
            <el-button :style="{ color: '#409EFF' }" type="text" v-if="!row.bindStatus" @click="bindDevice(row)">{{ "点击绑定" }}</el-button>
            <el-button :style="{ color: '#f56c6c' }" type="text" v-else>{{ "已绑定" }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseBind">取 消</el-button>
        <el-button size="small" style="margin-left:18px" type="primary" @click="confirmBind" :loading="confirmLoading">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 预警设置 -->
    <el-dialog class="newDialog" width="600px" title="预警设置" :visible.sync="dialogWarnVisible" :before-close="handleCloseWarn">
      <div>
        <p style="margin-bottom:20px">需要选择得预警类型：</p>
        <div class="flex">
          <div class="earlyWarn">
            <p>
              <el-checkbox label="陌生人预警" v-model="warnUnknow"></el-checkbox>
            </p>
            <p style="margin-top: 20px">
              <el-checkbox label="关注人员预警" v-model="warnCare"></el-checkbox>
            </p>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button size="small" @click="handleCloseWarn">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmWarn" :loading="warnLoading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分组编辑 -->
    <el-dialog class="newDialog" width="450px" title="分组编辑" :visible.sync="editDialog" :before-close="handleCloseEdit">
      <el-form :model="editForm">
        <el-form-item style="margin-bottom: 16px" label="摄像机名称：" prop="name">
          <el-input v-model.trim="editForm.name" style="width: 310px" :maxlength="30" placeholder="输入摄像机名称"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="摄像机分组：" prop="分组">
          <el-select @change="bindingTypeChange" style="width: 310px" v-model="editForm.groupId" placeholder="请选择摄像机分组">
            <el-option :label="item.name" :value="item.id" v-for='(item,i) in TreeData' :key='i'></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseEdit">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmEdit" :loading="editLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script >
import {
  getCamera,
  play,
  bindCamera,
  warnSet,
  getCameraTree,
  updateCameraGroup,
} from "@/api/police";
import {
  searchHouse,
  getInoutList,
  getBuildingTreeData,
  getZoom,
} from "@/api/houseApi";
import {
  getVendor,
  bindDeviceLink,
  unBindDeviceLink,
  editAddr,
  editName,
} from "@/api/deviceApi";
import { tr } from "date-fns/locale";
import splitPane from "vue-splitpane";
import mixin from "@/config/minxins";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const Reflv = () =>
  import("../../security/realTimeMonitor/components/Reflv.vue");
const DataTree = () => import("./components/DataTree.vue");
export default {
  mixins: [mixin],
  components: {
    ActionHeader,
    Reflv,
    DataTree,
    splitPane,
  },

  data() {
    return {
      isPc: true,
      height_w: window.innerHeight,
      width_w: window.innerWidth,
      tableLoading: false,
      filterForm: {
        name: "",
        liveStatus: "",
        activeIp: '',
        orderBy: '',
        asc: false,
        vendor: '',
      },
      initForm: {},
      statusOptions: [
        { value: "on", label: "在线" },
        { value: "off", label: "离线" },
        { value: "failed", label: "配置错误" },
        { value: "none", label: "无直播" }
      ], // 状态列表
      vendorList: [], // 厂商列表
      tableData: [],
      tableTotal: 0,
      pageSize: 10,
      page: {},
      showInput: "",
      oldData: {},
      rowId: '',
      showProperty: '',

      dialogCreate: false,
      currentPlayCamera: {}, // 实况
      dialogVisible: false,
      reflvUrl: "",

      deviceBindingVisible: false,
      Form: {
        bindingId: "",
        bindingType: "BUILDING",
        inOut: "",
      },
      currentNode: "",
      currentNodeKey: "所有",
      defaultExpandedKeys: ["所有"],
      treeData: [
        {
          name: "所有",
          id: "",
          subBuildings: [],
        },
      ],
      pagination: {
        show: false,
        total: 0,
        page: 1,
        pageSize: this["$constant"].pagination.pageSizes[0],
      },
      deviceBindId: "", // 摄像机id
      deviceBindingData: [],
      // classTableData: [],
      confirmLoading: false,
      formLabelWidth: "120px",
      cameraId: "", // 摄像机id
      warnLimit: "", // 预警图
      warnUnknow: false, // 陌生人预警
      warnCare: false, // 关注人员预警
      warnLoading: false, // 预警设置弹窗load
      editLoading: false, // 编辑弹窗load
      dialogWarnVisible: false, // 预警设置弹窗状态
      editDialog: false, // 编辑弹窗
      TreeData: [],
      // 编辑form
      editForm: {
        name: "",
        groupName: "",
        cameraIdsAdd: [],
      },
    };
  },

  directives: {
    // 通过自定义指令实现的表单自动获得光标的操作
    focus: {
      inserted: function (el) {
        if (el.tagName.toLocaleLowerCase() == "input") {
          el.focus();
        } else {
          if (el.getElementsByTagName("input")) {
            el.getElementsByTagName("input")[0].focus();
          }
        }
        el.focus();
      },
    },
  },

  created() {
    this["isPolice"] = true;
    this.getTreeData();
    this.getCameraList();
    this.check();
    this.getVendorList()
  },

  methods: {
    // 摄像机分组
    async getTreeData() {
      let { data } = await getCameraTree({});
      let treeData = [];
      if (data.data && data.data.length > 0) {
        treeData = this.initGrade(data.data);
        this.TreeData = treeData;
      }
    },

    getVendorList() {
      getVendor().then((res) => {
        this.vendorList = res.data.data
      })
    },
    enterCellChange(row, column, cell, event) {
      this.showProperty = column.property
      this.rowId = row.id
    },
    leaveCellChange(row, column) {
      this.showProperty = ''
      this.rowId = ''
    },

    async blurInput(row, name, value, column) {
      let obj = {};
      // 判断数据是否有所改变，如果数据有改变则调用修改接口
      if (this.oldData[name] === undefined && value == '') {
        this.showInput = "";
        return
      }
      if (this.oldData[name] != value) {
        obj[name] = value; //被改变的数据
        if (name == "name") {
          this.updateName(row, value, column);
        } else if (name == "addr") {
          this.updateAddr(row, value);
        }
      }
      this.showInput = "";
    },
    getFocus(row, name) {
      this.showInput = name + row.id
    },

    tableDbEdit(row, column, event) {
      this.oldData[column.property] = row[column.property];
    },

    clearFilterForm() {
      this.filterForm = {
        name: "",
        liveStatus: "",
        activeIp: "",
        orderBy: '',
        asc: false
      };
      this.page["page"] = 1;
      this.getCameraList();
    },

    check() {
      var os = (function () {
        var ua = navigator.userAgent,
          isWindowsPhone = /(?:Windows Phone)/.test(ua),
          isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
          isAndroid = /(?:Android)/.test(ua),
          isFireFox = /(?:Firefox)/.test(ua),
          isChrome = /(?:Chrome|CriOS)/.test(ua),
          isTablet =
            /(?:iPad|PlayBook)/.test(ua) ||
            (isAndroid && !/(?:Mobile)/.test(ua)) ||
            (isFireFox && /(?:Tablet)/.test(ua)),
          isPhone = /(?:iPhone)/.test(ua) && !isTablet,
          isPc = !isPhone && !isAndroid && !isSymbian;
        return {
          isTablet: isTablet,
          isPhone: isPhone,
          isAndroid: isAndroid,
          isPc: isPc,
        };
      })();
      if (os.isTablet) {
        this.isPc = false; // 平板
      } else if (os.isPc) {
        this.isPc = true; // pc
      }
    },

    fetchData(option) {
      this.pageSize = option.params.limit;
      this.page["page"] = option.params.page;
      this.getCameraList();
    },

    getCameraList() {
      let param = {
        ...this.filterForm,
        page: this.page["page"],
        pageSize: this.pageSize,
      };
      this.tableLoading = true;
      getCamera(param)
        .then((res) => {
          this.tableData = res.data.data.records;
          this.tableLoading = false;
          this["tableTotal"] = res.data.data.total;
          this.page["total"] = res.data.data.total;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },

    updateName(row, value, column) {
      editName({
        id: row.id,
        name: value,
        type: row.type,
        ipAddr: row.ipAddr,
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.fetchData(this.initForm);
          } else {
            this.$message({
              message: res.data.messa,
              type: "error",
            });
          }
        })
        .catch(() => {
          this.showInput = column.property + row.id;
        });
    },

    updateAddr(row, value) {
      editAddr({
        id: row.id,
        addr: value,
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.fetchData(this.initForm);
          } else {
            this.$message({
              message: res.data.messa,
              type: "error",
            });
          }
        })
        .catch(() => {
          this.fetchData(this.initForm);
        });
    },

    // 查看实况
    viewVideo(data) {
      this.currentPlayCamera = data;
      this.dialogVisible = true;
      this.playReflv(data.id);
    },
    //播放
    playReflv(id) {
      play({ id }).then((res) => {
        // debugger;
        this.reflvUrl = res.data.data;

        this.$nextTick(() => {
          this.$refs.reflv.reloadVideo();
        });
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.reflvUrl = null;
      this.$refs.reflv.flv_destroy();
    },

    // 绑定位置
    // deviceBindBtn(row) {
    //   this.Form["bindingType"] = "BUILDING";
    //   this.fetchBuilding();
    //   this.deviceBindingVisible = true;
    //   this.deviceBindId = row.id;
    //   this.deviceBindingData.forEach((ele) => {
    //     if (ele["id"] === this.Form["bindingId"]) {
    //       this.$set(ele, "bindStatus", true);
    //     } else {
    //       ele["bindStatus"] = false;
    //     }
    //   });
    // },

    async getTableData() {
      let param = {
        limit: this.pagination.pageSize,
        page: this.pagination.page,
        buildingId: this.currentNode ? this.currentNode.id || "" : "",
        type: "2",
      };
      let { data } = await getZoom(param);
      data = data.data;
      this.pagination.total = parseInt(data.total);

      data.records.map((item, i) => {
        data.records[i].type = 1;
        data.records[i].enableInviteVisitor = 1;
        data.records[i].enableRemoteOpen = 1;
        data.records[i].overTime = "";
        this.$set(item, "bindStatus", false);
        let obj = this.Form["bindingId"] == item.id;
        if (obj) {
          data.records[i].bindStatus = true;
        } else {
          data.records[i].bindStatus = false;
        }
      });
      this.classTableData = data.records;
    },
    // async getClassBuilding() {
    //   let { data } = await getBuildingTreeData({ buildingType: "2" });
    //   let treeData = [];
    //   if (data.data) {
    //     treeData = this.initGrade(data.data);
    //   }
    //   this.treeData = [
    //     {
    //       name: "所有",
    //       id: "",
    //       subBuildings: treeData,
    //     },
    //   ];
    // },
    initGrade(dataArr) {
      let arr = [];
      if (dataArr && dataArr.length > 0) {
        dataArr.forEach((item) => {
          arr.push({
            name: item["name"],
            id: item["id"],
          });
        });
      }
      return arr;
    },

    handleCloseBind() {
      this.currentNode = "";
      this.currentNodeKey = "所有";
      this.deviceBindingVisible = false;
      this.deviceBindId = "";
      this.classTableData = [];
      this.Form["deviceType"] = "BUILDING";
      this.Form["bindingId"] = "";
      this.Form["inOut"] = "";
    },

    // 绑定设备
    bindDevice(row) {
      if (row.bindStatus) {
        return (row.bindStatus = false);
      }
      this.deviceBindingData.forEach((ele) => {
        ele["bindStatus"] = false;
      });
      this.classTableData.forEach((ele) => {
        ele["bindStatus"] = false;
      });
      row.bindStatus = true;
      this.Form["bindingId"] = row.id;
    },

    // 获取宿舍楼列表
    fetchBuilding() {
      searchHouse("1").then((res) => {
        res.data.data.forEach((element) => {
          this.$set(element, "bindStatus", false);
        });
        this.deviceBindingData = res.data.data;
      });
    },
    // 切换单元楼/出入口
    bindingTypeChange(val) {
      if (val === "BUILDING") {
        this.fetchBuilding();
      } else if (val === "ENTER_EXIT") {
        this.fetchInputList();
      } else {
        // this.getClassBuilding();
        this.getTableData();
      }
    },
    // 获取出入口列表
    fetchInputList() {
      getInoutList().then((res) => {
        res.data.data.forEach((element) => {
          this.$set(element, "bindStatus", false);
        });
        this.deviceBindingData = res.data.data;
      });
    },

    // 确定绑定设备
    confirmBind() {
      if (!this.Form["bindingId"]) {
        this["message"]("error", `请选择绑定位置！`);
        return;
      }
      if (this.Form["bindingType"] === "BUILDING") {
        //宿舍楼
        this.confirmLoading = true;
        let dataObj = {
          bindId: this.Form["bindingId"],
          cameraIdsAdd: [this.deviceBindId],
        };
        bindCamera(dataObj)
          .then((res) => {
            this.confirmLoading = false;
            if (res.data.code === 200) {
              this["message"]("success", `摄像机绑定成功！`);
              this["handleCloseBind"]();
              this["fetchData"](this.initForm);
            }
          })
          .catch((error) => {
            this.confirmLoading = false;
          });
      } else {
        // 出入口
        this.confirmLoading = true;
        let dataObj = {
          bindId: this.Form["bindingId"],
          cameraId: this.deviceBindId,
          bindType: this.Form["bindingType"],
          inOut: this.Form["inOut"],
        };
        bindDeviceLink(dataObj)
          .then((res) => {
            this.confirmLoading = false;
            if (res.data.code === 200) {
              this["message"]("success", `摄像机绑定成功！`);
              this["handleCloseBind"]();
              this["fetchData"](this.initForm);
            }
          })
          .catch((error) => {
            this.confirmLoading = false;
          });
      }
    },

    // 解除绑定
    // deviceOffBind(row) {
    //   this.$confirm(`此操作将永久解绑选中的设备,请谨慎操作!是否继续?`, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       unBindDeviceLink({ cameraId: row.id, bindId: row.bindId }).then(
    //         (res) => {
    //           if (res.data.code === 200) {
    //             this.$message({
    //               message: "解绑成功",
    //               type: "success",
    //             });
    //             this["fetchData"](this.initForm);
    //           }
    //         }
    //       );
    //     })
    //     .catch(() => {
    //       this.$message({
    //         message: "已取消解绑",
    //         type: "error",
    //       });
    //     });
    // },

    // 预警设置
    warnSetBtn(row) {
      this.cameraId = row.id;
      this.warnUnknow = row.warnUnknow === 1;
      this.warnCare = row.warnCare === 1;
      if (row.warnLimit == null) {
        this.warnLimit = "goodface";
      } else {
        this.warnLimit = row.warnLimit;
      }
      this.dialogWarnVisible = true;
    },
    confirmWarn() {
      let objData = {
        cameraId: this.cameraId,
        warnUnknow: this.warnUnknow ? 1 : 0,
        warnCare: this.warnCare ? 1 : 0,
        warnLimit: this.warnLimit,
      };
      this.warnLoading = true;
      warnSet(objData)
        .then((res) => {
          this.warnLoading = false;
          if (res.data.code === 200) {
            this.handleCloseWarn();
            this.$message({
              message: "预警设置成功",
              type: "success",
            });
            this["fetchData"](this.initForm);
          }
        })
        .catch((error) => {
          this.warnLoading = false;
        });
    },
    handleCloseWarn() {
      this.dialogWarnVisible = false;
      this.warnCare = false;
      this.warnUnknow = false;
    },

    // 表头添加小图标的render 事件
    renderHeader(h, { column }) {
      return h("div", [
        h("span", column.label),
        h("i", {
          class: "el-icon-edit",
          style: "color:#409eff;margin-left:5px;",
        }),
      ]);
    },
    // 打开编辑弹窗
    editName(row) {
      this.editDialog = true;
      this.editForm = {
        name: row.name,
        id: row.id,
        groupId: row.cameraGroupId,
      };
    },
    // 编辑取消
    handleCloseEdit() {
      this.editDialog = false;
      this.editForm = {
        name: "",
        id: "",
        groupId: "",
        cameraIdsAdd: [],
      };
    },
    // 编辑确认
    confirmEdit() {
      this.editLoading = true;
      let params = {
        name: this.editForm.name,
        groupId: this.editForm.groupId,
        cameraIdsAdd: [this.editForm.id],
      };
      updateCameraGroup(params)
        .then((res) => {
          this.editLoading = false;
          if (res.data.code === 200) {
            this.$message({
              message: "编辑成功",
              type: "success",
            });
            this.editDialog = false;
            this["fetchData"](this.initForm);
          }
        })
        .catch((error) => {
          this.editDialog = false;
          this.editDialog = false;
        });
    },

    handleGroupId(data) {
      this.filterForm["groupId"] = data.id;
    },
    // 排序
    sortChange(option) {
      this.filterForm["orderBy"] = option.order === null ? "" : option.prop;
      this.filterForm["asc"] = option.order === "ascending";
      this.initForm["params"] = Object.assign(
        this.initForm["params"],
        this.page,
        this.filterForm
      ); // 合并参数
      this.fetchData(this.initForm);
    },
  },
};
</script>

<style lang="scss" scoped>
.myFont {
  width: 22px;
  height: 22px;
  vertical-align: center;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
}
.video-dialog {
  /deep/.el-dialog {
    width: 900px;
    .el-dialog__body {
      padding-top: 10px;
    }
  }
}

.tree-class {
  .el-tree {
    height: 447px;
    overflow-y: auto;
  }
}
</style>