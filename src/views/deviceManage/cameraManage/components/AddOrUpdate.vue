<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :width="`${(500 / width_w) * 100}%`"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            maxlength="32"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="抓拍类型">
          <div class="adr">
            <el-checkbox-group v-model="captureTypeList">
              <el-checkbox label="车辆抓拍"></el-checkbox>
              <el-checkbox label="人脸抓拍"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="摄像机类型" prop="type">
          <div class="adr">
            <el-select
              style="width: 300px"
              v-model="ruleForm.type"
              placeholder="请选择类型"
              @change="typeChange"
            >
              <el-option label="华为-SDC" :value="1"></el-option>
              <el-option label="IPC" :value="2"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item
          :label="ruleForm.type == 1 ? '设备编号' : '设备mac地址'"
          prop="ipAddr"
          v-if="ruleForm.type != ''"
        >
          <el-input
            v-model.number="ruleForm.ipAddr"
            maxlength="16"
            v-if="ruleForm.type == 1"
            style="width: 300px"
          ></el-input>
          <el-input
            v-model="ruleForm.ipAddr"
            maxlength="32"
            v-if="ruleForm.type == 2"
            style="width: 300px"
          ></el-input>
        </el-form-item>

        <el-form-item label="视频盒子" prop="boxId" v-if="ruleForm.type == 2">
          <div class="adr ipt flex">
            <el-input v-model="boxName" maxlength="32" disabled></el-input>
            <el-button
              size="small"
              type="primary"
              class="small-btn"
              @click.prevent="videoVisible = true"
            >
              选择
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="国标ID" >
          <el-input
            v-model="ruleForm.gbId"
            maxlength="200"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="国标ID设备密码" >
          <el-input
            v-model="ruleForm.devicePassword"
            maxlength="200"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="摄像机用户名" prop="username" v-if="ruleForm.type == 1">
          <el-input
            v-model="ruleForm.username"
            maxlength="32"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="摄像机密码" prop="password" v-if="ruleForm.type == 1">
          <el-input
            v-model="ruleForm.password"
            style="width: 300px"
            type="password"
            maxlength="32"
          ></el-input>
        </el-form-item>
        <el-form-item label="经纬度">
          <el-input
            v-model="gps.lng"
            maxlength="30"
            @input="gpsChange"
            placeholder="请输入经度"
            style="width: 145px"
          ></el-input>
          -
          <el-input
            v-model="gps.lat"
            maxlength="30"
            @input="gpsChange"
            placeholder="请输入纬度"
            style="width: 145px"
          ></el-input>
        </el-form-item>
        <el-form-item label="所在位置" prop="city">
          <div class="adr">
            <div>
              <el-button
                type="primary"
                icon="el-icon-location"
                class="btn"
                @click="openMapDialog"
                >定位</el-button
              >
              <p>{{ ruleForm.city }}</p>
            </div>
          </div>
          <div class="adr justify-content-between" style="margin-top: 10px"></div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="confirmAddCamera" :loading="load"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="选择视频盒子"
      :visible="videoVisible"
      :width="`${(800 / width_w) * 100}%`"
      :before-close="closeDialogVideo"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div>
        <el-table :height="height_w - 500" :data="tableData">
          <el-table-column type="index" width="60" label="序号"></el-table-column>
          <el-table-column prop="gbId" label="设备编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">在线</span>
              <span v-else-if="scope.row.status == 2">离线</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="table-btn">
                <span
                  :style="{
                    color: scope.row.selected ? '#de3434' : '#409EFF',
                  }"
                  @click="chooseVideoBox(scope.row)"
                  >{{ scope.row.selected ? "当前选择" : "选择" }}</span
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 15px; margin-left: 15px"
          @size-change="
            pagination.pageSize = $event;
            gotoTheFirstPage();
          "
          @current-change="
            pagination.page = $event;
            getBoxList();
          "
          :page-sizes="$constant.pagination.pageSizes"
          :page-size="pagination.pageSize"
          layout="prev, pager, next, total, sizes"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      title="选择摄像机地址"
      :visible="mapVisible"
      :width="`${(1000 / width_w) * 100}%`"
      :before-close="closeDialogMap"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <span class="flex align-items-center" style="margin-bottom: 15px">
        摄像机地址：
        <el-input v-model="chooseAddr" style="width: 80%" maxlength="200"></el-input>
        <el-button style="height: 40px" @click="getLocation">搜索</el-button>
      </span>
      <div id="allmap" style="height: 500px"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogMap">取 消</el-button>
        <el-button type="primary" @click="confirmChooseMap">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
