 <template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent property-left">
            <data-tree :page="page" :initFormHeader="initForm" :TreeData="TreeData" @fetchData="fetchData" @handleBuildingId="handleBuildingId" @getHouseTreeData="getHouseTreeData" :hideHandle="false" />
            <div class="access-content">
              <div @click="handleNodeClickAccess({ type: 'building', id: '' })" :class="['treeHeader', highlightStatus ? '' : 'highlight']">
                <i class="iconfont icon-shuji"></i>
                全部通道
                <el-dropdown class="dropdownAll" placement="bottom-start">
                  <i class="iconfont icon-gengduo"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="add">
                      <p @click="(dialogCreateAccess = true), (accessUpdate = false)">添加通道</p>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <el-tree :data="accessData" node-key="id" accordion :highlight-current="highlightStatus" :default-expand-all="false" :expand-on-click-node="false" @node-click="handleNodeClickAccess" :props="{ label: 'name' }">
                <span slot-scope="{ node }" @mouseenter="MouseNnter(node.id)" @mouseleave="MouseLeave(node.id)" :class="['custom-tree-node']">
                  <span> {{ node.label }}</span>
                  <div style="position: relative">
                    <el-dropdown placement="bottom-start">
                      <i v-show="node.id === showMenu" class="iconfont icon-gengduo"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="add">
                          <p @click="updateAccess(node.data)">编辑</p>
                        </el-dropdown-item>
                        <el-dropdown-item command="del">
                          <p @click="deleteAccess(node.data)">删除</p>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </span>
              </el-tree>
            </div>
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <action-header :exportUrl="exportUrl" exportName="办公室.xlsx" ref="actionHeader" :initFormHeader="initForm" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :moreStatus="false" :houseStatus="true" :total="page.total" @fetchData="fetchData" @handleCutStatus="handleCutStatus">
                  <!-- <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="export">导出</el-dropdown-item>
                  </el-dropdown-menu> -->
                  <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                    <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                      批量删除
                    </el-button>
                  </div>
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">姓名:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.userName" placeholder="输入用户姓名" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">电话:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.phone" placeholder="输入用户电话" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">证件号码:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.idCardNo" placeholder="输入用户证件号" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">门牌号:</span>
                      <el-input clearable @keyup.enter.native="emitFetchData" class="input-filter" v-model.trim="filterForm.serialNumber" placeholder="输入门牌号" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">办公室状态:</span> &nbsp;&nbsp;
                      <el-select class="select-class" size="small" v-model="filterForm.status" placeholder="请选择办公室状态筛选">
                        <el-option label="在住" value="NORMAL"></el-option>
                        <el-option label="闲置" value="UNUSED"></el-option>
                      </el-select>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">办公室类型:</span> &nbsp;&nbsp;
                      <el-select class="select-class" size="small" v-model="filterForm.officeType" placeholder="请选择办公室类型">
                        <el-option label="会议室" value="2">会议室</el-option>
                        <el-option label="办公室" value="1">办公室</el-option>
                      </el-select>
                    </div>
                  </div>
                </action-header>
              </el-col>
            </el-row>
            <el-table ref="table" v-show="!cutBtnType" :data="list_data" stripe border v-loading="showLoading" highlight-current-row @cell-mouse-enter="enterRowChange" @selection-change="handleSelectionChange" @cell-mouse-leave="leaveRowChange" @sort-change="sortChange">
              <el-table-column v-if="globalUpdateStatus" type="selection" align="center" width="50"></el-table-column>
              <el-table-column type="index" align="center" label="序号" class="indexNum" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="locationName" :show-overflow-tooltip="true" label="办公室">
                <template slot-scope="scope">
                  <el-button @click="showHouseDetails(scope.row)" type="text">
                    {{
                      `${scope.row.groupName}-${scope.row.buildingName}-${scope.row.storey}层-${scope.row.serialNumber}`
                    }}</el-button>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" label="类别">
                <template slot-scope="scope">
                  {{scope.row.officeType==1?'办公室':'会议室'}}
                </template>
              </el-table-column>
              <el-table-column prop="personCnt" align="center" sortable="custom" label="注册人数"></el-table-column>

              <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
                <template slot-scope="scope">
                  <span class="rowUpdate" v-show="!scope.row.noteStatus" @click="focusNoteInput(scope.row)">{{ scope.row.note || "--" }}</span>
                  <el-input :ref="scope.row.id" size="mini" @blur="confirmUpdateNote(scope.row)" v-model="noteString" v-show="scope.row.noteStatus" :clearable="true" placeholder="输入备注"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center" v-if="globalUpdateStatus">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-if="!cutBtnType" style="margin-top:10px" background layout="prev, pager, next" :current-page.sync="page.page" :page-size="page.limit" :total="page.total" @current-change="pageChange"></el-pagination>
            <div style="z-index: 9" :class="rowSpan === 12 ? menuControl1 : menuControl2" @click="menuVisible">
              <p class="close-menu">
                <i v-if="rowSpan === 12" class="iconfont icon-left icon-class"></i>
                <i v-else class="iconfont icon-zuo icon-class"></i>
              </p>
            </div>
          </div>
        </template>
      </split-pane>
    </div>

    <!-- 新建办公室 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" title="添加办公室" :visible.sync="dialogCreate" width="500px" :before-close="handleClose">
      <el-form :model="Form" :rules="rules" ref="Forms" label-width="120px" label-position="right" style="margin-right: 40px">
        <el-form-item label="所属楼栋单元:" prop="buildingId">
          <el-cascader style="width: 100%" v-model="Form.buildingIdArr" :options="TreeData" :props="{ label: 'name', children: 'subBuildings', value: 'id' }" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="所属楼层:" prop="storeyNum">
          <el-input clearable v-model="Form.storeyNum" placeholder="输入楼层"></el-input>
        </el-form-item>
        <el-form-item label="办公室名称:" prop="serialNumber">
          <el-input clearable v-model="Form.serialNumber" maxlength="10" placeholder="输入办公室名称"></el-input>
        </el-form-item>

        <el-form-item label="房间类别:" prop='officeType'>
          <el-select v-model="Form.officeType" placeholder="请选择" style="width:270px">
            <el-option label="办公室" value="1"></el-option>
            <el-option label="会议室" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息:" prop="note">
          <el-input type="textarea" v-model="Form.note" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" :disabled="addStatus" type="primary" @click="addHouseConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 办公室信息 -->
    <el-dialog class="newDialog spPadding" width="722px" :close-on-click-modal="false" :title="'编号: ' + detailDialog.serialNumber" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName">
        <el-tab-pane label="详细信息" name="详细信息">
          <el-form label-width="130px" :model="detailDialog">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom: 0" label="所在单元:">
                  <span>{{
                    detailDialog.buildingName ? detailDialog.buildingName : "0"
                  }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="所在楼层:">
                  <span>{{
                    detailDialog.storey ? detailDialog.storey : ""
                  }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="门牌号:">
                  <span>{{
                    detailDialog.serialNumber ? detailDialog.serialNumber : ""
                  }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item style="margin-bottom: 0" label="注册人数:">
                  <span>{{
                      detailDialog.personCnt ? detailDialog.personCnt : "0"
                    }}人</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="办公室状态:">
                  <span>{{ detailDialog.status }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="备注信息:">
                  <span>{{ detailDialog.note || "" }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="在住人员" name="在住人员">
          <!-- <el-button type="primary" size="mini" style="margin: 10px 0 0 15px" @click="dialogCreatePerson = true">添加成员</el-button> -->
          <el-button type="primary" size="mini" style="margin: 10px 0 0 15px" @click="choosePersonDialog = true">添加成员</el-button>
          <div class="in-personnel">
            <div class="personnel-item" v-for="(item, index) in dtailTable" :key="index">
              <div class="personnel-target" v-if="item.scenceUser">
                <img v-if="item.scenceUser.face" class="personner-img" :src="item.scenceUser.face" alt />
                <img v-else class="personner-img" src="../../../assets/none.png" alt />
                <p class="personner-text personner-name" :title="item.scenceUser.name">
                  姓名：{{ item.scenceUser.name }}
                </p>
                <p class="personner-text">
                  电话：{{
                    item.scenceUser.phone.length > 11
                      ? "无电话"
                      : item.scenceUser.phone
                  }}
                </p>
                <el-button style="width: 106px" type="primary" plain size="mini" @click="deleteHousePeople(item, index)">删除</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 人员详情 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" :title="PersonDetailDialog.name" :visible.sync="personDialogFormVisible">
      <el-tabs type="card" v-model="personActiveName">
        <el-tab-pane label="详细信息" name="first">
          <el-form label-width="130px" :model="PersonDetailDialog">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom: 0" label="姓名:">
                  <span>{{
                    PersonDetailDialog.userName
                      ? PersonDetailDialog.userName
                      : ""
                  }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="性别:">
                  <span>{{
                    PersonDetailDialog.sex === "1" ? "男" : "女"
                  }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="手机号:">
                  <span>{{
                    PersonDetailDialog.userPhone
                      ? PersonDetailDialog.userPhone
                      : ""
                  }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom: 0" label="证件类型:">
                  <span>{{ PersonDetailDialog.cardName || "" }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="证件号码:">
                  <span>{{ PersonDetailDialog.cardNo || "" }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="备注信息:">
                  <el-input @blur="confirmUpdateUserNote(PersonDetailDialog)" maxlength="200" v-model="PersonDetailDialog.note" placeholder="编辑备注信息(最多输入200字)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="second">
          <el-table border stripe :data="personPassTable" style="width: 100%">
            <el-table-column prop="name" align="center" label="姓名" width="150px"></el-table-column>
            <el-table-column prop="passTime" :show-overflow-tooltip="true" align="center" label="通行时间"></el-table-column>
            <el-table-column prop="inOut" align="center" label="出入类型" width="100px"></el-table-column>
            <el-table-column prop="passMethod" align="center" width="150" label="通行方式">
              <template slot-scope="{ row }">
                <span>{{ row.passMethod | passMethod }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="抓拍图片">
              <template slot-scope="{ row }">
                <img v-if="row.photos" :src="row.photos" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="pagePassChange" style="margin-top: 10px" background layout="prev, pager, next" :total="passList.total"></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="车辆信息" name="third">
          <el-table border stripe :data="carDtailTable" style="width: 100%">
            <el-table-column prop="carNo" align="center" label="车牌号"></el-table-column>
            <el-table-column prop="carType" align="center" label="车辆类型"></el-table-column>
            <el-table-column prop="modal" align="center" label="型号"></el-table-column>
            <el-table-column align="center" label="照片">
              <template slot-scope="{ row }">
                <img v-if="row.photo" :src="row.photo" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="办公室信息" name="five">
          <el-table border stripe :data="houseDtailTable" style="width: 100%">
            <el-table-column align="center" :show-overflow-tooltip="true" prop="serialNumber" label="门牌号">
              <template slot-scope="{ row }">
                <span>{{ row.groupName }} - {{ row.buildingName }} -
                  {{ row.serialNumber }}</span>
                <!-- <el-button @click='showHouseDetail(row)' type='text'>{{ row.groupName }} - {{ row.buildingName }} - {{ row. serialNumber}}</el-button> -->
              </template>
            </el-table-column>

            <el-table-column align="center" label="用户类型">
              <template slot-scope="{ row }">{{
                row.type | typeFilter
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="邀请访客">
              <template slot-scope="{ row }">{{
                row.enableInviteVisitor === "1" ? "允许" : "禁止"
              }}</template>
            </el-table-column>
            <el-table-column align="center" label="远程开门">
              <template slot-scope="{ row }">{{
                row.enableRemoteOpen === "1" ? "允许" : "禁止"
              }}</template>
            </el-table-column>

            <el-table-column align="center" :show-overflow-tooltip="true" prop="note" label="备注">
              <template slot-scope="{ row }">
                <span>{{ row.note }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="createTime" label="操作" :key="Math.random()" v-if="globalUpdateStatus">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteHouse(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="人脸库信息" name="six">
          <el-table :data="faceList" border stripe style="width: 100%">
            <el-table-column align="center" width="50" type="index" label="编号"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="devSerialNumber" label="设备序列号"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="devType" label="设备区分"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="address" label="通行位置"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="createTime" label="注册时间"></el-table-column>
            <el-table-column width="80" align="center" label="人脸图片">
              <template slot-scope="{ row }">
                <img v-if="row.face" :src="row.face" alt />
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="personDialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加成员 -->
    <el-dialog top="10vh" class="newDialog" title="添加办公成员" width="700px" :close-on-click-modal="false" :visible.sync="dialogCreatePerson" :before-close="handleClosePerson">
      <el-form class="owner" :model="personForm" :rules="personRules" ref="Forms" label-width="140px" style="margin-right: 40px">
        <el-form-item style="margin-bottom: 16px" label="电话:" prop="phone">
          <el-autocomplete style="width: 100%" clearable placeholder="输入需要添加的办公成员电话" v-model="personForm.phone" :maxlength="11" :fetch-suggestions="remoteMethod" @keyup.native="UpNumber" @keydown.native="UpNumber" @change="clearableBtn" @input="hint" @focus="hintFocus" @blur="hintBlur" @mouseover.native="hint(personForm.phone)" @mouseout.native="hint(personForm.phone)" @select="handleSelectWatchlist">
            <template slot-scope="{ item }">
              <span style="float: left">{{ item.phone }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.name }}
              </span>
            </template>
          </el-autocomplete>
        </el-form-item>

        <el-form-item style="margin-bottom: 16px" label="人脸:" prop="baseFace">
          <el-upload ref="upload" class="avatar-uploader" :action="config.v5 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="姓名:" prop="name">
          <el-input :disabled="nameDisabled" clearable maxlength="10" v-model="personForm.name" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="性别:" prop="sex">
          <el-select style="width: 100%" :disabled="nameDisabled" size="small" v-model="personForm.sex" placeholder="请选择">
            <el-option label="请选择" value></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="float" label="出生日期:" prop="birthday">
          <el-date-picker :disabled="nameDisabled" style="width: 100%" v-model="personForm.birthday" type="date" format="yyyy - MM - dd" :picker-options="pickerOptionsUser" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="证件类型:">
          <el-select style="width: 100%" :disabled="nameDisabled" @change="(personForm.cardNo = ''), (personForm.cardName = '')" size="small" v-model="personForm.idcardType" placeholder="请选择证件类型">
            <el-option label="身份证" value="身份证"></el-option>
            <el-option label="护照" value="护照"></el-option>
            <el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" v-show="personForm.idcardType === '其它'" label="证件名称:">
          <el-input :disabled="nameDisabled" maxlength="10" v-model="personForm.cardName" clearable placeholder="证件名称"></el-input>
        </el-form-item>

        <el-form-item style="margin-bottom: 16px" label="证件号码:">
          <el-input :disabled="nameDisabled" :maxlength="personForm.idcardType === '身份证' ? '18' : '20'" clearable v-model="personForm.cardNo" :placeholder="'输入证件号'"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="非工作日是否通行:" :rules="{ required: true }">
          <el-radio-group v-model="personForm.restDayPass">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="通行时间:" :rules="{ required: true }">
          <el-time-picker is-range v-model="passTime" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm" format="HH:mm" :clearable="false">
          </el-time-picker>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="备注信息:" prop="note">
          <el-input type="textarea" v-model="personForm.note" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClosePerson">取 消</el-button>
        <el-button size="small" type="primary" :loading="btnLoading" @click="addUserConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加通道 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" :title="!accessUpdate ? '添加通道口' : '修改通道口'" :visible.sync="dialogCreateAccess" width="500px" :before-close="handleCloseAccess">
      <el-form :model="accessForm" :rules="accessrRules" ref="accessForm" label-width="120px" label-position="right" style="margin-right: 40px">
        <el-form-item label="所属楼栋单元:" prop="buildingId" v-if="!accessUpdate">
          <el-cascader style="width: 100%" v-model="accessForm.buildingIdArr" :options="TreeData" :props="{ label: 'name', children: 'subBuildings', value: 'id' }" @change="handleChangeBuild"></el-cascader>
        </el-form-item>
        <el-form-item label="所属楼栋单元:" v-else>
          <p>{{ rowLine.buildingName }}</p>
        </el-form-item>
        <el-form-item label="所属楼层:" prop="storeyNum" v-if="!accessUpdate">
          <el-input clearable v-model="accessForm.storeyNum" placeholder="输入楼层"></el-input>
        </el-form-item>
        <el-form-item label="所属楼层:" v-else>
          <p>{{ rowLine.storeyNum }}</p>
        </el-form-item>
        <el-form-item label="通道口名称:" prop="name">
          <el-input clearable v-model="accessForm.name" placeholder="输入通道口名称" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="关联办公室:" :rules="{ required: true }">
          <el-button size="mini" type="primary" @click="openChooseRoom" style="margin-left: 10px">点击选择</el-button>
          <span>已关联{{ dialogChooseRoom.selectedRoom.length }}个</span>
        </el-form-item>
        <el-form-item label="备注信息:" prop="note">
          <el-input type="textarea" v-model="accessForm.note" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseAccess">取 消</el-button>
        <el-button size="small" :loading="addPasswayStatus" type="primary" @click="addPasswayConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <DialogChooseRoom :buildId="accessForm.buildingId" :visible="dialogChooseRoom.visible" @selectRoom="handleSelectRoom" ref="choose"></DialogChooseRoom>
    <choosePersonDialog :visible="choosePersonDialog" :officeId="houseId" :selectedIds="dtailTable" @close="closeAdd"></choosePersonDialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import mixin from "@/config/minxins";
import { getBase64 } from "@/utils/index.js";
import {
  getHouseTreeData,
  addHouse,
  updateStatusNote,
  getRegisterPeople,
  deleteTheHousePeople,
  getHouseListByUserId,
  getCardListByHouseId,
  deleteDoorCard,
  addPassageway,
  updatePassageway,
  deletePassageway,
  getPassageway,
  getPassagewayInfo,
} from "@/api/houseApi.ts";
import { _throttle } from "@/utils";
import config from "@/api/config";
import { getUserPropertyCar } from "@/api/carApi.ts";
import {
  getUserPropertyPass,
  getFaceList,
  updateUserNote,
  addPeople,
  userHouseUpdate,
  queryUserPhone, //根据手机号模糊查询办公成员
} from "@/api/peopleApi.ts";
import { getCarStallByUserId } from "@/api/carApi.ts";
import splitPane from "vue-splitpane";

const ActionHeader = () => import("@/components/ActionHeader.vue");
const DataTree = () => import("@/components/DataTree.vue");
const DialogChooseRoom = () => import("./components/DialogChooseRoom.vue");
import choosePersonDialog from "./components/choosePersonDialog.vue";

@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DataTree,
    // FloorControl,
    splitPane,
    DialogChooseRoom,
    choosePersonDialog,
  },
  filters: {
    status(val: string) {
      const data = {
        "1": "在住",
        "2": "出租",
        "3": "闲置",
      };
      return data[val];
    },
    type(val: string) {
      const data = {
        "1": "业主",
        "2": "租户",
        "3": "家庭成员",
      };
      return data[val];
    },
    peopleStatus(val: string) {
      const data = {
        "0": "在住",
        "-1": "不在住",
        "-2": "过期",
      };
      return data[val];
    },
    typeFilter(val: string) {
      const data = {
        OWNER: "业主",
        RELATION: "家庭成员",
        TENEMENT: "租户",
      };
      return data[val];
    },
  },
})
export default class CardManage extends Vue {
  private cutBtnType: Boolean = false;
  dialogCreatePerson: Boolean = false;
  queryBuildingId: String = ""; //通过dataTree获取到的宿舍楼id
  queryBuildingName: String = ""; //通过dataTree获取到的宿舍楼名称
  floorControlStatus: Boolean = false;
  exportUrl: string = config.v5 + "/admin/office/export";
  config: any = config;
  private rowSpan: number = 12;
  initForm: object = {
    url: config.v5 + "/admin/office",
    method: "get",
  };
  addStatus: boolean = false;
  filterForm: object = {
    serialNumber: "",
    status: [],
    buildingId: "",
    passagewayId: "",
    userName: "",
    idCardNo: "",
    phone: "",
    officeType: "",
  };
  deleteForm: object = {
    url: config.v5 + "/admin/office",
    method: "delete",
    data: [],
    message: `此操作将永久删除选中的办公室,绑定的办公成员同时进行删除, 删除后办公室将不存在,请谨慎操作!`,
  };
  Form: object = {
    buildingIdArr: [],
    buildingId: "",
    note: "",
    serialNumber: "",
    status: "",
    storeyNum: "",
    officeType: "",
  };
  personRules: any = {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    type: [{ required: true, message: "请选择用户类型", trigger: "blur" }],
    cardName: [{ required: true, message: "请填入证件名", trigger: "change" }],
    phone: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (!this["is_Phone"](value)) {
            callback(new Error("填写正确的手机号"));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ],
    cardNo: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (
            !(value.length === 15 || value.length === 18) &&
            this.Form["idcardType"] === "身份证"
          ) {
            callback(new Error("填写正确的证件号号"));
          } else {
            callback();
          }
        },
      },
    ],
    idcardType: [{ required: true, trigger: "change", message: "请选择证件" }],
  };
  rules: any = {
    serialNumber: [
      {
        required: true,
        trigger: "blur",
        message: "请输入办公室名称",
      },
    ],
    buildingId: [
      { required: true, message: "请选择所属楼栋单元", trigger: "change" },
    ],
    officeType: [
      { required: true, message: "请选择办公室类别", trigger: "change" },
    ],
    status: [
      { required: true, message: "请选择当前办公室状态", trigger: "change" },
    ],
    storeyNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的楼栋层数(最大层数99)"));
          } else {
            if (value > 99) {
              callback(new Error("填写正确的楼栋层数(最大层数99)"));
            } else {
              callback();
            }
          }
        },
      },
    ],
    idCardNo: [
      { required: true, message: "请选择当前办公室的组别", trigger: "change" },
    ],
  };
  accessrRules: any = {
    buildingId: [
      { required: true, message: "请选择所属楼栋单元", trigger: "change" },
    ],
    name: [{ required: true, message: "请填写通道口名称", trigger: "blur" }],
    storeyNum: [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (!/^\+?[1-9]\d*$/.test(value)) {
            callback(new Error("填写正确的楼栋层数(最大层数99)"));
          } else {
            if (value > 99) {
              callback(new Error("填写正确的楼栋层数(最大层数99)"));
            } else {
              callback();
            }
          }
        },
      },
    ],
  };
  selectVal: Array<Object> = [];
  TreeData: Array<Object> = []; // 树形结构数据
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  updateArray: Array<string> = ["noteStatus", "houseStatus"];
  noteString: string = ""; // 修改的备注
  private dialogFormVisible: Boolean = false;
  houseId: string = "";
  private detailDialog: Object = {
    //查看目标详情
    name: "",
  };
  options: object = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    },
  };
  private activeName: String = "详细信息";
  private dtailTable: Array<Object> = []; // 当前办公室下的注册人员

  // 办公成员详情 后期添加的
  personActiveName: string = "first";
  personDialogFormVisible: boolean = false; // 办公成员详情弹框状态
  PersonDetailDialog: object = {};
  personPassTable: Array<object> = []; // 人员通行记录
  carDtailTable: Array<object> = []; // 车辆信息
  houseDtailTable: Array<object> = []; // 办公室信息
  faceList: Array<object> = []; // 人脸库信息
  nameDisabled: boolean = false;
  imageUrl: string = "";
  loading: boolean = false;
  btnLoading: boolean = false;
  phoneList: Array<object> = [];
  personForm: any = {
    name: "",
    cardName: "",
    cardNo: "",
    sex: "",
    phone: "",
    house: [],
    note: "",
    birthday: "",
    houseName: "",
    idcardType: "身份证",
    type: "",
    overTime: "",
    restDayPass: 1,
  };
  passTime: any = [];
  passList: object = {
    id: "",
    limit: 10,
    page: 1,
  };
  facePage: object = {
    id: "",
  };
  cardList: Array<object> = []; // 门禁卡列表
  carList: Array<object> = []; // 车位信息列表
  highlightStatus: boolean = false; // 高亮状态-通道
  dialogCreateAccess: boolean = false; // -添加编辑通道弹窗
  accessForm: any = {
    buildingIdArr: [],
    buildingId: "",
    storeyNum: "",
    name: "",
    note: "",
  };
  accessUpdate: boolean = false;
  accessData: Array<object> = [
    { label: "通道1", id: 5 },
    { label: "通道2", id: 1 },
    { label: "通道3", id: 2 },
    { label: "通道4", id: 3 },
    { label: "通道5", id: 4 },
  ]; //通道
  private showMenu: Number = 0;
  addPasswayStatus: boolean = false;
  dialogChooseRoom: any = {
    visible: false,
    selectedRoom: [],
  };
  rowLine: any = {};

  choosePersonDialog: boolean = false;
  ComponentCommand(houseStatus: string, row: object) {
    return {
      ...row,
      houseStatus,
    };
  }
  getPassageway() {
    getPassageway({ buildingId: this.queryBuildingId }).then((res) => {
      this.accessData = res.data.data;
    });
  }
  handleClosePerson() {
    for (let key in this.personForm) {
      this.personForm[key] = "";
    }
    this.personForm["house"] = [];
    this.personForm["passTime"] = ["00:00", "23:59"];
    this.$refs["Forms"]["resetFields"]();
    this["dialogCreatePerson"] = false;
    this.nameDisabled = false;
    this.imageUrl = "";
    this.$refs["upload"]["clearFiles"]();
  }
  async remoteMethod(query: string, cb) {
    /**@description 根据姓名模糊查询人员 */
    if (query !== "") {
      this.loading = true;
      setTimeout(async () => {
        if (query.length >= 1 && query.length < 12) {
          const { data } = await queryUserPhone(query);
          this.loading = false;
          this.phoneList = data.data;
          if (!this.phoneList.length) {
            this.$refs["Forms"]["clearValidate"]();
            if (this.nameDisabled) {
              this["$util"].resetObj(this.personForm, {
                idcardType: "身份证",
                phone: this.personForm.phone,
              });
            }
            this.nameDisabled = false;
          }
          cb(this.phoneList);
        } else {
          cb([]);
        }
      }, 200);
    } else {
      cb([]);
    }
  }
  handleSelectionChange(arr) {
    this.deleteForm["data"] = [];
    arr.forEach((ele) => {
      this.deleteForm["data"].push(ele.id);
    });
    this.selectVal = arr;
  }

  //选择搜索出来的用户
  handleSelectWatchlist(item) {
    this.$refs["Forms"]["clearValidate"]();
    const Name = ["身份证", "护照", "港澳居民来往内地通行证"];
    this.personForm["phone"] = item.phone;
    // if (item.name) {
    this.personForm["name"] = item.name;
    this.personForm["sex"] = item.sex;
    this.personForm["idcardType"] = Name.includes(item.cardName)
      ? item.cardName
      : "其它";
    this.personForm["cardName"] = item.cardName;
    this.personForm["birthday"] = item.birthday;
    this.personForm["cardNo"] = item.cardNo;
    this.personForm["note"] = item.note;
    this.nameDisabled = true;
  }
  // 添加用户 办公室的时间限制
  pickerOptionsUser: object = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };
  // 时间修改失去焦点
  blurDate(row) {
    row.validDateStatus = false;
    this.$forceUpdate();
  }
  /// 修改用户过期时间
  validDateChange(overTime: string, id: string) {
    userHouseUpdate({ overTime, id })
      .then((res: any) => {
        if (res.data.code === 200) {
          this["message"]("success", "修改过期日期成功");
          this.fetchData(this.initForm);
        }
      })
      .catch((err) => {
        this.fetchData(this.initForm);
      });
  }
  beforeAvatarUpload(file) {
    getBase64(file.raw).then((res) => {
      this.imageUrl = res;
    });
  }
  // 切换到修改时间框
  showUpdateTime(row) {
    this["dtailTable"].forEach((element) => {
      element["validDateStatus"] = false;
    });
    row.validDateStatus = !row.validDateStatus;
    this.$nextTick(() => {
      this.$refs.datePicker[0].focus();
    });
    this.$forceUpdate();
  }
  // 确定添加办公成员
  addUserConfirm() {
    this.btnLoading = true;
    if (this.personForm.idcardType !== "其它") {
      this.personForm.cardName = this.personForm.idcardType;
    }
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        let param = {
          name: this.personForm.name,
          idcardType:
            this.personForm.cardNo == "" && this.personForm.cardName == "身份证"
              ? ""
              : this.personForm.cardName,
          idcardNo: this.personForm.cardNo,
          sex: this.personForm.sex,
          phone: this.personForm.phone,
          officeId: [this.houseId],
          note: this.personForm.note,
          birthday: this.personForm.birthday,
          overTime: this.personForm.overTime,
          baseFace: this.imageUrl,
          restDayPass: this.personForm.restDayPass,
          passStartTime: this.passTime[0],
          passEndTime: this.passTime[1],
        };
        addPeople(param)
          .then((res) => {
            if (res.data.code === 200) {
              this["message"]("success", "添加成功");
              this["dialogCreate"] = false;
              this["dialogCreatePerson"] = false;
              this["handleClosePerson"]();
              this.fetchData(this.initForm);
              this.getRegisterPeople(this.houseId);
              this.btnLoading = false;
            }
          })
          .catch((err) => {
            this.btnLoading = false;
          });
      } else {
        this.btnLoading = false;
      }
    });
  }
  // 查看办公室下的某个办公成员的详细信息
  showPersonDetails(row) {
    this.personDialogFormVisible = true;
    this.PersonDetailDialog = Object.assign({}, row);
    this.passList["id"] = row.userId;
    this.personActiveName = "first";
    // 获取人员通行记录
    this.pagePassChange(1);
    // 获取物业人员的车辆信息
    getUserPropertyCar(row.userId).then((res) => {
      this.carDtailTable = res.data.data;
    });
    this.facePage["userId"] = row.userId;
    // 获取人脸库信息
    this.fetchFaceList();
    // 获取办公室列表信息
    getHouseListByUserId(row.userId).then((res) => {
      this.houseDtailTable = res.data.data;
    });
  }

  closeAdd() {
    this.choosePersonDialog = false;
    this.getNum();
    this.fetchData(this.initForm);
  }

  async getNum() {
    await getRegisterPeople(this.houseId).then((res) => {
      this.dtailTable = res.data.data;
      this.detailDialog.personCnt = this.dtailTable.length;
    });
  }

  // 获取人脸库列表
  fetchFaceList() {
    getFaceList(this.facePage).then((res) => {
      this.faceList = res.data.data;
    });
  }

  // 确定修改 备注
  confirmUpdateUserNote() {
    if (!this.PersonDetailDialog["note"]) {
      return this["message"]("error", "请输入备注信息");
    }
    updateUserNote(
      this.PersonDetailDialog["userId"],
      this.PersonDetailDialog["note"]
    ).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "修改成功");
        this.noteString = "";
        this.fetchData(this.initForm);
        getRegisterPeople(this.houseId).then((res) => {
          this.dtailTable = res.data.data;
        });
      } else {
        this["message"]("error", res.data.message);
      }
    });
  }

  // 获取特定办公成员的通行记录
  pagePassChange(page: number) {
    this.passList["page"] = page;
    getUserPropertyPass(this.passList).then((res) => {
      this.personPassTable = res.data.data.records;
      this.passList["total"] = res.data.data.total;
    });
  }

  // 删除办公室下的某个用户
  deleteHousePeople(row, index) {
    this.$confirm(
      `此操作将永久删除该办公室下的办公成员,删除后${row.scenceUser.name}将不与该办公室绑定,请谨慎操作!?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        deleteTheHousePeople(row.id, "", "", "").then((res) => {
          if (res.data.code === 200) {
            this.dtailTable.splice(index, 1);
            this.fetchData(this.initForm);
          }
        });
      })
      .catch(() => {
        this["message"]("error", "已取消删除");
      });
  }

  // 注册人数排序
  sortChange({ column, prop, order }) {
    this.initForm["params"]["orderColumn"] = prop;
    this.initForm["params"]["asc"] = order !== "ascending";
    this["fetchData"](this.initForm);
  }

  // 修改备注自动获取焦点
  focusNoteInput(row) {
    this.noteString = row.note;
    row.noteStatus = !row.noteStatus;
    this.$nextTick(() => {
      const input = this.$refs[row.id] as HTMLElement;
      input.focus();
    });
  }

  resize() {}

  showHouse(val) {
    /**@description 楼控查看详情 */
    this.showHouseDetails(val.row[val.key]);
  }

  // 查看办公室的具体信息
  showHouseDetails(row) {
    this.dialogFormVisible = true;
    this.activeName = "详细信息";
    this.detailDialog = Object.assign(this.detailDialog, row);
    this.houseId = row.id;
    // 获取在住人员
    this.getRegisterPeople(row.id);
  }
  getRegisterPeople(id) {
    getRegisterPeople(id).then((res) => {
      this.dtailTable = res.data.data;
      let userList: Array<string> = [];
      this.dtailTable.forEach((ele) => {
        userList.push(ele["scenceUserId"]);
      });
    });
  }
  // 解绑门禁卡
  unbindCard(row, index) {
    this.$confirm(
      `此操作将永久删除该办公室下的此张门禁卡,解绑后将不与该办公室绑定,请谨慎操作!?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        deleteDoorCard([row.id]).then((res) => {
          this.cardList.splice(index, 1);
        });
      })
      .catch(() => {
        this["message"]("error", "已取消删除");
      });
  }

  // 修改管理员状态
  changeStatus(Obj: object) {
    updateStatusNote({
      id: Obj["id"],
      note: Obj["note"],
      status: Obj["houseStatus"],
    }).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "修改成功");
        this["fetchData"](this.initForm);
      }
    });
  }

  handleBuildingId(data) {
    /**@description 获取宿舍楼id */
    this.queryBuildingId = data.id;
    this.queryBuildingName = data.name;
    this.floorControlStatus = !data.subBuildings;
    this.filterForm["passagewayId"] = "";
    if (!!data.subBuildings) {
      this.cutBtnType = false;
    }
    this.getPassageway();
  }

  // 获取办公室结构
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
      this.rules["buildingId"].push({
        required: true,
        trigger: "change",
        validator: (rule, value, callback) => {
          if (!this.Form["buildingIdArr"].length) {
            callback(new Error("请先创建分组和单元楼"));
          } else {
            callback();
          }
        },
      });
      this.accessrRules["buildingId"].push({
        required: true,
        trigger: "change",
        validator: (rule, value, callback) => {
          callback();
        },
      });
    });
  }

  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false;
    this.noteString = "";
  }

  // 修改备注
  confirmUpdateNote(row) {
    updateStatusNote({
      id: row.id,
      note: this.noteString,
      status: row.status,
    }).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "修改成功");
        row.noteStatus = false;
        this.noteString = "";
        this.fetchData(this.initForm);
      } else {
        row.noteStatus = false;
        this["message"]("error", res.data.message);
      }
    });
  }

  // 添加办公室
  addHouseConfirm = _throttle(() => {
    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        this.Form["buildingId"] = [...this.Form["buildingIdArr"]].pop();
        addHouse(this.Form).then((res) => {
          if (res.data.code === 200) {
            this["message"]("success", "添加成功");
            this["dialogCreate"] = false;
            this["fetchData"](this.initForm);
            this.initFloorInfo();
            this["handleClose"]();
          }
        });
      }
    });
  }, 1000);

  created() {
    this.passTime = ["00:00", "23:59"];
    this.getHouseTreeData();
    this.getPassageway();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }

  editType(item) {
    /**@description 修改状态 */
    // this.dialogFormVisible = true;
  }

  handleChange(arr) {
    this.Form["buildingId"] = [...this.Form["buildingIdArr"]].pop();
  }
  handleChangeBuild() {
    this.accessForm["buildingId"] = [...this.accessForm["buildingIdArr"]].pop();
  }
  queryIdetity(row) {
    this.detailDialog = row;
    this.dialogFormVisible = true;
  }

  // **********  楼控  *************
  handleCutStatus(cut) {
    /**@description 切换楼控与列表视图 */
    this.cutBtnType = cut;
    if (cut) {
      this.initFloorInfo();
    } else {
    }
  }

  initFloorInfo() {}

  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 12;
    } else {
      this.rowSpan = 0;
    }
  }
  // 通道
  handleNodeClickAccess(data) {
    this.highlightStatus = !!data.id;
    this.filterForm["passagewayId"] = data.id;
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
    this.fetchData(this.initForm);
  }
  /**显示更多操作图标 */
  MouseNnter(val) {
    this.showMenu = val;
  }
  MouseLeave(val) {
    this.showMenu = 0;
  }
  handleCloseAccess() {
    this.$refs["accessForm"]["resetFields"]();
    this.dialogChooseRoom.selectedRoom = [];
    this.dialogCreateAccess = false;
    this.accessForm = {
      buildingIdArr: [],
      buildingId: "",
      storeyNum: "",
      name: "",
      note: "",
    };
  }
  addPasswayConfirm() {
    this.$refs["accessForm"]["validate"]((valid) => {
      if (valid) {
        this.addPasswayStatus = true;
        let arr: any = [];
        this.dialogChooseRoom.selectedRoom.map((item) => {
          arr.push(item.id);
        });
        let param = {
          name: this.accessForm.name,
          note: this.accessForm.note,
          storeyNum: this.accessForm.storeyNum,
          officeIds: arr,
        };
        if (this.accessUpdate) {
          //编辑
          param["id"] = this.rowLine.id;
          updatePassageway(param)
            .then((res) => {
              this.$message.success("修改成功");
              this.addPasswayStatus = false;
              this.getPassageway();
              this.handleCloseAccess();
            })
            .catch((err) => {
              this.addPasswayStatus = false;
            });
          return;
        }
        //添加
        param["buildingId"] = this.accessForm.buildingId;
        addPassageway(param)
          .then((res) => {
            this.$message.success("添加成功");
            this.addPasswayStatus = false;
            this.getPassageway();
            this.handleCloseAccess();
          })
          .catch((err) => {
            this.addPasswayStatus = false;
          });
      } else {
        return false;
      }
    });
  }
  handleSelectRoom(item) {
    this.dialogChooseRoom.selectedRoom = item;
  }
  updateAccess(data) {
    this.rowLine = data;
    this.accessUpdate = true;
    getPassagewayInfo({ passagewayId: data.id }).then((res) => {
      this.accessForm.name = data.name;
      this.accessForm.note = data.note;
      this.accessForm.buildingId = data.buildingId;
      this.dialogChooseRoom.selectedRoom = res.data.data;
      this.dialogCreateAccess = true;
    });
  }
  deleteAccess(data) {
    this.$confirm("此操作将永久删除该通道, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      deletePassageway({ ids: [data.id] })
        .then((res) => {
          this.$message.success("删除成功");
          this.getPassageway();
        })
        .catch((err) => {
          if (err.code == 405) {
            this.$confirm("该通道还有门禁设备在使用，是否继续删除?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
              deletePassageway({ ids: [data.id], isForce: true }).then(
                (res) => {
                  this.$message.success("删除成功");
                  this.getPassageway();
                }
              );
            });
          }
        });
    });
  }
  openChooseRoom() {
    if (this.accessForm.buildingId == "") {
      this.$message.error("请先选择楼栋单元");
      return;
    }
    this.dialogChooseRoom.visible = true;
  }
}
</script>

