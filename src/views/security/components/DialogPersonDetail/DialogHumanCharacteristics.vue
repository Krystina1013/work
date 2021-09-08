<template>
  <el-dialog
    :visible="visible"
    title="人体特征"
    :width="`${(800 / width_w) * 100}%`"
    :before-close="close"
  >
    <div>
      <div class="face commonModule">
        <h3 class="title">面部特征：</h3>
        <div class="content">
          <div class="column">
            <div class="commonRow">
              <div class="label">性别：</div>
              <div class="value">{{ sexMap[form.gender] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">遮挡：</div>
              <div class="value">{{ hasOrNotMap[form.mouthmask] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">戴眼镜：</div>
              <div class="value">{{ hasOrNotMap[form.glasses] }}</div>
            </div>
          </div>
          <div class="column">
            <div class="commonRow">
              <div class="label">疑似年龄：</div>
              <div class="value">{{ ageMap[form.age] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">面部表情：</div>
              <div class="value">{{ hasOrNotMap[form.expression] }}</div>
            </div>
          </div>
          <div class="column"></div>
          <div class="column"></div>
        </div>
      </div>
      <div class="humanBody commonModule">
        <h3 class="title">身体特征：</h3>
        <div class="content">
          <div class="column">
            <div class="commonRow">
              <div class="label">上装款式：</div>
              <div class="value">{{ upperStyleMap[form.upperStyle] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">上装颜色：</div>
              <div class="value">{{ upperColorMap[form.upperColor] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">上装纹理：</div>
              <div class="value">
                {{ upperTextureMap[form.upperTexture] }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">前面背包：</div>
              <div class="value">{{ hasOrNotMap[form.frontpack] }}</div>
            </div>
          </div>
          <div class="column">
            <div class="commonRow">
              <div class="label">下装款式：</div>
              <div class="value">{{ lowerStyleMap[form.lowerStyle] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">下装颜色：</div>
              <div class="value">{{ lowerColorMap[form.lowerColor] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">体型：</div>
              <div class="value">{{ shapeMap[form.shape] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">发型：</div>
              <div class="value">{{ hairMap[form.hair] }}</div>
            </div>
          </div>
          <div class="column">
            <div class="commonRow">
              <div class="label">背包：</div>
              <div class="value">{{ hasOrNotMap[form.backpack] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">斜挎包：</div>
              <div class="value">{{ hasOrNotMap[form.satchel] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">拎东西：</div>
              <div class="value">{{ hasOrNotMap[form.carry] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">行李箱：</div>
              <div class="value">{{ hasOrNotMap[form.luggage] }}</div>
            </div>
          </div>
          <div class="column">
            <div class="commonRow">
              <div class="label">携带雨伞：</div>
              <div class="value">{{ hasOrNotMap[form.umbrella] }}</div>
            </div>
            <div class="commonRow">
              <div class="label">行进方向：</div>
              <div class="value">
                {{ enMoveDirectMap[form.enMoveDirect] }}
              </div>
            </div>
            <div class="commonRow">
              <div class="label">行进速度：</div>
              <div class="value">
                {{ enMoveSpeedMap[form.enMoveSpeed] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
@Component({})
export default class extends Vue {
  @(Prop({ default: false })!) visible: boolean;
  @(Prop({ default: {} })!) form: object;
  height_w: number = window.innerHeight;
  width_w: number = window.innerWidth;
  sexMap: any = {
    1: "男",
    2: "女",
    3: "不详",
  };
  hasOrNotMap: any = {
    0: "未知",
    1: "无",
    2: "有",
  };
  upperStyleMap: any = {
    0: "未知",
    1: "长袖",
    2: "短袖",
  };
  upperColorMap: any = {
    0: "未知",
    1: "黑",
    2: "蓝",
    3: "绿",
    4: "白/灰",
    5: "黄/橙/棕",
    6: "红/粉/紫",
  };
  upperTextureMap: any = {
    0: "未知",
    1: "纯色",
    2: "条纹",
  };
  lowerStyleMap: any = {
    0: "未知",
    1: "长裤",
    2: "短裤",
  };
  lowerColorMap: any = {
    0: "未知",
    1: "黑",
    2: "蓝",
    3: "绿",
    4: "白/灰",
    5: "黄/橙/棕",
    6: "红/粉/紫",
  };
  hairMap: any = {
    0: "未知",
    1: "长发",
    2: "短发",
  };
  ageMap: any = {
    0: "未知",
    1: "少年",
    2: "青年",
    3: "老年",
  };
  shapeMap: any = {
    0: "未知",
    1: "标准",
    2: "胖",
    3: "瘦",
  };
  enMoveDirectMap: any = {
    1: "未知",
    2: "往前",
    3: "往后",
  };
  enMoveSpeedMap: any = {
    1: "未知",
    2: "慢",
    3: "快",
  };
  close() {
    this.$emit("close");
  }
}
</script>
<style scoped lang="scss">
.commonModule {
  .title {
    margin-bottom: 5px;
    color: #333;
  }
  .content {
    display: flex;
    .column {
      flex: 1;
    }
  }
}
.commonRow {
  display: flex;
  margin-bottom: 5px;
  font-size: 13px;
}
.humanBody {
  margin-top: 30px;
}
::v-deep {
  .el-dialog__body {
    padding: 15px 15px 30px !important;
  }
}
</style>