let map;
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import config from "@/api/config";
import mixin from "@/config/minxins";
import { addCamera, updateCamera, getBoxList } from "@/api/police";
const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
const ActionHeader = () => import("@/components/ActionHeader.vue");
@Component({
  mixins: [mixin],
  components: { ActionHeader },
})
export default class extends Vue {
  @Prop({ default: "" }) title: string;
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: {} }) update: any;
  config: any = config;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  captureTypeList: any = [];
  load: boolean = false;
  mapVisible: boolean = false;
  gps: any = {
    lat: "",
    lng: "",
  };
  chooseAddr: string = "";
  PointerList: any = [];
  point: any = {};
  private validIpPass: any = (rule, value, callback) => {
    if (value === "") {
      callback(new Error("请输入正确的设备编号"));
    } else {
      if (this.ruleForm.type == 1) {
        if (Number.isInteger(value)) {
          this.$refs.ruleForm["validateField"]("checkPass");
        } else {
          callback(new Error("请输入16位数字"));
        }
      } else {
        if (reg.test(value)) {
          this.$refs.ruleForm["validateField"]("checkPass");
        } else {
          callback(new Error("请输入正确的ip"));
        }
      }
      callback();
    }
  };
  rules: object = {
    name: [{ required: true, message: "请输入摄像机名称", trigger: "blur" }],
    type: [{ required: true, message: "请选择设备类型", trigger: "change" }],
    city: [{ required: true, message: "请选择摄像机地址", trigger: "blur" }],
    boxId: [{ required: true, message: "请选择视频盒子", trigger: "change" }],
    gbId: [{ required: true, message: "请输入视频监控设备", trigger: "blur" }],
    ipAddr: [{ required: true, validator: this.validIpPass, trigger: "blur" }],
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  };
  ruleForm: any = {
    name: "",
    ipAddr: "",
    password: "",
    username: "",
    type: "",
    boxId: "",
    gbId: "",
    captureType: "",
    group: "",
    channel: "",
    address: "",
    city: "",
    gps: "",
    devicePassword:"",
    isCaptureCar: 0,
    isCaptureFace: 0,
  };
  boxName: string = ""; //选择的视频盒子
  tableData: Array<any> = [];
  videoVisible: boolean = false;
  localSearch: any = null;
  pagination: any = {
    total: 0,
    page: 1,
    pageSize: 10,
  };
  selectedUser: any = [];
  created() {
    this.gotoTheFirstPage();
  }
  @Watch("visible")
  getForm() {
    console.log(this.update)
    if (this.visible && this.title == "修改") {
      this.ruleForm.name = this.update.name;
      this.ruleForm.ipAddr =
        this.update.type == 1 ? Number(this.update.ipAddr) : this.update.ipAddr;
      this.ruleForm.username = this.update.username;
      this.ruleForm.password = this.update.password;
      this.ruleForm.type = this.update.type;
      this.ruleForm.boxId = this.update.boxId;
      this.ruleForm.gbId = this.update.gbId;
      this.ruleForm.devicePassword = this.update.devicePassword;
      this.boxName = this.update.boxName;
      this.ruleForm.city = this.update.addr;
      this.chooseAddr = this.update.addr;
      this.ruleForm.gps = this.update.gps.indexOf("{") == -1 ? "" : this.update.gps;
      if (this.update.isCaptureCar == 1 && this.update.isCaptureFace == 1) {
        this.captureTypeList = ["车辆抓拍", "人脸抓拍"];
      } else if (this.update.isCaptureCar == 1 && this.update.isCaptureFace == 0) {
        this.captureTypeList = ["车辆抓拍"];
      } else if (this.update.isCaptureCar == 0 && this.update.isCaptureFace == 1) {
        this.captureTypeList = ["人脸抓拍"];
      }
      if (this.update.gps.indexOf("{") != -1) {
        let gps = JSON.parse(this.update.gps) || {};
        gps.status = 0;
        this.PointerList = [gps];
      }
    }
  }
  handleClose() {
    this.ruleForm = {
      name: "",
      ipAddr: "",
      password: "",
      username: "",
      type: "",
      boxId: "",
      gbId: "",
      devicePassword: "",
      captureType: "",
      group: "",
      channel: "",
      address: "",
      city: "",
      gps: "",
      isCaptureCar: 0,
      isCaptureFace: 0,
    };
    this.$refs["ruleForm"]["resetFields"]();
    this.captureTypeList = [];
    this.$emit("close");
    this.load = false;
    // console.log(this.ruleForm)
  }
  typeChange() {
    this.ruleForm.ipAddr = "";
  }
  gotoTheFirstPage() {
    this.tableData = [];
    this.pagination.page = 1;
    //重新载入翻页组件，回到第一页
    this.pagination.show = false;
    this.$nextTick(() => {
      this.pagination.show = true;
    });
    this.getBoxList();
  }
  // 视频盒子
  getBoxList() {
    let param = {
      page: this.pagination["page"],
      pageSize:this.pagination.pageSize,
    };
    getBoxList(param).then((res) => {
      let data = res.data.data;
      data.records.map((item: any, i) => {
        let obj = this.selectedUser.find((item1: any) => item1.id == item.id);
        if (obj) {
          data.records[i].selected = true;
        } else {
          data.records[i].selected = false;
        }
      });
      this.pagination.total = data.total;
      this.tableData = data.records;
    });
  }
  confirmAddCamera() {
    this.$refs["ruleForm"]["validate"]((valid) => {
      if (valid) {
        let param: any = {
          addr: this.ruleForm.city,
          gps: JSON.stringify(this.point),
          ipAddr: this.ruleForm.ipAddr,
          name: this.ruleForm.name,
          boxId: this.ruleForm.boxId,
          type: this.ruleForm.type,
          username: this.ruleForm.username,
          password: this.ruleForm.password,
          gbId: this.ruleForm.gbId,
          devicePassword: this.ruleForm.devicePassword,
          isCaptureCar: this.captureTypeList.indexOf("车辆抓拍") != -1 ? 1 : 0,
          isCaptureFace: this.captureTypeList.indexOf("人脸抓拍") != -1 ? 1 : 0,
        };
        this.load = true;
        if (this.title == "添加") {
          this.addCamera(param);
        } else {
          this.updateCamera(param);
        }
      } else {
        return false;
      }
    });
  }
  //添加
  addCamera(param) {
    addCamera(param)
      .then((res) => {
        this.load = false;
        this.$message.success("添加成功");
        this.$emit("refresh");
        this.handleClose();
      })
      .catch((err) => {
        this.load = false;
      });
  }
  // 修改
  updateCamera(param) {
    param.id = this.update.id;
    console.log(param);

    updateCamera(param)
      .then((res) => {
        this.load = false;
        this.$message.success("修改成功");
        this.$emit("refresh");
        this.handleClose();
      })
      .catch((err) => {
        this.load = false;
      });
  }
  chooseVideoBox(row) {
    row.selected=true;
    this.selectedUser[0] = {...row};
    this.boxName = row.name;
    this.ruleForm.boxId = row.id;
    this.videoVisible = false;
  }
  closeDialogVideo() {
    this.videoVisible = false;
  }
  gpsChange() {
    let that = this;
    if (this.gps.lat != "" && this.gps.lng != "") {
      var new_point = new BMap.Point(this.gps.lng, this.gps.lat);
      var gc = new BMap.Geocoder(); //初始化，Geocoder类
      gc.getLocation(new_point, function (rs) {
        //getLocation函数用来解析地址信息，分别返回省市区街等
        var addComp = rs.addressComponents,
          province = addComp.province, //获取省份
          city = addComp.city, //获取城市
          district = addComp.district, //区
          street = addComp.street, //街
          streetNumber = addComp.streetNumber ? addComp.streetNumber + "" : "";
        let adr_detail = street + streetNumber;
        that.chooseAddr = province + city + district + street + streetNumber;
        that.update.addr = province + city + district + street + streetNumber;
        that.point = new_point;
        that.ruleForm.city = province + city + district + street + streetNumber;
        that.ruleForm.gps =
          that.ruleForm.city != "" ? `{"lng":${that.gps.lng},"lat":${that.gps.lat}}` : "";
        if (that.ruleForm.city != "") {
          let gps = JSON.parse(that.ruleForm.gps) || {};
          gps.status = 0;
          that.PointerList = [gps];
        }
      });
    }
  }
  // 打开地图
  openMapDialog() {
    this.mapVisible = true;
    this.chooseAddr = this.update.addr || "";
    this.initMap();
  }
  initMap() {
    let that = this;
    this.$nextTick(() => {
      map = new BMap.Map("allmap", { enableMapClick: false });
      if (this.title == "修改") {
        map.clearOverlays();
        if (!this.PointerList.length) {
          map.centerAndZoom("成都", 15);
        } else {
          if (!("lng" in this.PointerList[0])) {
            map.centerAndZoom("成都", 15);
          } else {
            var new_point: any = new BMap.Point(
              this.PointerList[0].lng,
              this.PointerList[0].lat
            );
            let marker = new BMap.Marker(new_point);
            let view: any = map.getViewport([new_point]);
            let centerPoint = view.center;
            let mapZoom = view.zoom;
            map.centerAndZoom(centerPoint, mapZoom);
            map.addOverlay(marker);
          }
        }
      } else {
        map.centerAndZoom("成都", 15);
      }
      this.localSearch = new BMap.LocalSearch(map, {
        renderOptions: { map: map },
        onSearchComplete: () => {
          if (!that.localSearch.getResults()) {
            return;
          }
          var pp = that.localSearch.getResults().getPoi(0).point; //获取第一个智能搜索的结果
          that.chooseAddr = that.localSearch.getResults().getPoi(0).address;
          map.panTo(pp); //地图中心点转移到第一条搜索结果
          that.point = pp;
        },
      });
      map.enableScrollWheelZoom(true);
      map.addEventListener("click", function (e) {
        that.getLocationName(e.point.lng, e.point.lat, "");
      });
      // this.localSearch.search(this.chooseAddr);
    });
  }
  //根据用户输入定位
  getLocation() {
    this.localSearch.search(this.chooseAddr);
  }
  getLocationName(lng, lat, type) {
    let that = this;
    let location_name = {};
    //获取定位名称
    var new_point = new BMap.Point(lng, lat);
    map.clearOverlays();
    let marker = new BMap.Marker(new_point);
    map.addOverlay(marker);
    var gc = new BMap.Geocoder(); //初始化，Geocoder类
    gc.getLocation(new_point, function (rs) {
      //getLocation函数用来解析地址信息，分别返回省市区街等
      var addComp = rs.addressComponents,
        province = addComp.province, //获取省份
        city = addComp.city, //获取城市
        district = addComp.district, //区
        street = addComp.street, //街
        streetNumber = addComp.streetNumber ? addComp.streetNumber + "" : "";
      location_name = {
        province,
        city,
        district,
      };
      let adr_detail = street + streetNumber;
      // return location_name;
      that.chooseAddr = province + city + district + street + streetNumber;
      that.point = new_point;
    });
  }
  closeDialogMap() {
    this.mapVisible = false;
    this.chooseAddr = "";
    this.point = "";
  }
  confirmChooseMap() {
    this.ruleForm.city = this.chooseAddr;
    this.mapVisible = false;
  }
}
</script>

<style lang="scss" scoped>
.ipt {
  width: 300px;
}
::v-deep {
  .el-dialog {
    min-width: 500px;
  }
}
.table-btn {
  cursor: pointer;
}
</style>
