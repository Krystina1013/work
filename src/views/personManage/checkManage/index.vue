<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <action-header
          exportUrl="/admin/people-pass/export"
          exportName="人员通行.xls"
          ref="actionHeader"
          :initFormHeader="initForm"
          @fetchData="fetchData"
          :filterForm="filterForm"
          :btnStatus="0"
          :moreStatus='false'
          linkUrl="/statementManage/personPassChart"
          :total="page.total"
        >
          <!-- <el-dropdown-menu slot="dropdown" v-if="permissionList.includes('personPassChartLook')">
            <el-dropdown-item command="link">统计信息</el-dropdown-item>
          </el-dropdown-menu> -->
          <div slot="houseNum">
            <div class="word-filter">
              <span class="filter-name">房屋:</span>&nbsp;&nbsp;
              <el-autocomplete
                style="width:250px;height:32px"
                class="autoInput"
                clearable
                @keyup.enter.native="emitFetchData"
                v-model="filterForm.bindName"
                @input="changeLoc"
                :fetch-suggestions="querySearch"
                placeholder="请输入通行位置查找"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div class="value">{{ item.locationName }}</div>
                </template>
              </el-autocomplete>
            </div>

            <div class="word-filter">
              <span class="filter-name">申请时间:</span> &nbsp;&nbsp;
              <el-date-picker
                v-model="filterForm.date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
            </el-date-picker>
            </div>
            <div class="word-filter">
              <span class="filter-name">状态:</span>&nbsp;
              <el-select
                style="width:250px"
                class="input-filter"
                size="small"
                v-model="filterForm.type"
                placeholder="请选择"
              >
                <el-option label="待审核" value></el-option>
                <el-option label="已审核" value="house"></el-option>
              </el-select>
            </div>
          </div>
        </action-header>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24" class="table-col">
        <div class="rightContent">
          <el-table
            :data="list_data"
            stripe
            v-loading="showLoading"
            height="65vh"
            border
            highlight-current-row
            @cell-mouse-enter="enterRowChange"
            @cell-mouse-leave="leaveRowChange"
          >
            <el-table-column align="center" prop="buildName" label="房屋" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="name" label="姓名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="phone" label="手机号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="人脸图像" :show-overflow-tooltip="true">
                <template slot-scope="">
                    <img src="" alt="" class="face-img">
                </template>
            </el-table-column>
            <el-table-column align="center" prop="phone" label="状态" :show-overflow-tooltip="true">
                 <template slot-scope="">
                    <el-tag type="success">已审核</el-tag>
                    <el-tag type="danger">待审核</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="phone" label="住户类型" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="time" label="申请时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" label="操作" width="100">
                <el-button size="mini" type="text">审核</el-button>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageChange"
            :page-size="page.limit"
            style="margin-top:10px;"
            background
            layout="prev, pager, next"
            :total="page.total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
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

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
  },
})
export default class PersonPass extends Vue {
    config:any=config;
    filterForm:any={
        date:"",
        bindName:"",
        type:""
    }
}
</script>

<style lang="scss" scoped>
    .face-img{
        width: 100px;
        height: 100px;
        object-fit: contain;
    }
</style>