<style lang="scss">
.spPadding {
  .el-dialog__body {
    padding: 0 15px 10px;
  }
  .el-button--small {
    width: auto !important;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #f1f3f4;
  }
  .el-tabs__active-bar {
    height: 4px;
  }
  .el-table th,
  .el-table td {
    padding: 9px 0;
  }
}
</style>
<style lang="scss" scoped>
.property-left {
  .content {
    height: calc(50vh - 41px);
  }
  .highlight {
    background-color: #409eff;
    color: white;
  }
  .highlight .icon-gengduo {
    color: white;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}

.access-content {
  width: 100%;
  height: calc(50vh - 41px);
  text-align: left;
  background: #fff;
  border: 1px solid #ebeef5;
  overflow-y: auto;
  overflow-x: auto;
  box-shadow: 0px 0px 8px 0px lightgrey;
  padding-bottom: 10px;
  .treeHeader {
    width: 100%;
    height: 40px;
    text-align: left;
    text-indent: 1em;
    line-height: 40px;
    position: relative;
    i {
      font-size: 20px;
    }
    .icon-gengduo {
      display: none;
    }
    &:hover {
      cursor: pointer;
    }
    &:hover .icon-gengduo {
      display: block;
    }
  }
  .dropdownAll {
    width: 10px;
    height: 10px;
    position: absolute;
    right: 30px;
    top: 0px;
  }
}

.demo-block {
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

.serial-num {
  position: relative;
}

.rightContent {
  flex: 1;
  box-shadow: 0px 6px 5px 0px lightgray;
  position: relative;
}

.menu-control {
  position: absolute;
  top: 32vh;
  left: -10px;
}

.menu-visible {
  position: absolute;
  top: 32vh;
  left: -11px;
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
.components-container {
  position: relative;
  height: 100%;
}
.in-personnel {
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
}
.personnel-item {
  margin: 10px 0 0 16px;
}
.personnel-target {
  box-shadow: 4px 0 4px 0 rgba(22, 87, 184, 0.13), 0 2px 4px rgba(0, 0, 0, 0.12);
  padding: 5px;
}
.personner-img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  display: block;
  margin: 0 auto 4px;
}
.personner-text {
  line-height: 20px;
  font-size: 12px;
}
.personner-name {
  width: 110px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  border: 1px solid #8c939d;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
