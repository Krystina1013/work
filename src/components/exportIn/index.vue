<template>
  <div>
    <!-- <el-dialog title="批量导入" :visible.sync="visible" width="550px" :before-close="handleClose">
      <h3 class="margin">导入说明</h3>
      <h4>1) 下载导入模板</h4>
      <h4>2) 所有允许导入的字段参考模板</h4>
      <h4>3) 所有数据必须按模板要求填写，否则系统将无法正常导入数据</h4>
      <h4>4) 目前仅支持xlsx格式的文件导入</h4>
      <h4>5) 由于兼容性的问题，如果WPS文件导入失败，建议更换为office后再次导入</h4>
      <div @click="exportFunc(TmplateName, downTemplateUrl)" class="margin">
        <i class="el-icon-download color"></i>
        <span class="color" style="padding:0px">下载导入模板</span>
      </div>

      <h3 class="margin">上传数据文件</h3>
      <el-upload class="upload-demo color" style="display:inline-block;margin-right:5px;text-align:left" :show-file-list="false" :on-error="errorUpload" :on-success="successUpload" :multiple="false" :headers="header" :action="uploadUrl" accept=".xlsx" :on-change="changeFile" ref="upload" :auto-upload="false">
        <i class="el-icon-plus"></i>
        添加文件
        <br />
        <span style="color:black">{{ fileName }}</span>
      </el-upload>
      <h4>目前仅支持*.xlsx</h4> -->
    <el-dialog class="newDialog" title="批量导入" :visible.sync="visible" width="670px" :before-close="handleClose">
      <el-upload class="upload-demo" :show-file-list="true" :on-error="errorUpload" :on-success="successUpload" :multiple="false" :headers="header" :action="uploadUrl" accept=".xlsx,.xls" :on-change="changeFile" ref="upload" :auto-upload="false">
        <el-button size="small" type="primary">+ 添加文件</el-button>
      </el-upload>
      <el-button size="small" class="xiazai-con" plain @click="exportFunc(TmplateName, downTemplateUrl)">
        <i class="el-icon-download"></i>
        下载导入模板
      </el-button>
      <div class="el-upload__tip">
        <p style="color:#606266">目前仅支持*.xlsx; 添加文件后，请到<span style="color:#409EFF">【导入记录】中查看导入结果。</span></p>
        <p style="margin-top:10px">导入说明：</p>
        <p>1.下载导入模板;</p>
        <p>2. 所有允许导入的字段参考模板;</p>
        <p>3. 所有数据必须按模板要求填写，否则系统将无法正常导入数据;</p>
        <p>4. 目前仅支持xlsx格式的文件导入;</p>
        <p>5. 由于兼容性的问题，如果WPS文件导入失败，建议更换为office后再次导入;</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmUpload">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog class="newDialog" title="失败详情" width="1000px" :visible.sync="dialogTableVisible">
      <el-table height="300px" stripe border :data="errData">
        <el-table-column v-if="uploadUrl.indexOf('/admin/scence-user/import') !== -1 || uploadUrl.indexOf('/admin/scence-user/propertyUser/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="name" label="姓名" width="150"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/scence-user/import') !== -1 || uploadUrl.indexOf('/admin/scence-user/propertyUser/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="phone" label="电话" width="150">
          <template slot-scope="{row}">
            <span>{{row.phone.length==11?row.phone:''}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/scence-user/import') !== -1 || uploadUrl.indexOf('/admin/scence-user/propertyUser/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="sex" label="性别" width="50"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/scence-user/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="userType" label="办公成员类型" width="150"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/scence-user/propertyUser/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="note" label="备注" width="150"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/door-card/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" width="160" property="cardNo" label="卡号"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/door-card/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" width="120" property="houseName" label="房号"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/scence-user/import') !== -1 || uploadUrl.indexOf('/admin/scence-user/propertyUser/import') !== -1 || uploadUrl.indexOf('/admin/door-card/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="失败原因">
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.caseFail" :key="'caseFail' + index">{{item}},</span>
          </template>
        </el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/scence-user/import') !== -1 || uploadUrl.indexOf('/admin/scence-user/propertyUser/import') !== -1 || uploadUrl.indexOf('/admin/door-card/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="错误定位">
          <template slot-scope="{row}">
            <span>第 {{row.index}} 行</span>
          </template>
        </el-table-column>

        <!-- 车辆 -->

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carNo" label="车牌"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="name" label="车主姓名"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="phone" label="车主电话"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="status" label="状态"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carModel" label="车辆品牌"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carType" label="车辆型号"></el-table-column>
        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="note" label="备注"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="status" label="状态"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="ownerName" label="业主姓名"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="失败原因">
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.caseFail" :key="'caseFail' + index">{{item}},</span>
          </template>
        </el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/usr-car/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="错误定位">
          <template slot-scope="{row}">
            <span>第 {{row.index}} 行</span>
          </template>
        </el-table-column>

        <!-- 车位 -->

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="groupName" label="所属分组"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="serialNumber" label="编号"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="status" label="状态"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carOwnerName" label="业主"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carOwnerPhone" label="业主电话"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="carSpaceTypeName" label="车位类型"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="bindCarName" label="绑定车辆"></el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="失败原因">
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.errMsg" :key="'errMsg' + index">{{item}},</span>
          </template>
        </el-table-column>

        <el-table-column v-if="uploadUrl.indexOf('/admin/car-space/import') !== -1" :show-overflow-tooltip="true" :key="Math.random()" align="center" property="caseFail" label="错误定位">
          <template slot-scope="{row}">
            <span>第 {{row.rowIndex}} 行</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { exportList } from "@/api/user.ts";
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { message } from "@/utils";
import qs from "qs";
@Component({})
export default class ExportIn extends Vue {
  @Prop({ default: "" }) downTemplateUrl: string;
  @Prop({ default: "" }) uploadUrl: string;
  @Prop({ default: false }) visible: boolean;
  @Getter("token") token: string;
  @Prop({ default: "用户导入模板.xlsx" }) TmplateName: string;
  header: object = {};
  errData: Array<object> = []; // 失败路径
  fileName: string = ""; // 文件名字
  dialogTableVisible: boolean = false; // 导出失败状态
  @Emit("errorUpload")
  errorUpload(err, file, list) {
    this.$nextTick(() => {
      this.fileName = "";
    });
    this.errData = [];
    if (JSON.parse(err.message).code === 400) {
      message("error", JSON.parse(err.message).message);
    } else {
      console.log(JSON.parse(err.message));
      this.errData = JSON.parse(err.message);
      this.dialogTableVisible = true;
      this.$refs.upload["clearFiles"]();
    }
    this.handleClose();
  }
  @Emit("successUpload")
  successUpload(file) {
    this.$nextTick(() => {
      this.fileName = "";
    });
    message("success", `导入成功`);
    this.$refs.upload["clearFiles"]();
    this.handleClose();
  }
  changeFile(file) {
    this.fileName = file.name;
  }
  mounted() {
    this.header = {
      token: this.token,
    };
  }

  @Emit("closeVisible")
  handleClose() {
    this.fileName = "";
    return false;
  }

  exportFunc(fileNames: string, exportUrl: string): void {
    const filterUrl = qs.stringify({ isData: false });
    if (process.env.NODE_ENV === "production") {
      // exportUrl = exportUrl.replace("", "http://47.103.184.184");
    }

    exportList(exportUrl + "/?" + filterUrl).then((res) => {
      const fileName = fileNames;
      var blob = new Blob([res.data], {
        type: "application/vnd.ms-excel;charset=UTF-8",
      });
      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    });
  }
  // 确定上传
  confirmUpload() {
    if (!this.fileName) {
      return message("error", `未选择文件`);
    }
    this.$refs["upload"]["submit"]();
  }
}
</script>

<style lang="scss">
.upload-demo {
  margin-bottom: 15px;
  .el-button {
    height: 40px;
    font-size: 14px;
  }
}
</style>
<style scoped lang='scss'>
.el-upload__tip {
  margin-top: 30px;
  p {
    text-align: left;
    font-size: 14px;
    color: #6a7e92;
    line-height: 18px;
  }
}
h4 {
  color: gray;
  padding: 0px 0px 0px 20px;
  margin: 10px 0px;
}
.color {
  color: rgb(65, 199, 219);
}
.margin {
  margin: 10px 0px;
  &:hover {
    cursor: pointer;
  }
}
.xiazai-con {
  font-size: 14px;
  height: 40px;
  position: absolute;
  top: 66px;
  left: 155px;
}
</style>