<template>
  <div>
    <el-dialog class="newDialog" title="抓拍详情" :visible="visible" :append-to-body='true' width="1212px" :before-close="handleClose">
      <div class="detail-container flex">
        <div class="left-layout" v-if="form.faceInfo">
          <div class="cap-img" v-if="!hideOriginalFace">
            <div class="img-title">
              <span>» 原图像</span>
              <span>» 抓拍图</span>
            </div>
            <div class="pic">
              <div class="left">
                <img src="" alt="" />
              </div>
              <div>
                <img :src="form.faceInfo.faceUrl" alt="" />
              </div>
            </div>
          </div>
          <div class="cap-img" v-else>
            <div class="img-title">
              <span>» 抓拍图</span>
            </div>
            <div class="pic pic-center">
              <div>
                <img v-if="form.faceInfo" :src="form.faceInfo.faceUrl" alt="" />
              </div>
            </div>
          </div>
          <div class="similarityDegree" v-if="!hideOriginalFace">
            相似度:{{ getSimilarityDisplay(ruleForm.similarity) }}
          </div>
          <div class="img-title" style="margin-top:12px" v-if="form.humanInfo">
            <span>» 全身图</span>
          </div>
          <img class="personImg" v-if="form.humanInfo && form.humanInfo.humanImg" :src="form.humanInfo.humanImg" alt="" />
        </div>
        <div class="center-layout">
          <div class="img-title">
            <span>» 全景图</span>
          </div>
          <img v-if="form.faceInfo && !showVideo" :src="form.faceInfo.panoramaImg" alt="" />
          <div v-if="showVideo" style="height:423px">
            <Video data-name="single" v-if="videoUrl" :style="{ width: '100%', height: '100%' }" :height="height_w - 500" :url="videoUrl" ref="video" :name="1"></Video>
          </div>
        </div>
        <div class="right-layout">
          <div class="personDetail title-list" v-if="!hidePersonInfo">
            <h2 class="title">» 人员信息：</h2>
            <div class="commonRow">
              <div class="label">姓名：</div>
              <div class="value" :title="ruleForm.name" style="word-break: break-all">
                {{ ruleForm.name }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">国籍：</div>
              <div class="value" :title="ruleForm.country">
                {{ ruleForm.country }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">电话：</div>
              <div class="value">{{ ruleForm.phone }}</div>
            </div>
            <div class="commonRow">
              <div class="label">证件类型：</div>
              <div class="value" :title="ruleForm.cardType">
                {{ ruleForm.cardType }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">证件号码：</div>
              <div class="value" :title="ruleForm.cardNo">
                {{ ruleForm.cardNo }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">出生日期：</div>
              <div class="value">{{ ruleForm.birthday | date }}</div>
            </div>
            <div class="commonRow">
              <div class="label">住址：</div>
              <div class="value" :title="ruleForm.address">
                {{ ruleForm.address }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">工作单位：</div>
              <div class="value" :title="ruleForm.jobAddress">
                {{ ruleForm.jobAddress }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">籍贯：</div>
              <div class="value" :title="ruleForm.homeTown">
                {{ ruleForm.homeTown }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">备注：</div>
              <div class="value" :title="ruleForm.remark" style="word-break: break-all">
                {{ ruleForm.remark }}
              </div>
            </div>
          </div>
          <div class="cameraDetail title-list">
            <h2 class="title">» 摄像机详情：</h2>
            <div class="commonRow">
              <div class="label">抓拍摄像机：</div>
              <div class="value">
                <span v-if="form.cameraCutVo" :title="form.cameraCutVo.name">{{
                  form.cameraCutVo.name
                }}</span>
                <span v-else>--</span>
              </div>
            </div>
            <div class="commonRow">
              <div class="label">抓拍时间：</div>
              <div class="value">{{ getTimeByTimeStamp(form.time) }}</div>
            </div>
            <div class="commonRow">
              <div class="label">摄像机IP：</div>
              <div class="value" v-if="form.cameraCutVo" :title="form.cameraCutVo.activeIp">
                <span v-if="form.cameraCutVo">{{ form.cameraCutVo.activeIp }}</span>
                <span v-else>--</span>
              </div>
            </div>
            <div class="commonRow">
              <div class="label">摄像机型号：</div>
              <div class="value" v-if="form.cameraCutVo" :title="form.cameraCutVo.typeDesc">
                <span v-if="form.cameraCutVo">{{ form.cameraCutVo.typeDesc }}</span>
                <span v-else>--</span>
              </div>
            </div>

            <div class="person-con">
              <h2 class="title">» 人员信息：</h2>
              <div class="commonRow text-con" v-if="form.goodFace === 0 && ( !form.scenceUserList || form.scenceUserList.length === 0)">
                非清晰人脸
              </div>
              <div class="commonRow text-con" v-if="form.goodFace === 1 && ( !form.scenceUserList || form.scenceUserList.length === 0) === 0">
                陌生人
              </div>
              <div class="type-one-con">
                <div class="type-one" v-for="(item,i) in form.scenceUserList" :key='i'>
                  <div class="commonRow" v-if="item.scenceUserType">
                    <div class="label">人员类型：</div>
                    <div class="value">
                      <span :title="item.scenceUserType">{{
                      item.scenceUserType
                    }}</span>
                    </div>
                  </div>
                  <div class="commonRow" v-if="item.name">
                    <div class="label">姓名：</div>
                    <div class="value">
                      <span v-if="item.name" :title="item.name">{{
                      item.name
                    }}</span>
                      <span v-else>--</span>
                    </div>
                  </div>
                  <div class="commonRow" v-if="item.workerGroupName && item.scenceUserType ==='关注人员'">
                    <div class="label">关注人员分组：</div>
                    <div class="value">
                      <span v-if="item.workerGroupName" :title="item.workerGroupName">{{ item.workerGroupName }}</span>
                      <span v-else>--</span>
                    </div>
                  </div>
                  <div class="commonRow" v-if="item.workerGroupName && item.scenceUserType ==='职工人员'">
                    <div class="label">职工人员分组：</div>
                    <div class="value">
                      <span v-if="item.workerGroupName" :title="item.workerGroupName">{{ item.workerGroupName }}</span>
                      <span v-else>--</span>
                    </div>
                  </div>
                  <div class="commonRow" v-if="item.scenceUserType == '学生'">
                    <div class="label">学号：</div>
                    <div class="value">
                      <span v-if="item.studentNo" :title="item.studentNo">{{
                      item.studentNo
                    }}</span>
                      <span v-else>--</span>
                    </div>
                  </div>
                  <div class="commonRow" v-if="item.scenceUserType == '学生'">
                    <div class="label">班级：</div>
                    <div class="value">
                      <span v-if="item.className" :title="item.className">{{ item.className }}</span>
                      <span v-else>--</span>
                    </div>
                  </div>
                  <div class="commonRow" v-if="item.scenceUserType == '老师' || item.scenceUserType == '职工人员'">
                    <div class="label">手机号：</div>
                    <div class="value" :title="item.phone">
                      <span v-if="item.phone">{{ item.phone }}</span>
                      <span v-else>--</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="important">添加关注人员</el-button>
        <el-button type="primary" size="mini" @click="seeVideo" v-show="!showVideo">查看视频</el-button>
        <el-button type="primary" size="mini" @click="seeImg" v-show="showVideo">查看大图</el-button>
        <el-button type="primary" plain size="mini" @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
    <DialogFacialFeature :show="dialogFacialFeature.show" :form="dialogFacialFeature.form" @close="dialogFacialFeature.show = false"></DialogFacialFeature>
    <DialogHumanCharacteristics :visible="dialogHumanCharacteristics.visible" :form="dialogHumanCharacteristics.form" @close="dialogHumanCharacteristics.visible = false"></DialogHumanCharacteristics>
    <DialogAddImportant :visible="dialogAddImportant.visible" :form="dialogAddImportant.form" @close="dialogAddImportant.visible = false"></DialogAddImportant>
  </div>
</template>

<script lang="ts">
import {
  getBase64,
  getTimeByTimeStamp,
  getSimilarityDisplay,
} from "@/utils/index.js";
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import DialogFacialFeature from "./DialogFacialFeature.vue";
import DialogHumanCharacteristics from "./DialogHumanCharacteristics.vue";
import DialogAddImportant from "./DialogAddImportant.vue";
import { playBackTime } from "@/api/police";
import Video from "./Video.vue";
import config from "@/api/config";
@Component({
  components: {
    DialogHumanCharacteristics,
    DialogFacialFeature,
    DialogAddImportant,
    Video,
  },
  filters: {
    userType(val: string) {
      const data = {
        STUDENT: "学生",
        TEACHER: "老师",
        WORKER: "职工",
        VISITOR: "访客",
        PARENT: "家长",
        PERSONSOTHER: "其他人员",
      };
      return data[val];
    },
  },
})
export default class extends Vue {
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: false }) hideOriginalFace: boolean; //隐藏原图像
  @Prop({ default: false }) hidePersonInfo: boolean; //隐藏人员详情
  @Prop({ default: false }) hideTrack: boolean; //隐藏轨迹搜索
  @Prop({ default: {} }) form: object;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  ruleForm: object = {
    similarity: 0,
  };
  dialogFacialFeature: any = {
    show: false,
    form: {},
  };
  dialogHumanCharacteristics: any = {
    visible: false,
    form: {},
  };
  dialogAddImportant: any = {
    visible: false,
    form: {},
  };
  videoUrl: any = {};
  showVideo: boolean = false;
  handleClose() {
    this.showVideo = false;
    this.$emit("close");
  }
  getSimilarityDisplay(val) {
    return getSimilarityDisplay(val);
  }
  //轨迹搜索
  goTrack() {
    const params = {
      faceUrl: this.form["faceInfo"].faceUrl,
    };
    this.$emit("trackSearch", params);
  }
  // 改样式之前的添加
  handleCommand(action) {
    if (action == "important") {
      this.dialogAddImportant.visible = true;
      this.dialogAddImportant.form = this.form;
    }
  }
  // 添加关注人员
  important() {
    this.dialogAddImportant.visible = true;
    this.dialogAddImportant.form = this.form;
  }
  seeImg() {
    this.$nextTick(() => {
      // this.$refs.reflv["flv_destroy"]();
      this.showVideo = false;
    });
  }
  seeVideo() {
    playBackTime({
      id: this.form["cameraId"],
      timestamp: this.form["time"],
    }).then((res) => {
      console.log(res.data.data);
      if (res.data.data && res.data.data.length) {
        this.showVideo = true;
        this.videoUrl = res.data.data[0];
        this.$nextTick(() => {
          this.$refs.video["play"]();
        });
        return;
      }
      this.$message.error("暂无视频");
    });
  }
  getTimeByTimeStamp(val) {
    return getTimeByTimeStamp(val);
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
.pic-center {
  > div {
    margin: 0 auto;
  }
}
.img-title {
  margin-bottom: 5px;
  display: flex;
  font-size: 12px;
  color: #606266;
  span {
    flex: 1;
  }
}
.left-layout {
  width: 159px;
  flex: 0 0 159px;
  margin-right: 20px;
  .personImg {
    width: 168px;
    height: 278px;
    object-fit: contain;
    border: 1px solid #d8d8d8;
  }
  .cap-img {
    width: 100%;

    .pic {
      display: flex;
      height: 100%;
      > div {
        flex: 1;
      }
      .left {
        flex: 1;
        margin-right: 1px;
      }
      img {
        width: 100px;
        height: 100px;
        border: 1px solid #d8d8d8;
        object-fit: contain;
      }
    }
  }
  .similarityDegree {
    margin-top: 1px;
    margin-bottom: 5px;
    text-align: center;
  }
}
.center-layout {
  flex: 0 0 737px;
  height: 423px;
  margin-right: 20px;
  img {
    width: 100%;
    height: calc(100% - 8px);
    object-fit: contain;
  }
}
.right-layout {
  width: 240px;
  flex: 0 0 240px;
  .title-list {
    .title {
      margin-bottom: 15px;
      margin-bottom: 5px;
      display: flex;
      font-size: 12px;
      color: #606266;
    }
  }
  .commonRow {
    display: flex;
    margin-bottom: 5px;
    font-size: 12px;
    color: #333;
    background: #f8f8f8;
    line-height: 34px;
    padding-left: 6px;
    padding-right: 6px;
    > .label {
      // width: 100px;
      text-align: right;
      font-weight: 600;
    }
    > .value {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.detail-container {
  color: #333;
  background: #fff;
}
::v-deep {
  .el-dialog__body,
  .el-dialog__footer {
    padding: 15px;
    color: #333;
    background: #fff;
  }
  .el-dialog__footer {
    padding-bottom: 20px;
  }
}
.person-con {
  margin-top: 15px;
}
.text-con {
  padding-left: 20px;
}
.type-one-con {
  height: 229px;
  overflow-y: auto;
}
.type-one {
  border: 1px solid #d8d8d8;
  padding: 10px 10px 5px 10px;
  margin-bottom: 10px;
}
</style>