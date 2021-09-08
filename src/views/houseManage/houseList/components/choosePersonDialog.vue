<template>
  <div>
    <el-dialog class="newDialog noPadding" :close-on-click-modal="false" title="添加员工" :visible.sync="selfVisible" width="950px" :before-close="handleClose">
      <div class="dialog_dev">
        <div class="leftContent">
          <div :class="['treeHeader', highlightStatus ? '' : 'highlight']" @click="handleNodeClick({ type: 'building', id: '' })">
            <i class="iconfont icon-shuji"></i>
            所有
          </div>
          <el-tree :data="TreeData" :props="defaultProps" node-key="id" accordion :default-expand-all="false" :expand-on-click-node="false" :highlight-current="highlightStatus" @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="right_table">
          <el-table :data="userList" ref="userList" :key="TableKey" stripe border>
            <el-table-column type="index" width="60" class="indexNum" align="center" label="编号">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="姓名"></el-table-column>
            <el-table-column prop="img" align="center" label="注册人脸">
              <template slot-scope="scope">
                <img v-if="scope.row.face" class="capture-img cur-img" :src="scope.row.face" alt />
                <span v-else> -- </span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="电话">
              <template slot-scope="scope">
                <span>{{ scope.row.phone || '--' }}</span>
              </template>
            </el-table-column>
            <el-table-column width="110" prop="phone" align="center" label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.selected" type="primary" plain size="mini" @click="cancelUser(scope.row)">取消</el-button>
                <el-button v-else type="primary" size="mini" @click="addUser(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="pageChange" :page-size="pageSize" :current-page="currentPage" style="margin-top: 10px" background layout="prev, pager, next" :total="Total"></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addPermission">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// const DataTree = () => import("@/components/DataTree.vue");
import { getHouseTreeData } from "@/api/houseApi.ts";
import { scenceUserPage, addBuildingPer } from "@/api/peopleApi.ts";

export default {
  // components: { DataTree },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    officeId: String,
    selectedIds: Array
  },
  watch: {
    visible(val) {
      this.selfVisible = val
      if (this.visible) {
        this.getHouseTreeData()
        this.scenceUserPage()
        this.TableKey = 0
        this.selectedUsers = []
      }
    },
  },

  data() {
    return {
      selfVisible: this.visible, // 避免vue双向绑定警告
      TreeData: [],
      TableKey: 0,
      defaultProps: {
        isLeaf: 'leaf',
        children: 'subBuildings',
        label: 'name',
        id: 'id'
      },
      highlightStatus: false,
      userList: [],
      pageSize: 10,
      currentPage: 1,
      Total: 0,
      selectedUsers: [],
      groupId: '',
      buildingId: ''
    }
  },

  methods: {
    handleNodeClick(data) {
      this.highlightStatus = !!data.id;
      if (data.type == "group") {
        this.groupId = data.id
        this.buildingId = ''
      } else {
        this.groupId = ''
        this.buildingId = data.id
      }
      this.pageSize = 10
      this.currentPage = 1
      this.scenceUserPage()
    },
    // 获取办公室结构
    getHouseTreeData() {
      getHouseTreeData().then((res) => {
        this.TreeData = res["data"]["data"];
      });
    },
    //获取人员列表
    scenceUserPage() {
      let params = {
        limit: this.pageSize,
        page: this.currentPage,
        currentPage: this.currentPage,
        groupId: this.groupId,
        buildingId: this.buildingId,
      }
      scenceUserPage(params).then((res) => {
        this.userList = res.data.data.records
        this.Total = res.data.data.total
        if (this.selectedIds) {
          this.selectedIds.map((i) => {
            let index1 = this.userList.findIndex((item) => item.userId == i.scenceUser.userId);
            if (index1 != -1) {
              this.userList[index1].selected = true;
            }
          })
        }
      })
    },
    pageChange(value) {
      this.currentPage = value
      this.scenceUserPage()
    },
    cancelUser(row) {
      if (this.selectedIds && (this.selectedIds.findIndex((item) => item.scenceUser.userId == row.userId) != -1)) {
        this.selectedUsers.push(row)
      } else {
        let index = this.selectedUsers.findIndex((item) => item.userId == row.userId)
        this.selectedUsers.splice(index, 1);
      }
      let index1 = this.userList.findIndex((item) => item.id == row.id);
      this.userList[index1].selected = false;
      this.TableKey++
    },
    addUser(row) {
      row.selected = true;
      this.TableKey++
      if (this.selectedIds && (this.selectedIds.findIndex((item) => item.scenceUser.userId == row.userId) != -1)) {
        let index = this.selectedUsers.findIndex((item) => item.userId == row.userId)
        this.selectedUsers.splice(index, 1);
      } else {
        this.selectedUsers.push(row);
      }
    },
    addPermission() {
      let select = []
      if (this.selectedUsers) {
        for (var i = 0; i < this.selectedUsers.length; i++) {
          select.push(this.selectedUsers[i].userId)
        }
      }
      let params = {
        officeId: this.officeId,
        ids: select
      }
      addBuildingPer(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
        }
        this.handleClose()
      })
    },
    handleClose() {
      this.selfVisible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.noPadding {
  .el-dialog__body {
    padding: 0;
  }
  .el-button--small {
    width: auto !important;
  }
  .el-table th,
  .el-table td {
    padding: 9px 0;
  }
  .el-button--primary.is-plain:hover,
  .el-button--primary.is-plain:focus {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
}
</style>

<style lang="scss" scoped>
.dialog_dev {
  display: flex;
  .leftContent {
    width: 222px;
    height: 665px;
  }
  .treeHeader {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding-left: 10px;
    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
  .highlight {
    background-color: #409eff;
    color: white;
    i {
      color: white;
    }
  }
  .content {
    width: 100%;
    height: 500px;
  }
  .right_table {
    flex: 1;
    padding: 10px;
  }
}
</style>
