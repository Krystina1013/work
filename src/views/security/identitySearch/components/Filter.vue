<template>
  <div class="layout-content">
    <el-row type="flex" class="row-bg">
      <el-col :span="12"> </el-col>
      <el-col :span="12" justify="end">
        <div class="rightAction">
          <!-- 按图搜索 -->
          <div class="content" v-show="activeName == 'cap'">
            <span class="filter-style activeFilter" @click.stop="openPicFilter">
              <i style="color: '#409eff'" class="iconfont icon-guolv"></i>
              过滤
            </span>
            <transition name="el-zoom-in-top">
              <div v-show="visibleFilter" class="filterDialog">
                <div class="flex">
                  <span>人&nbsp;&nbsp;&nbsp;像：</span>
                  <el-upload
                    ref="upload"
                    class="avatar-uploader"
                    :action="config.v5 + '/admin/scence-user/upFace'"
                    accept="image/*"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="beforeAvatarUpload"
                  >
                    <img
                      v-if="picFilterForm.faceImage"
                      :src="picFilterForm.faceImage"
                      class="avatar avatar-single"
                    />
                    <i
                      v-else
                      class="el-icon-plus avatar-uploader-icon avatar-single"
                    ></i>
                  </el-upload>
                </div>
                <div class="flex">
                  <span>相似度：</span>
                  <el-select v-model="picFilterForm.score" placeholder="请选择">
                    <el-option
                      v-for="item in similarity"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <el-button
                  class="fliterBtn"
                  type="primary"
                  plain
                  size="small"
                  @click="picSearch"
                  >筛选</el-button
                >
                <el-button
                  style="margin-right: 10px"
                  class="fliterBtn"
                  type="warning"
                  plain
                  size="small"
                  @click="clearPicSearch"
                  >清空条件</el-button
                >
              </div>
            </transition>
          </div>
          <!-- 按信息搜索 -->
          <div class="content" v-show="activeName == 'info'">
            <span
              class="filter-style activeFilter"
              @click.stop="openInfoFilter"
            >
              <i style="color: '#409eff'" class="iconfont icon-guolv"></i>
              过滤
            </span>
            <transition name="el-zoom-in-top">
              <div v-show="visibleFilterInfo" class="filterDialog">
                <div class="word-filter">
                  <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
                  <el-input
                    v-model="infoFilter.name"
                    placeholder="请输入姓名"
                    class="input-filter"
                    size="small"
                  ></el-input>
                </div>
                <div class="word-filter">
                  <span class="filter-name">电&nbsp;&nbsp;&nbsp;话:</span>
                  <el-input
                    v-model="infoFilter.phone"
                    placeholder="请输入电话"
                    class="input-filter"
                    size="small"
                  ></el-input>
                </div>
                <div class="word-filter">
                  <span class="filter-name">证件号码:</span>
                  <el-input
                    v-model="infoFilter.cardNo"
                    placeholder="请输入证件号码"
                    class="input-filter"
                    size="small"
                  ></el-input>
                </div>

                <el-button
                  class="fliterBtn"
                  type="primary"
                  plain
                  size="small"
                  @click="infoSearch"
                  >筛选</el-button
                >
                <el-button
                  style="margin-right: 10px"
                  class="fliterBtn"
                  type="warning"
                  plain
                  size="small"
                  @click="clearInfoSearch"
                  >清空条件</el-button
                >
              </div>
            </transition>
          </div>
          <el-tag v-if="hasProty" closable @close="clearFilterFormfresh">
            查询
            <span style="color: red">{{ total }}</span
            >条结果
          </el-tag>
          <span class="total">总共:{{ total }}条</span>
          <i
            @click.stop="
              (visible = !visible),
                (visibleFilter = false),
                (visibleFilterInfo = false)
            "
            style="font-size: 16px; margin-right: 20px; cursor: pointer"
            class="iconfont icon-shezhi"
          ></i>

          <transition name="el-zoom-in-top">
            <div v-show="visible" class="setting">
              <span>每页显示:</span>
              <el-select
                @change="sizeChange"
                style="width: 100px; margin-left: 10px"
                v-model="size"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in pageSize"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </transition>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import config from "@/api/config";
