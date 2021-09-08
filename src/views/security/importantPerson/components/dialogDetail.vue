<template>
  <el-dialog class="newDialog" :visible="visible" title="人像详情" width="600px" :before-close="handleClose">
    <div>
      <div class="commonRow">
        <div class="label">
          <span class="portraitLabel">人像：</span>
        </div>
        <div class="value">
          <div class="commonPicWrapper">
            <img class="pic" :src="form.faceUrl" />
          </div>
        </div>
      </div>

      <el-row :gutter="0">
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">姓名：</div>
            <div class="value" style="word-break: break-all" :title="form.name">
              {{ form.name }}
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">国籍：</div>
            <div class="value" :title="form.country">{{ form.country }}</div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">电话：</div>
            <div class="value">{{ form.phone }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">籍贯：</div>
            <div class="value" :title="form.homeTown">{{ form.homeTown }}</div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">证件类型：</div>
            <div class="value">{{ form.cardType }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">证件号码：</div>
            <div class="value" :title="form.cardNo">{{ form.cardNo }}</div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">出生日期：</div>
            <div class="value">{{ form.birthday | date }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">工作单位：</div>
            <div class="value" :title="form.jobAddress">
              {{ form.jobAddress }}
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">性别：</div>
            <div class="value">{{ sexMap[form.sex] }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="commonRow">
            <div class="label">住址：</div>
            <div class="value" :title="form.address">{{ form.address }}</div>
          </div>
        </el-col>
      </el-row>

      <div class="commonRow">
        <div class="label">备注：</div>
        <div style="width: 80%">{{ form.remark }}</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  props: ["visible", "title", "form"],
  data() {
    return {
      height_w: window.innerHeight,
      width_w: window.innerWidth,
      sexMap: {
        1: "男",
        2: "女",
        3: "不详",
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
.commonRow {
  display: flex;
  margin-bottom: 15px;
  font-size: 13px;
  color: #666;
  > .label {
    width: 100px;
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
.commonPicWrapper {
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  .pic {
    max-width: 145px;
    max-height: 145px;
    width: auto !important;
    height: auto !important;
  }
}
</style>