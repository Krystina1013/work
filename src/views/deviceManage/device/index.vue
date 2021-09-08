<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <data-tree :page="page" :initFormHeader="initForm" :TreeData="TreeData" @handleBuildingId="handleBuildingId" @fetchData="fetchData" @getHouseTreeData="getHouseTreeData" :device="'device'" :hideHandle='true' />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <action-header :initFormHeader="initForm" :exportUrl="exportUrl" exportName="设备导出.xls" @fetchData="fetchData" :filterForm="filterForm" :filterStatus="false" :dialogCreate.sync="dialogCreate" :total="page.total" :moreStatus='false'>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="export">导出</el-dropdown-item>
                  </el-dropdown-menu>
                  <div slot="delBtn" v-if="selectVal.length > 1">
                    <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                      批量解绑
                    </el-button>
                  </div>
                </action-header>
              </el-col>
            </el-row>
            <el-table :data="list_data" stripe border v-loading="showLoading" height="65vh" highlight-current-row @selection-change="handleSelectionChange" @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange">
              <el-table-column v-if="globalUpdateStatus" align="center" type="selection" width="50"></el-table-column>
              <el-table-column align="center" class="indexNum" type="index" label="序号" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                  <!-- <div v-if="globalUpdateStatus" class="fun-btn">
                    <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                      <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                        <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                      </el-tooltip>
                      <el-dropdown-menu slot="dropdown">
                        <div v-if="!deleteForm.data.length" @click="editDeviceName(scope.row)">
                          <el-dropdown-item command="update">修改</el-dropdown-item>
                        </div>
                        <el-dropdown-item :command="returnCommand('delete', scope.row)">{{ deleteForm.data.length ? "批量解绑" : "解绑" }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div> -->
                </template>
              </el-table-column>

              <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="设备名字" width="180">
                <template slot-scope="scope">
                  <el-button @click="showDetails(scope.row)" type="text">
                    {{
                        scope.row.name
                        }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="inOut" label="设备进出" width="90">
              </el-table-column>
              <el-table-column align="center" prop="type" label="状态">
                <template slot-scope="scope">
                  <span :style="{
                          color: scope.row.status === 'online' ? '#67c23a' : '#f56c6c'
                        }">{{ scope.row.status === "online" ? "正常" : "离线" }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="绑定位置">
                <template slot-scope="{ row }">
                  <span>{{ row.bindingAddress }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="serialNumber" min-width="100" label="设备序列号"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" prop="clientIp" label="ip"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="upTime" min-width="110" label="最近上线时间">
                <template slot-scope="{ row }">
                  <span>{{row.upTime | deviceTime}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="downTime" min-width="110" label="最近离线时间">
                <template slot-scope="{ row }">
                  <span>{{row.downTime | deviceTime}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="bindTime" label="设备添加时间" min-width="110" :show-overflow-tooltip="true">
                <template slot-scope="{ row }">
                  <span>{{ row.bindingTime || "" }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
                <template slot-scope="{ row }">
                  <span class="rowUpdate" v-if="!row.noteStatus" @click="editNote(row, 'note', 'noteStatus')">{{ row.note || "--" }}</span>
                  <el-input v-else size="mini" ref="note" :maxlength="200" @blur="noteBlur(row, 'note', 'noteStatus')" v-model="row.note" :clearable="true" placeholder="输入备注"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center" v-if="globalUpdateStatus">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="editDeviceName(scope.row)">编辑</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">解绑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :page-size="page.limit" style="margin-top:10px;" background layout="prev, pager, next" :total="page.total"></el-pagination>
          </div>
        </template>
      </split-pane>
    </div>

    <el-dialog class="newDialog" width="1000px" :title="detailDialogForm.name" :visible.sync="detailDialogVisible" :close-on-click-modal="false">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
          <el-form label-width="100px" :model="detailDialogForm">
            <el-form-item class="marginForm" label="设备序列号:">
              <span>{{ detailDialogForm.serialNumber }}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="所属单元信息:">
              <span>{{ detailDialogForm.bindingAddress }}</span>
            </el-form-item>

            <el-form-item class="marginForm" label="门禁类型:">
              <span>{{ detailDialogForm.type | devTypes }}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="设备进出:">
              <span>{{ detailDialogForm.inOut }}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="IP:">
              <span>{{ detailDialogForm.clientIp }}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="状态:">
              <span :style="{
                  color:
                    detailDialogForm.status === 'online' ? '#67c23a' : '#f56c6c'
                }">
                {{
                detailDialogForm.status === "online" ? "正常" : "离线"
                }}
              </span>
            </el-form-item>
            <el-form-item class="marginForm" label="上线时间:">
              <span>{{ detailDialogForm.upTime || "" }}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="设备绑定时间:">
              <span>{{ detailDialogForm.bindingTime || "" }}</span>
            </el-form-item>
            <el-form-item class="marginForm" label="最后离线时间:">
              <span>{{ detailDialogForm.downTime || "" }}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane v-if="detailDialogForm.type === '1' || detailDialogForm.type === '2'" :label="currentTabLabel" name="second">
          <el-table v-show="detailDialogForm.type === '1'" :data="doorRecordTable" style="width: 100%" stripe border>
            <el-table-column align="center" prop="name" label="姓名" width="150px"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="passTime" label="通行时间" width="150px"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="通行地址"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" label="是否访客">
              <template slot-scope="{ row }">
                <span>{{ row.isVisitor ? "是" : "否" }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="抓拍人脸">
              <template slot-scope="scope">
                <img v-if="scope.row.photos" style="margin-top: 3px" @mouseout="twoImg.visible = false" @mouseover="showImg(scope)" :src="scope.row.photos" />
              </template>
            </el-table-column>
          </el-table>
          <el-table v-show="detailDialogForm.type === '2'" :data="doorRecordTable" style="width: 100%" stripe border>
            <el-table-column align="center" prop="carNo" label="车牌" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="carType" label="车辆类型" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="ownerName" label="车主姓名" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="ownerPhone" label="车主电话" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="passTime" label="通行时间" show-overflow-tooltip></el-table-column>
            <el-table-column width="100" align="center" label="抓拍图片">
              <template slot-scope="scope">
                <img v-if="scope.row.photos" style="margin-top: 3px" @mouseout="twoImg.visible = false" @mouseover="showImg(scope)" :src="scope.row.photos" />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="passPageChange" :page-size="passPage.limit" style="margin-top:10px;" background layout="prev, pager, next" :total="passPage.total"></el-pagination>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加或修改弹出表单 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" :title="roleTitle === '0' ? '添加设备' : '修改设备'" :visible.sync="dialogCreate" width="510px" :before-close="handleClose">
      <el-form ref="Forms" :rules="rules" :model="Form" label-position="right" label-width="110px">
        <el-form-item class="phone-input" label="设备名字: " prop="name">
          <el-input clearable style="width:340px" placeholder="请输入设备名字" maxlength="80" v-model="Form.name"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="设备序列号: " prop="devSerial">
          <el-input @input="checkDevice" clearable style="width:340px" placeholder="请输入设备序列号" v-model="Form.devSerial"></el-input>
          <h5 style="height:20px;line-height:20px">{{ deviceType | devType }}</h5>
        </el-form-item>
        <el-form-item v-if="deviceType === '5'" class="phone-input" label="设备绑定编号: " prop="bindDevSerialNumber">
          <el-input clearable style="width:340px" placeholder="请输入设备绑定编号" v-model="Form.bindDevSerialNumber"></el-input>
        </el-form-item>
        <el-form-item class="phone-input" label="设备进出: " prop="inOut">
          <el-switch v-model="Form.inOut" active-text="进" inactive-text="出" active-color="#13ce66" inactive-color="#ff4949" active-value="进" inactive-value="出"></el-switch>
        </el-form-item>
        <el-form-item v-if="deviceType !== '5'" class="phone-input" label="绑定位置: " prop="bindingAddress">
          <el-input clearable style="width:240px" placeholder="点击右方设备绑定选择对应设备" v-model="Form.bindingAddress"></el-input>
          <el-button @click="deviceBindBtn">设备绑定</el-button>
        </el-form-item>
        <el-form-item class="phone-input" label="设备备注: " prop="note">
          <el-input clearable type="textarea" placeholder="请输入设备备注" style="width:340px" v-model="Form.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmBind" :loading='confirmLoading'>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设备绑定 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" width="600px" title="设备绑定" :visible.sync="deviceBindingVisible">
      <el-form :model="Form">
        <el-form-item label="设备区分:" :label-width="formLabelWidth">
          <el-select @change="bindingTypeChange" style="width:310px;" v-model="Form.bindingType" placeholder="请选择设备区分">
            <el-option v-show="deviceType != 'ENTER_EXIT'" label="单元楼" value="BUILDING"></el-option>
            <el-option label="出入口" value="ENTER_EXIT"></el-option>
            <el-option label="房屋" v-show="deviceType != 'ENTER_EXIT'" value="HOUSE"></el-option>
            <el-option label="通道口" v-show="deviceType != 'ENTER_EXIT'" value="PASSAGE_WAY"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table v-show="Form.bindingType != 'HOUSE'" height="400px" :data="deviceBindingData" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="locationName" align="center" label="地址" v-if='Form.bindingType=="BUILDING"'></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="地址" v-if='Form.bindingType=="ENTER_EXIT"'></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="buildingName" align="center" label="楼栋" v-if='Form.bindingType=="PASSAGE_WAY"'></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="name" align="center" label="通道口" v-if='Form.bindingType=="PASSAGE_WAY"'></el-table-column>
        <el-table-column prop="note" :show-overflow-tooltip="true" align="center" label="备注">
          <template slot-scope="{ row }">
            <span>{{ row.note || "暂无" }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="address" align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button :style="{ color: row.bindStatus ? 'red' : '#409EFF' }" type="text" @click="bindDevice(row)">{{ row.bindStatus ? "当前绑定" : "点击绑定" }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table ref="filterTable" v-show="Form.bindingType == 'HOUSE'" height="400px" :data="deviceBindingData4" style="width: 100%" @filter-change="filterChange">
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column column-key="buildName" :filters="filterList4_building" :filter-method="filterHandler" :show-overflow-tooltip="true" align="center" label="楼栋" prop="buildName">
        </el-table-column>
        <el-table-column column-key="storey" :filters="filterList4_storey" :filter-method="filterHandler" :show-overflow-tooltip="true" prop="storey" align="center" label="楼层"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="serialNumber" align="center" label="房间"></el-table-column>
        <el-table-column prop="note" :show-overflow-tooltip="true" align="center" label="备注">
          <template slot-scope="{ row }">
            <span>{{ row.note || "暂无" }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="address" align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button size="small" :style="{ color: row.bindStatus ? 'red' : '#409EFF' }" type="text" @click="bindDevice(row)">{{ row.bindStatus ? "当前绑定" : "点击绑定" }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 设备地址选择 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" title="选取设备地址" :visible.sync="mapVisible">
      <el-input clearable v-model="Form.address" placeholder="输入设备地址"></el-input>
      <BaiduMap @pointClick="pointClick" :keyword="Form.address" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="mapVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="mapVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设备名称 -->
    <el-dialog class="newDialog" title="修改设备" :visible.sync="dialogEdit" width="510px" :before-close="closeDialogName" :close-on-click-modal="false">
      <el-form ref="dataForm" :model="editForm" label-position="right" label-width="100px" style="margin-right:40px;">
        <el-form-item label="设备序列号:" prop="name" :show-message="showMessage" :error="errorMessage.name">
          <span>{{ editForm.serialNumber }}</span>
        </el-form-item>

        <el-form-item v-if="deviceType !== '3'" class="phone-input" label="绑定位置: " prop="bindingAddress">
          <span>{{ editForm.bindingAddress }}</span>
        </el-form-item>

        <el-form-item label="设备名称:" prop="name" :show-message="showMessage" :error="errorMessage.name">
          <el-input v-model="editForm.name" placeholder="请输入设备名称" :maxlength="10" @input="constraintLength(editForm.name, '10')" clearable></el-input>
        </el-form-item>

        <el-form-item label="备注:" prop="note" :show-message="showMessage" :error="errorMessage.note">
          <el-input v-model="editForm.note" placeholder="请输入设备备注" :maxlength="10" @input="constraintLength(editForm.note, '10')" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialogName">取 消</el-button>
        <el-button size="small" type="primary" @click="modifDeviceName">确 定</el-button>
      </span>
    </el-dialog>
    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import config from "@/api/config";
import {
  createDevice,
  checkdeviceByNum,
  editDeviceName,
} from "@/api/deviceApi.ts";
import axios from "axios";
import {
  searchHouse,
  getInoutList,
  getHouseTreeData,
  getZoom,
  getPassageway,
} from "@/api/houseApi.ts";
import { getUserPass, getCarPass } from "@/api/peopleApi.ts";
import { getScene } from "@/api/screenApi.ts";
import Cookie from "js-cookie";
import splitPane from "vue-splitpane";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const BaiduMap = () => import("@/components/baiduMap/index.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
const DataTree = () => import("@/components/DataTree.vue");

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    BaiduMap,
    BigImg,
    TwoImg,
    splitPane,
    DataTree,
  },
  filters: {
    devType(val: string) {
      const data = {
        "1": "门禁",
        DOOR: "门禁",
        "2": "车禁",
        "3": "注册机",
        "4": "访客机",
        "5": "摄像头",
        "6": "华为摄像头",
      };
      return data[val] ? `此设备序列号对应的是${data[val]}设备` : "未找到设备";
    },
    devTypes(val: string) {
      const data = {
        DOOR: "门禁",
        "2": "车禁",
        "3": "注册机",
        "4": "访客机",
        "5": "摄像头",
        "6": "华为摄像头",
      };
      return data[val] + "设备";
    },
    deviceTime(val: string) {
      val = val.split(".")[0];
      return val;
    },
  },
})
export default class DeviceManage extends Vue {
  private rowSpan: number = 12;
  TreeData: Array<Object> = []; // 树形结构数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private confirmLoading: Boolean = false; //
  private bigImg: String = ""; // 保存放大图片的地址
  twoImg: any = {
    visible: false,
    leftTitle: "",
    rightTitle: "",
    leftImg: "",
    rightImg: "",
  };
  filterForm: object = {
    // loc: "",
    // deviceStatus: "",
    buildings: [],
  }; // 筛选条件
  initForm: object = {
    url: config.v2 + "/admin/dev-device-info/page-query",
    method: "get",
  };
  exportUrl: string = `${config.v2}/admin/dev-device-info/export`;
  selectVal: Array<object> = []; //选中的表格数据
  deleteForm: object = {
    url: config.v5 + "/admin/device-link/unbind",
    method: "delete",
    data: [],
    message: "此操作将永久解绑选中的设备,请谨慎操作!",
  };
  passPage: object = {
    total: 1,
    limit: 10,
    page: 1,
  };
  mapVisible: boolean = false; // 地图显示框状态
  activeName: string = "first";
  detailDialogVisible: boolean = false; // 设备详情dialog弹框状态
  private formLabelWidth: String = "120px";
  detailDialogForm: Object = {}; // 设备详情
  doorRecordTable: Array<Object> = []; // 设备抓拍的通行记录
  currentTabLabel = "门禁记录";
  private roleTitle: String = "0";
  private Form: Object = {
    // 创建设备表单
    // address: "四川省成都市",
    bindingId: "",
    bindingAddress: "",
    bindingType: "BUILDING",
    inOut: "进",
    name: "",
    // latitude: "",
    // longitude: "",
    note: "",
    devSerial: "",
    // subAddress: "",
    bindDevSerialNumber: "",
  };
  deviceType: string = ""; // 设备类型
  deviceBindingVisible: boolean = false; // 设备绑定dialog状态
  deviceBindingData: Array<Object> = [];
  rules: object = {
    name: [{ required: true, message: "请输入设备名字", trigger: "blur" }],
    devSerial: [
      { required: true, message: "请输入设备序列号", trigger: "blur" },
    ],
    address: [
      { required: true, message: "请输入设备所在位置", trigger: "blur" },
    ],
    bindingAddress: [
      { required: true, message: "请选择设备绑定位置", trigger: "blur" },
    ],
    bindDevSerialNumber: [
      { required: true, message: "请填写设备绑定编号", trigger: "blur" },
    ],
  };
  deviceId: string = "";
  devId: string = "";

  private showMessage: Boolean = true; //是否显示表单错误信息
  private errorMessage: Object = {
    // 表单错误信息
    name: "",
  };
  private dialogEdit: Boolean = false; // 修改弹出表单
  private editInfo: Object = {}; //保存初始值
  private editForm: Object = {
    //修改表单字段
    id: "",
    name: "",
    note: "",
    devSerial: "",
    address: "",
    bindingAddress: "",
    latitude: "",
    longitude: "",
    serialNumber: "",
  };

  updateArray: Array<string> = ["noteStatus"];
  private editData: String = ""; //行内修改 保存未改变的值
  houseFilter: any = {
    page: 1,
    limit: 10000,
    serialNumber: "",
  };
  deviceBindingData4: Array<Object> = [];
  filterList4_building: any = [];
  filterList4_storey: any = [];
  accessData: any = [];
  checkDevice(e) {
    Cookie.set("error", Date.now(), {
      expires: new Date(new Date().getTime() + 3 * 1000),
    }); // 五秒钟内不会重复出现提示框
    checkdeviceByNum(e)
      .then((res) => {
        this.deviceType = res.data.data.type;
        this.devId = res.data.data.id;
        this.Form["bindingAddress"] = "";
      })
      .catch(() => {
        this.deviceType = "";
        this.devId = "";
        this.Form["bindingAddress"] = "";
      });
  }
  // 表格选择
  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
  }
  created() {
    this.getHouseTreeData();
    this.fetchBuilding();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.fetchScene();
    this.getZoom();
    // this.getAccess();
  }
  getAccess() {
    getPassageway().then((res) => {
      console.log(res.data.data);
      this.deviceBindingData = res.data.data;
    });
  }
  showImg(scope) {
    this.twoImg.visible = true;
    this.twoImg.leftImg = scope.row.photos;
    this.twoImg.leftTitle = "抓拍图片";
    this.twoImg.rightImg = scope.row.facePhone;
    this.twoImg.rightTitle = "注册人脸";
  }
  // 获取场景信息
  fetchScene() {
    getScene().then((res) => {
      this.Form["address"] = res.data.data.address;
      this.Form["latitude"] = res.data.data.latitude;
      this.Form["longitude"] = res.data.data.longitude;
    });
  }
  /** 获取经纬度 */
  getlocLat() {
    this["$jsonp"]("http://api.map.baidu.com/geocoder/v2/", {
      address: this.Form["address"],
      output: "json",
      pois: "0",
      coordtype: "wgs84ll",
      callback: "renderReverse",
      ak: "vCZU88Guz4BmAODWTm8k9BP0WlwId1V0",
    }).then((res) => {
      if (res.status === 0) {
        this.Form["longitude"] = res.result.location.lng;
        this.Form["latitude"] = res.result.location.lat;
      } else {
        this["message"]("error", `没有找到对应的位置信息`);
        this.Form["longitude"] = "";
        this.Form["latitude"] = "";
      }
    });
  }
  // 点击地图选取地址
  pointClick(Object: object) {
    this.Form["address"] =
      Object["province"] +
      Object["city"] +
      Object["district"] +
      Object["street"];
    this.Form["latitude"] = Object["lat"];
    this.Form["longitude"] = Object["lng"];

    this.editForm["address"] =
      Object["province"] +
      Object["city"] +
      Object["district"] +
      Object["street"];
    this.editForm["latitude"] = Object["lat"];
    this.editForm["longitude"] = Object["lng"];
  }
  // 获取单元楼列表
  fetchBuilding() {
    searchHouse().then((res) => {
      res.data.data.forEach((element) => {
        this.$set(element, "bindStatus", false);
      });
      this.deviceBindingData = res.data.data;
    });
  }
  // 获取房屋
  getZoom() {
    getZoom(this.houseFilter).then((res) => {
      if (res.data.code === 200) {
        this.deviceBindingData4 = res.data.data.records;
        this.deviceBindingData4.map((item: any) => {
          item.buildName = item.groupName + "-" + item.buildingName;
          item.bindStatus = false;
        });
        let officeBuildingNameList = [
          ...new Set(
            this.deviceBindingData4.map((item: any) => item.buildName)
          ),
        ];
        let storeyList = [
          ...new Set(this.deviceBindingData4.map((item: any) => item.storey)),
        ];
        this.filterList4_building = officeBuildingNameList.map((item: any) => {
          return {
            text: item,
            value: item,
          };
        });
        storeyList.sort((a, b) => a - b);
        this.filterList4_storey = storeyList.map((item: any) => {
          return {
            text: item,
            value: item,
          };
        });
      } else {
        this["message"]("error", `获取数据失败`);
      }
    });
  }
  filterChange(filters) {
    if (filters.officeBuildingName) {
      if (filters.officeBuildingName.length) {
        let storeyList: any = [];
        filters.officeBuildingName.map((item) => {
          let list = this.deviceBindingData4.filter(
            (item1: any) => item1.officeBuildingName == item
          );
          storeyList.push(...list.map((item2: any) => item2.storey));
        });
        this.filterList4_storey = [...new Set(storeyList)].map((item: any) => {
          return {
            text: item,
            value: item,
          };
        });
      } else {
        let storeyList = [
          ...new Set(this.deviceBindingData4.map((item: any) => item.storey)),
        ];
        this.filterList4_storey = storeyList.map((item: any) => {
          return {
            text: item,
            value: item,
          };
        });
      }
      this.$refs.filterTable["clearFilter"]("storey");
    }
  }
  filterHandler(value, row, column) {
    const property = column["property"];
    return row[property] === value;
  }
  deviceBindBtn() {
    if (!this.Form["devSerial"]) {
      this.$message.error("请先输入设备序列号");
      return;
    }
    if (!this.deviceType) {
      this.$message.error("设备不存在或者已被绑定");
      return;
    }
    if (this.deviceType == "ENTER_EXIT") {
      this.Form["bindingType"] = "ENTER_EXIT";
      this.fetchInputList();
    }
    this.deviceBindingVisible = true;
    this.deviceBindingData.forEach((ele) => {
      if (ele["id"] === this.Form["bindingId"]) {
        this.$set(ele, "bindStatus", true);
      } else {
        ele["bindStatus"] = false;
      }
    });
  }
  // 绑定设备
  bindDevice(row) {
    if (row.bindStatus) {
      return (row.bindStatus = false);
    }

    if (this.Form["bindingType"] == "HOUSE") {
      this.deviceBindingData4.forEach((ele) => {
        ele["bindStatus"] = false;
      });
    } else {
      this.deviceBindingData.forEach((ele) => {
        ele["bindStatus"] = false;
      });
    }
    row.bindStatus = true;
    this.Form["bindingId"] = row.id;
    this.Form["bindingAddress"] = row.locationName || row.name;
    this.deviceBindingVisible = false;
  }
  // 获取出入口列表
  fetchInputList() {
    getInoutList().then((res) => {
      res.data.data.forEach((element) => {
        this.$set(element, "bindStatus", false);
      });
      this.deviceBindingData = res.data.data;
    });
  }
  // 切换单元楼/出入口
  bindingTypeChange(val: string) {
    this.deviceBindingData = [];
    if (val == "ENTER_EXIT") {
      this.fetchInputList();
    } else if (val == "BUILDING") {
      this.fetchBuilding();
    } else if (val == "HOUSE") {
      this.getZoom();
    } else if (val == "PASSAGE_WAY") {
      this.getAccess();
    }
    // return val === "BUILDING" ? this.fetchBuilding() : this.fetchInputList();
  }
  // 确定绑定设备
  confirmBind() {
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        // if (this.Form["longitude"] === "" || this.Form["latitude"] === "") {
        //   return this["message"]("error", `请输入正确的设备地址`);
        // } else {
        let param = { ...this.Form };
        param["devId"] = this.devId;
        this.confirmLoading = true;
        createDevice(param)
          .then((res) => {
            if (res.data.code === 200) {
              this["handleClose"]();
              this["fetchData"](this.initForm);
            }
            this.confirmLoading = false;
          })
          .catch((err) => {
            this.confirmLoading = false;
          });
        // }
      }
    });
  }
  handleClose() {
    for (let key in this.Form) {
      this.Form[key] = "";
    }
    this.Form["bindingType"] = "BUILDING";
    this.Form["inOut"] = "出";
    this.$refs["Forms"]["resetFields"]();
    this["dialogCreate"] = false;
    this.fetchScene();
    this.deviceType = "";
  }
  /*** 查看设备详情*/
  showDetails(row) {
    this.activeName = "first";
    this.passPage["page"] = 1;
    this.detailDialogVisible = true;
    this.deviceId = row.id;
    this.detailDialogForm = Object.assign({}, row);
    // this.deviceRecord(1);
  }
  // 门禁通行记录翻页
  passPageChange(page) {
    this.passPage["page"] = page;
    this.deviceRecord(page);
  }
  // 查看该设备的抓拍记录
  deviceRecord(page: number) {
    if (this.detailDialogForm["type"] == 1) {
      this.currentTabLabel = "门禁记录";
      getUserPass({ deviceId: this.deviceId, page, limit: 10 }).then((res) => {
        this.doorRecordTable = res.data.data.records;
        this.passPage["total"] = res.data.data.total;
      });
    } else {
      this.currentTabLabel = "车禁记录";
      getCarPass({ devId: this.deviceId, page, limit: 10 }).then((res) => {
        this.doorRecordTable = res.data.data.records;
        this.passPage["total"] = res.data.data.total;
      });
    }
  }

  editDeviceName(item) {
    /**@description 修改设备名称 */
    this.editInfo = item;
    for (const key in this.editForm) {
      this.editForm[key] = item[key];
    }
    this.dialogEdit = true;
  }

  modifDeviceName() {
    /**@description 修改 */
    const form = { ...this.editForm };
    for (let key in form) {
      if (form[key] === "") {
        delete form[key];
      }
    }
    editDeviceName(form).then(() => {
      this.closeDialogName();
      this["fetchData"](this.initForm);
      this["message"]("success", `修改设备名称成功`);
    });
    return;
  }

  closeDialogName() {
    /** @description 关闭添加/修改dialog */
    this.dialogEdit = false; //修改dialog
    this.$refs["dataForm"]["resetFields"]();
  }

  editNote(row, value, type) {
    /**@description 点击备注*/
    this.editData = row[value];
    this.editForm[value] = row[value];
    this.editForm["id"] = row.id;
    row[type] = !row[type];
    this.$nextTick(() => {
      const input = this.$refs[value] as HTMLElement;
      input.focus();
    });
  }

  // 修改备注离开输入框
  noteBlur(row, value, type) {
    row[type] = false;
    if (this.editData !== row[value]) {
      const form = { [value]: row[value], id: row.id };
      editDeviceName(form)
        .then(() => {
          this["message"]("success", `修改设备备注成功!`);
          this.fetchData(this.initForm);
        })
        .catch(() => {
          row[value] = this.editData;
        });
    }
  }

  handleBuildingId(data) {
    /**@description 获取宿舍楼id */
    // let buildings:any=[];
    // if(data.type=='group'){
    //   if(data.subBuildings){
    //     data.subBuildings.map(item=>{
    //       buildings.push(item.id)
    //     })
    //   }
    // }else{
    //   buildings=[data.id]
    // }
    // this.filterForm['buildings']=buildings;
  }
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
      // this.rules["buildingId"].push({
      //   required: true,
      //   trigger: "change",
      //   validator: (rule, value, callback) => {
      //     if (!this.Form["buildingIdArr"].length) {
      //       callback(new Error("请先创建分组和单元楼"));
      //     } else {
      //       callback();
      //     }
      //   }
      // });
    });
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
  width: 60px;
}
.marginForm {
  float: left;
  width: 50%;
  margin-bottom: 0px;
}
</style>