import { getBase64 } from "@/utils/index.js";
@Component
export default class extends Vue {
  @Prop({ default: "cap" }) activeName: string;
  @Prop({ default: 0 }) total: number;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  config: any = config;
  visibleFilter: Boolean = false; // 筛选dialog状态框
  private visible: boolean = false; // 数据显示条数dialog状态
  visibleFilterInfo: Boolean = false; // 筛选dialog状态框
  hasProty: boolean = false; // 有无筛选条件
  //   按图筛选
  picFilterForm: any = {
    faceImage: "",
    score: "",
  };
  //   按信息筛选
  infoFilter: object = {
    name: "",
    cardNo: "",
    phone: "",
  };
  size: string = "10";
  private pageSize: Array<Object> = [
    // 数据显示条数数组
    {
      label: "10",
      value: 10,
    },
    {
      label: "30",
      value: 30,
    },
    {
      label: "50",
      value: 50,
    },
  ];
  //相似度
  similarity: Array<object> = [];
  @Watch("activeName")
  changeActive() {
    if (this.activeName == "cap") {
     this.setScore();
    }
  }
  mounted() {
    this.similarity = JSON.parse(localStorage.similarityList) || [];
    this.setScore();
    document.body.addEventListener("click", (e) => {
      if (this.$el.contains(e["target"] as HTMLElement)) {
        return;
      } else {
        this.visibleFilter = false;
        this.visible = false;
        this.visibleFilterInfo = false;
      }
    });
  }
  setScore() {
    this.similarity.map((item: any) => {
      if (item.label.indexOf("高") != -1) {
        this.picFilterForm.score = item.value;
      }
    });
  }
  sizeChange() {}
  clearFilterFormfresh() {
    this.visibleFilter = false;
    this.visible = false;
    this.visibleFilterInfo = false;
    this.hasProty = false;
    this.infoFilter = {
      name: "",
      cardNo: "",
      phone: "",
    };
    this.picFilterForm = {
      faceImage: "",
    };
    this.$emit("reset");
  }
  beforeAvatarUpload(file) {
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   this.$message.error('上传人脸图片大小不能超过 2MB!');
    //   return;
    // }
    getBase64(file.raw).then((res) => {
      this.picFilterForm.faceImage = res;
    });
  }
  reset() {}
  //按图筛选
  openPicFilter() {
    this.visibleFilter = true;
    this.visibleFilterInfo = false;
    this.visible = false;
  }
  picSearch() {
    if (this.picFilterForm.faceImage == "") {
      this.$message.error("请先上传照片！");
      return;
    }
    this.hasProty = true;
    this.visibleFilter = false;
    this.$emit("picSearch", this.picFilterForm);
  }
  clearPicSearch() {
    this.picFilterForm.faceImage= ""

  }
  //按信息筛选
  openInfoFilter() {
    this.visibleFilter = false;
    this.visibleFilterInfo = true;
    this.visible = false;
  }
  infoSearch() {
    this.hasProty = true;
    this.visibleFilterInfo = false;
    this.$emit("infoSearch", this.infoFilter);
  }
  clearInfoSearch() {
    this.infoFilter = {
      name: "",
      cardNo: "",
      phone: "",
    };
  }
}
</script>

<style lang="scss" scoped>
.layout-content {
  padding-left: 10px;
}
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
  .el-tabs__nav .is-top {
    background: transparent;
  }
  .el-tabs__active-bar {
    background: #409eff;
  }
}
.row-bg {
  margin: 10px 0;
  height: 32px;
  .leftAction {
    text-align: left;
    .createBtn {
      margin-right: 10px;
    }
  }
  .rightAction {
    color: #8494a7;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .setting {
      text-align: left;
      padding: 10px;
      width: 200px;
      height: 80px;
      position: absolute;
      top: 40px;
      right: 0px;
      border: 1px solid lightgray;
      box-shadow: 0px 10px 10px gray;
      background: white;
      z-index: 9;
    }
    text-align: right;
    font-size: 14px;
    position: relative;
    .filter-style {
      padding-left: 10px;
      margin-left: 10px;
      margin-right: 10px;
      border-left: 1px solid #dfe6ee;
      cursor: pointer;
    }
    .total {
      padding: 0 10px;
      margin: 0 10px;
      font-size: 14px;
      color: #8494a7;
      border-left: 1px solid #dfe6ee;
      border-right: 1px solid #dfe6ee;
    }
    .iconfont {
      color: #8494a7;
    }
    .houseNum {
      height: 100px;
      color: #8494a7;
      text-align: left;
      .input {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        .input-title {
          display: inline-block;
          white-space: nowrap;
        }
      }
      span {
        margin-right: 10px;
      }
    }
    .icon-chilun {
      font-size: 30px;
      vertical-align: middle;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.content {
  display: inline-block;
  position: relative;
  color: #8494a7;
  &:hover {
    cursor: pointer;
  }
  .filterDialog {
    text-align: left;
    width: 340px;
    height: auto;
    padding: 20px 10px;
    position: absolute;
    z-index: 11;
    left: -250px;
    top: 40px;
    border: 1px solid lightgray;
    box-shadow: 0px 10px 10px gray;
    background: white;
    .fliterBtn {
      float: right;
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
}
.flex {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.resultWrapper {
  background: #fff;
  box-shadow: 0px 6px 5px 0px lightgrey;
  padding: 10px;
}
</style>