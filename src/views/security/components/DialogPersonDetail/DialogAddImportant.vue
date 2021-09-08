<template>
  <div>
    <el-dialog class="newDialog" title="添加到关注人员" :visible.sync="visible" width="800px" :before-close="handleClose">
      <div class="flex">
        <div class="dialog-right">
          <el-table :data="tableData" style="width: 100%" height="400">
            <el-table-column label="序号" type="index" align="center">
            </el-table-column>
            <el-table-column prop="name" label="分组名称" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="openAddPerson(scope.row)">选择</el-button>
                <el-button type="text" size="mini" @click="openList(scope.row.id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <AddPersonInportant :visible="addPersonInportant.visible" :form="addPersonInportant.form" @close="addPersonInportant.visible = false" @closeChooseDialog="closeChooseDialog"></AddPersonInportant>    
    <el-dialog title="查看" class="newDialog" :visible.sync="seeListVisible" width="830px" :before-close="handleCloseLook">
      <div v-loading="showLoading">
        <p>共{{total}}条</p>
        <ScrollList class="scollList" ref="scrollList" :height="height_w - 500" :canPullUp="canPullUp" @scrollToBottom="scrollToBottom">
          <div class="card" :key="index" v-for="(item, index) in listData">
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
            </div>
          </div>
        </ScrollList>
      </div>
    </el-dialog>
    <DialogDetail :visible="dialogDetail.visible" :form="dialogDetail.form" :title="dialogDetail.title" @close="dialogDetail.visible = false"></DialogDetail>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins, Watch } from "vue-property-decorator";
import AddPersonInportant from "./AddPersonInportant.vue";
import config from "@/api/config";
import { importantGroup, getImportantPerson } from "@/api/police";
const ScrollList = () => import("@/components/scrollList/ScrollList.vue");
const DialogDetail = () =>
  import("../../importantPerson/components/dialogDetail.vue");
@Component({
  components: { AddPersonInportant, ScrollList, DialogDetail },
})
export default class extends Vue {
  @Prop({ default: false }) visible: boolean;
  @Prop({ default: {} }) form: any;
  height_w: number = window.innerHeight;
  defaultProps: object = {
    children: "children",
    label: "name",
  };
  addPersonInportant: any = {
    visible: false,
    form: {},
  };
  listData: Array<object> = [];
  seeListVisible: boolean = false;
  tableData: Array<object> = [];
  TreeData: Array<object> = [];
  highlightStatus: boolean = false; // 高亮状态
  currentTreeId: string = "";
  pagination: any = {
    total: 0,
    page: 1,
    pageSize: 20,
  };
  //人像详情
  dialogDetail: any = {
    visible: false,
    title: "",
    form: {},
  };
  total: any = 0;
  showLoading: boolean = false;
  canPullUp: boolean = true;
  created() {
    this.getLeftTree();
  }
  getLeftTree() {
    importantGroup({ page: 1, pageSize: 100 }).then((res) => {
      this.tableData = res.data.data.records;
    });
  }
  openAddPerson(row) {
    this.addPersonInportant.form = {
      ...this.form,
      groupId: row.id,
    };
    this.addPersonInportant.visible = true;
  }
  closeChooseDialog() {
    this.handleClose();
  }
  handleClose() {
    this.$emit("close");
  }
  openList(id: string) {
    this.currentTreeId = id;
    this.getTableData();
    this.seeListVisible = true;
  }
  getTableData() {
    this.pagination.page = 1;
    this.listData = [];
    this.loadData();
  }
  scrollToBottom() {
    this.canPullUp = false;
  }
  loadData() {
    let param = {
      page: this.pagination.page,
      pageSize: this.pagination.pageSize,
      alertTaskId: this.currentTreeId,
    };
    this.showLoading = true;
    getImportantPerson(param)
      .then((res) => {
        let data = res.data.data;
        this.showLoading = false;
        this.total = data.total;
        if (this.pagination.page == 1) {
          this.listData = data.records;
          // this.$refs.scrollList.scrollToTop();
        } else {
          this.listData = [...this.listData, ...data.records];
        }
        console.log(this.listData);
        this.$nextTick(() => {
          if (this.listData.length == parseInt(data.total)) {
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
  //人员弹窗
  showDetailDialog(item) {
    this.dialogDetail.form = item;
    this.dialogDetail.visible = true;
  }
  handleCloseLook() {
    this.seeListVisible = false;
  }
  confirm() {}
}
</script>

<style lang="scss" scoped>
.leftContent {
  width: 150px;
  margin-right: 15px;
  box-shadow: 0px 0px 8px 0px lightgrey;
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
}
.dialog-right {
  flex: 1;
}
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
</style>