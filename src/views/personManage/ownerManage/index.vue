<template>
  <div class="app-container">
    <div class="components-container">
      <split-pane split="vertical" @resize="resize" :min-percent="10" :default-percent="rowSpan">
        <template slot="paneL">
          <div class="leftContent">
            <data-tree :page="page" :initFormHeader="initForm" :TreeData="TreeData" @fetchData="fetchData" @handleBuildingId="handleBuildingId" @getHouseTreeData="getHouseTreeData" :hideHandle="true" />
          </div>
        </template>
        <template slot="paneR">
          <div class="rightContent">
            <el-row>
              <el-col :span="24">
                <ActionHeader :exportUrl="exportUrl" exportName="办公成员管理.xlsx" :initFormHeader="initForm" ref="actionHeader" @fetchData="fetchData" :filterForm="filterForm" :dialogCreate.sync="dialogCreate" :total="page.total">
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div @click="showExportIn" v-if="globalUpdateStatus">导入</div>
                    </el-dropdown-item>
                    <el-dropdown-item command="export">导出</el-dropdown-item>
                  </el-dropdown-menu>
                  <div slot="delBtn" v-if="globalUpdateStatus && selectVal.length > 1">
                    <el-button type="primary" size="small" icon="el-icon-delete" @click="commandClick({ action: 'delete', row: selectVal })">
                      批量删除
                    </el-button>
                  </div>
                  <div slot="houseNum">
                    <div class="word-filter">
                      <span class="filter-name">姓&nbsp;&nbsp;&nbsp;名:</span>
                      <el-input clearable placeholder="请输入需要查找的姓名" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.name" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">手机号:</span>
                      <el-input clearable placeholder="请输入需要查找的手机号" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.phone" size="small"></el-input>
                    </div>
                    <div class="word-filter">
                      <span class="filter-name">证件号码:</span>
                      <el-input clearable placeholder="请输入需要查找的证件号码" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.cardNo" size="small"></el-input>
                    </div>
                    <!-- <div class="word-filter">
                      <span class="filter-name">门牌号:</span>
                      <el-input clearable placeholder="请输入需要查找的门牌号" @keyup.enter.native="emitFetchData" class="input-filter" v-model="filterForm.serialNumber" size="small"></el-input>
                    </div> -->
                  </div>
                </ActionHeader>
              </el-col>
            </el-row>
            <el-table :data="list_data" border stripe highlight-current-row v-loading="showLoading" :row-class-name="tabRowClassName" @selection-change="handleSelectionChange" @cell-mouse-enter="enterRowChange" @cell-mouse-leave="leaveRowChange">
              <el-table-column v-if="globalUpdateStatus" type="selection" align="center"></el-table-column>
              <el-table-column type="index" width="60" class="indexNum" align="center" label="编号">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                  <div v-if="globalUpdateStatus" class="fun-btn">
                    <el-dropdown trigger="click" placement="bottom-start" @command="commandClick">
                      <el-tooltip class="item" effect="dark" content="点击操作" placement="top">
                        <i v-show="scope.row.showMenu" class="iconfont icon-menu"></i>
                      </el-tooltip>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="update">
                          <p @click="setWorkPass(1, scope.row)">
                            允许非工作日通行
                          </p>
                        </el-dropdown-item>
                        <el-dropdown-item command="update">
                          <p @click="setWorkPass(0, scope.row)">
                            禁止非工作日通行
                          </p>
                        </el-dropdown-item>
                        <el-dropdown-item command="update">
                          <p @click="setPassTime(scope.row)">
                            设置通行时间
                          </p>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" class="serial-num" label="姓名">
                <template slot-scope="scope">
                  <el-button type="text" @click="showDetail(scope.row,scope.$index,scope.row.indexSort)">{{ scope.row.name }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="img" align="center" label="注册人脸">
                <template slot-scope="scope">
                  <img v-if="scope.row.face" class="capture-img cur-img" :src="scope.row.face" alt @click="openUpload(scope.row, 'update')" />
                  <span v-else>
                    <el-button size="mini" type="primary" @click="openUpload(scope.row)">上传人脸</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="phone" align="center" label="电话">
                <template slot-scope="scope">
                  <span v-if="scope.row.phone.length == 11">{{
                        scope.row.phone
                      }}</span>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" label="门禁权限数">
                <template slot-scope="scope">
                  <el-button type="text" @click="showDetail(scope.row,scope.$index,scope.row.indexSort,'limit')">{{ scope.row.devCount }}</el-button>
                </template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" min-width="90" label="是否允许远程开门">
                <template slot-scope="scope">{{
                      scope.row.isRemoteOpen && scope.row.isRemoteOpen == 1
                        ? "允许"
                        : "禁止"
                    }}</template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" min-width="90" label="非工作日是否通行">
                <template slot-scope="scope">{{
                      scope.row.restDayPass ? "允许" : "禁止"
                    }}</template>
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" align="center" label="通行时间">
                <template slot-scope="scope">
                  {{ scope.row.passStartTime || "00:00:00" }}-{{
                        scope.row.passEndTime || "23:59:00"
                      }}
                </template>
              </el-table-column>
              <el-table-column prop="note" :show-overflow-tooltip="true" align="center" label="备注"></el-table-column>
              <el-table-column prop="create_time" :show-overflow-tooltip="true" align="center" label="创建时间">
                <template slot-scope="{ row }">
                  <span>{{ row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center" v-if="globalUpdateStatus">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="pageChange" :page-size="page.limit" :current-page="page.page" style="margin-top: 10px" background layout="prev, pager, next" :total="page.total"></el-pagination>
          </div>
        </template>
      </split-pane>
    </div>

    <el-dialog :close-on-click-modal="false" class="newDialog spPadding" :title="detailDialog.name" :visible.sync="dialogFormVisible" width="900px" @closed="closeDialog">
      <el-tabs v-model="activeName">
        <el-tab-pane label="详细信息" name="first">
          <el-form label-width="130px" :model="detailDialog">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom: 0" label="注册人脸:">
                  <img class="reg-face" v-if="detailDialog.face" @mouseout="imgVisible = false" @mouseover="
                      (imgVisible = true), (bigImg = detailDialog.face)
                    " :src="detailDialog.face" alt="" />
                  <img v-else class="personner-img reg-face" src="../../../assets/none.png" alt />
                </el-form-item>
                <el-form-item label="年龄" style="margin-bottom: 0">
                  <span>{{ detailDialog.age }}</span>
                </el-form-item>
                <el-form-item style="margin-bottom: 0" label="姓名:">
                  <el-input maxlength="10" @input="inputChange" @blur="
                      updateUser({ name: detailDialog.name }, 'nameStatus')
                    " v-show="detailDialog.nameStatus" placeholder="填写修改的姓名" v-model="detailDialog.name"></el-input>
                  <span v-show="!detailDialog.nameStatus">
                    {{ detailDialog.name ? detailDialog.name : "" }}
                  </span>
                  <i class="el-icon-edit" v-if="!detailDialog.nameStatus" @click="detailDialog.nameStatus = true"></i>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="性别:">
                  <el-select size="small" @change="updateUser({ sex: detailDialog.sex }, 'sexStatus')" v-if="detailDialog.sexStatus" v-model="detailDialog.sex" placeholder="请选择性别">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="0"></el-option>
                    <el-option label="未知" value></el-option>
                  </el-select>
                  <span v-else>
                    {{
                      detailDialog.sex === "1"
                        ? "男"
                        : detailDialog.sex === "0"
                        ? "女"
                        : ""
                    }}
                  </span>
                  <i v-if="!detailDialog.sexStatus" @click="detailDialog.sexStatus = true" class="el-icon-edit"></i>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="手机号:">
                  <el-input maxlength="11" @input="inputChange" @blur="confirmUpdatePhone(detailDialog)" v-show="detailDialog.phoneStatus" placeholder="填写修改的手机号" v-model="phoneString"></el-input>
                  <span v-if="detailDialog.phone">
                    <span v-show="!detailDialog.phoneStatus">
                      {{
                        detailDialog.phone.length == 11
                          ? detailDialog.phone
                          : ""
                      }}
                    </span>
                  </span>

                  <i class="el-icon-edit" v-if="!detailDialog.phoneStatus" @click="phoneChange(detailDialog)"></i>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom: 0" label="证件类型:">
                  <el-select v-if="detailDialog.otherCardNameStatus" @change="cardNameChange" size="small" v-model="detailDialog.idcardType" placeholder="请选择证件类型">
                    <el-option label="身份证" value="身份证"></el-option>
                    <el-option label="护照" value="护照"></el-option>
                    <el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
                    <el-option label="其它" value="其它"></el-option>
                  </el-select>
                  <span v-else>{{ detailDialog.idcardType || "" }}</span>
                  <el-input v-if="
                      detailDialog.idcardType === '其它' &&
                      detailDialog.otherCardNameStatus
                    " maxlength="10" @input="inputChange" @blur="
                      updateUser(
                        { idcardType: detailDialog.idcardType },
                        'otherCardNameStatus'
                      ),
                        (detailDialog.idcardType = '')
                    " placeholder="填写其他的证件名" v-model="detailDialog.idcardType"></el-input>
                  <i @click="
                      (detailDialog.otherCardNameStatus = true),
                        checkcardName(detailDialog.idcardType)
                          ? (detailDialog.idcardType = detailDialog.idcardType)
                          : (detailDialog.idcardType = '其它')
                    " v-if="!detailDialog.otherCardNameStatus" class="el-icon-edit"></i>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="证件号码:">
                  <el-input :maxlength="detailDialog.idcardType === '身份证' ? 18 : 100" @input="inputChange" @blur="
                      updateUser(
                        { idcardNo: detailDialog.idcardNo },
                        'cardNoStatus'
                      )
                    " v-if="detailDialog.cardNoStatus" placeholder="填写正确的证件号码" v-model="detailDialog.idcardNo"></el-input>
                  <span v-else>{{ detailDialog.idcardNo || "" }}</span>
                  <i @click="
                      (detailDialog.cardNoStatus = true),
                        checkcardName(detailDialog.idcardType)
                          ? (detailDialog.idcardType = detailDialog.idcardType)
                          : (detailDialog.idcardType = '其它')
                    " v-if="!detailDialog.cardNoStatus" class="el-icon-edit"></i>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="备注信息:">
                  <el-input @input="inputChange" v-if="detailDialog.noteStatus" @blur="
                      confirmUpdateNote,
                        updateUser({ note: detailDialog.note }, 'noteStatus')
                    " maxlength="200" v-model="detailDialog.note" placeholder="编辑备注信息(最多输入200字)"></el-input>
                  <span v-else>{{ detailDialog.note }}</span>
                  <i @click="detailDialog.noteStatus = true" v-if="!detailDialog.noteStatus" class="el-icon-edit"></i>
                </el-form-item>
                <el-form-item style="margin-bottom: 0" label="创建时间:">
                  <span>{{ detailDialog.createTime }}</span>
                </el-form-item>
                <el-form-item style="margin-bottom: 0" label="通行时间:">
                  <el-time-picker style="width: 200px" @blur="
                      updateUser(
                        { passTime: detailDialog.passTime },
                        'passTimeStatus'
                      )
                    " v-if="detailDialog.passTimeStatus" is-range v-model="detailDialog.passTime" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm" format="HH:mm" :clearable="false">
                  </el-time-picker>
                  <span v-else>{{ detailDialog.passStartTime }}-{{
                      detailDialog.passEndTime
                    }}</span>
                  <i @click="detailDialog.passTimeStatus = true" v-if="!detailDialog.passTimeStatus" class="el-icon-edit"></i>
                </el-form-item>
                <el-form-item style="margin-bottom: 0" label="是否允许远程开门:">
                  <el-dropdown @command="isRemoteOpenChange" trigger="click">
                    <span class="el-dropdown-link">
                      <el-tag style="
                          border-radius: 50px;
                          padding: 0 10px;
                          cursor: pointer;
                        " :type="detailDialog.isRemoteOpen ? 'success' : 'danger'">{{
                          detailDialog.isRemoteOpen ? "允许" : "禁止"
                        }}</el-tag>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="1">允许</el-dropdown-item>
                      <el-dropdown-item command="0">禁止</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
                <el-form-item style="margin-bottom: 0" label="非工作日是否通行:">
                  <el-dropdown @command="restDayPassChange" trigger="click">
                    <span class="el-dropdown-link">
                      <el-tag style="
                          border-radius: 50px;
                          padding: 0 10px;
                          cursor: pointer;
                        " :type="detailDialog.restDayPass ? 'success' : 'danger'">{{
                          detailDialog.restDayPass ? "允许" : "禁止"
                        }}</el-tag>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="1">允许</el-dropdown-item>
                      <el-dropdown-item command="0">禁止</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="门禁权限" name="three">
          <el-table :data="doorDetail" border stripe>
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column prop="deviceName" label="通行位置" align="center"></el-table-column>
            <el-table-column label="操作" width="80" align="center" v-if="globalUpdateStatus">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="commandClick({ action: 'delete', row: scope.row })">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="通行记录" name="second">
          <el-table :data="dtailTable" border stripe>
            <el-table-column prop="passTime" :show-overflow-tooltip="true" align="center" label="通行时间"></el-table-column>
            <el-table-column prop="deviceAddress" :show-overflow-tooltip="true" align="center" label="通行位置"></el-table-column>
            <el-table-column prop="deviceInfo.inOut" align="center" label="出入类型" width="100px"></el-table-column>
            <el-table-column prop="passMethod" align="center" width="150" label="通行方式">
              <template slot-scope="{ row }">
                <span>{{ row.passMethod | passMethod }}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="抓拍人脸">
              <template slot-scope="scope">
                <img v-if="scope.row.photos" style="margin-top: 3px" class="capture-img" @mouseout="twoImg.visible = false" @mouseover="showImg(scope)" :src="scope.row.photos" />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="pagePassChange" style="margin-top: 10px" background layout="prev, pager, next" :total="passList.total"></el-pagination>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="activeName == 'three'" size="small" type="primary" @click="dialogChooseRoom.visible = true">门禁权限</el-button>
        <el-button v-if="activeName == 'three'" size="small" type="primary" @click="addPermission">添加</el-button>
        <el-button v-if="activeName != 'three'" size="small" type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加办公成员 -->
    <el-dialog top="10vh" class="newDialog" :title="isUpdate ? '修改办公成员' : '添加办公成员'" width="700px" :close-on-click-modal="false" :visible.sync="dialogCreate" :before-close="handleClose">
      <el-form class="owner" :model="Form" :rules="rules" ref="Forms" label-width="140px" style="margin-right: 40px">
        <el-form-item style="margin-bottom: 16px" label="电话:" prop="phone">
          <el-autocomplete style="width: 100%" clearable placeholder="输入需要添加的办公成员电话" v-model="Form.phone" :maxlength="11" :fetch-suggestions="remoteMethod" @keyup.native="UpNumber" @keydown.native="UpNumber" @change="clearableBtn" @input="hint" @focus="hintFocus" @blur="hintBlur" @mouseover.native="hint(Form.phone)" @mouseout.native="hint(Form.phone)" @select="handleSelectWatchlist">
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
          <el-input :disabled="nameDisabled" clearable maxlength="10" v-model="Form.name" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="性别:" prop="sex">
          <el-select style="width: 100%" :disabled="nameDisabled" size="small" v-model="Form.sex" placeholder="请选择">
            <el-option label="请选择" value></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="float" label="出生日期:" prop="birthday">
          <el-date-picker :disabled="nameDisabled" style="width: 100%" v-model="Form.birthday" type="date" format="yyyy - MM - dd" :picker-options="pickerOptionsUser" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="证件类型:">
          <el-select style="width: 100%" :disabled="nameDisabled" @change="(Form.cardNo = ''), (Form.cardName = '')" size="small" v-model="Form.idcardType" placeholder="请选择证件类型">
            <el-option label="身份证" value="身份证"></el-option>
            <el-option label="护照" value="护照"></el-option>
            <el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" v-show="Form.idcardType === '其它'" label="证件名称:">
          <el-input :disabled="nameDisabled" maxlength="10" v-model="Form.cardName" clearable placeholder="证件名称"></el-input>
        </el-form-item>

        <el-form-item style="margin-bottom: 16px" label="证件号码:">
          <el-input :disabled="nameDisabled" :maxlength="Form.idcardType === '身份证' ? '18' : '20'" clearable v-model="Form.cardNo" :placeholder="'输入证件号'"></el-input>
        </el-form-item>
        <el-form-item label="门禁权限数:" :rules="{ required: true }">
          <el-button size="mini" type="primary" @click="dialogChooseRoom.visible = true" style="margin-left: 10px">点击选择</el-button>
          <span>已选择{{ dialogChooseRoom.selectedRoom.length }}个</span>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="是否允许远程开门:" :rules="{ required: true }">
          <el-radio-group v-model="Form.isRemoteOpen">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="非工作日是否通行:" :rules="{ required: true }">
          <el-radio-group v-model="Form.restDayPass">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="通行时间:" :rules="{ required: true }">
          <el-time-picker is-range v-model="passTime" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm" format="HH:mm" :clearable="false">
          </el-time-picker>
        </el-form-item>
        <el-form-item style="margin-bottom: 16px" label="备注信息:" prop="note">
          <el-input type="textarea" v-model="Form.note" placeholder="输入备注" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" :loading="btnLoading" @click="addUserConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置通行时间 -->
    <el-dialog class="newDialog" title="设置通行时间" :visible.sync="dialogPassTimeVisible" width="500px" :before-close="handleClosePassTime">
      <el-form :model="passRuleForm" :rules="passRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="通行时间" :rules="{ required: true, message: '请选择通行时间' }">
          <el-time-picker is-range v-model="passRuleForm.passtime" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm" format="HH:mm" :clearable="false">
          </el-time-picker>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClosePassTime">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmSetPassTime">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 关联办公室 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="500px" :title="updateHouseForm.buildingName" :visible.sync="linkBuilding">
      <el-form :model="updateHouseForm" label-width="100px" label-position="right" style="margin: 20px 40px 0 0">
        <el-form-item label="办公成员类型">
          <el-select style="width: 320px" v-model="updateHouseForm.type" placeholder="请选择">
            <el-option label="业主" value="1"></el-option>
            <el-option label="租户" value="2"></el-option>
            <el-option label="家庭成员" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="updateHouseForm.type !== '1'" label="过期时间">
          <el-date-picker style="width: 320px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="updateHouseForm.overTime" type="datetime" :picker-options="pickerOptions" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="邀请访客">
          <el-switch v-model="updateHouseForm.enableInviteVisitor" active-text="允许" active-value="1" active-color="#13ce66" inactive-color="#ff4949" inactive-value="0" inactive-text="禁止"></el-switch>
        </el-form-item>
        <el-form-item label="远程开门">
          <el-switch v-model="updateHouseForm.enableRemoteOpen" active-value="1" inactive-value="0" active-text="允许" active-color="#13ce66" inactive-color="#ff4949" inactive-text="禁止"></el-switch>
        </el-form-item>
        <el-form-item label="备注信息:" prop="note">
          <el-input style="width: 320px" type="textarea" v-model="updateHouseForm.note" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="linkBuilding = false">取 消</el-button>
        <el-button type="primary" @click="confirmHouse">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传人脸 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="300px" :title="uploadFaceTitle" :visible.sync="uploadFaceVisible">
      <el-upload ref="upload" class="avatar-uploader" :action="config.v5 + '/admin/scence-user/upFace'" accept="image/*" :auto-upload="false" :show-file-list="false" :on-change="beforeFaceUpload">
        <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar avatar-single" />
        <i v-else class="el-icon-plus avatar-uploader-icon avatar-single"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="
            uploadFaceVisible = false;
            uploadImageUrl = '';
          ">取 消</el-button>
        <el-button size="small" type="primary" :loading="upfaceLoading" @click="confirmUploadFace">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 人脸相似重新上传 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="500px" title="提示" :visible.sync="uploadFaceReplayVisible">
      <!-- <img :src="uploadImageUrl" class="avatar"> -->
      <p>{{ uploadFaceReplaymessage }}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadFaceReplayVisible = false">取 消</el-button>
        <el-button type="primary" :loading="replayUpfaceLoading" @click="replayConfirmUploadFace">继续上传</el-button>
      </div>
    </el-dialog>

    <!-- 增加办公室时修改办公室 -->
    <el-dialog class="newDialog" top="10vh" :close-on-click-modal="false" width="500px" :title="updateHouseForm.buildingName" :visible.sync="updateHouseVisible">
      <el-form :model="updateHouseForm" label-width="100px" label-position="right" style="margin: 20px 40px 0 0">
        <el-form-item label="办公成员类型">
          <el-select style="width: 320px" v-model="updateHouseForm.type" placeholder="请选择">
            <el-option label="业主" value="1"></el-option>
            <el-option label="租户" value="2"></el-option>
            <el-option label="家庭成员" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="updateHouseForm.type !== '1'" label="过期时间">
          <el-date-picker style="width: 320px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="updateHouseForm.overTime" type="datetime" :picker-options="pickerOptions" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="邀请访客">
          <el-switch v-model="updateHouseForm.enableInviteVisitor" active-text="允许" active-value="1" active-color="#13ce66" inactive-color="#ff4949" inactive-value="0" inactive-text="禁止"></el-switch>
        </el-form-item>
        <el-form-item label="远程开门">
          <el-switch v-model="updateHouseForm.enableRemoteOpen" active-value="1" inactive-value="0" active-text="允许" active-color="#13ce66" inactive-color="#ff4949" inactive-text="禁止"></el-switch>
        </el-form-item>
        <el-form-item label="备注信息:" prop="note">
          <el-input style="width: 320px" type="textarea" v-model="updateHouseForm.note" placeholder="输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="updateHouseVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmHouse">确 定</el-button>
      </div>
    </el-dialog>

    <BigImg :centerDialogVisible="imgVisible" bigTitle="注册人脸" :bigImg="bigImg" />
    <TwoImg :visible="twoImg.visible" :leftTitle="twoImg.leftTitle" :leftImg="twoImg.leftImg" :rightTitle="twoImg.rightTitle" :rightImg="twoImg.rightImg" />

    <!-- 办公室信息 -->
    <el-dialog class="newDialog" :close-on-click-modal="false" :title="'编号: ' + houseDetailDialog.serialNumber" :visible.sync="HouseDialogFormVisible">
      <el-tabs type="card" v-model="houseActiveName">
        <el-tab-pane label="详细信息" name="详细信息">
          <el-form label-width="130px" :model="houseDetailDialog">
            <el-row :gutter="20">
              <el-col :span="12" class="col-line">
                <el-form-item style="margin-bottom: 0" label="所在单元:">
                  <span>
                    {{
                      houseDetailDialog.buildingName
                        ? houseDetailDialog.buildingName
                        : "0"
                    }}
                  </span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="所在楼层:">
                  <span>
                    {{
                      houseDetailDialog.storeyNum
                        ? houseDetailDialog.storeyNum
                        : ""
                    }}
                  </span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="门牌号:">
                  <span>
                    {{
                      houseDetailDialog.serialNumber
                        ? houseDetailDialog.serialNumber
                        : ""
                    }}
                  </span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="注册时间:">
                  <span>
                    {{
                      houseDetailDialog.createTime &&
                      houseDetailDialog.createTime.substr(0, 10)
                    }}
                  </span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item style="margin-bottom: 0" label="注册人数:">
                  <span>
                    {{
                      houseDetailDialog.personCnt
                        ? houseDetailDialog.personCnt
                        : "0"
                    }}人
                  </span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="办公室状态:">
                  <span>{{ houseDetailDialog.houseStatus | status }}</span>
                </el-form-item>

                <el-form-item style="margin-bottom: 0" label="备注信息:">
                  <span>{{ houseDetailDialog.note || "" }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="在住人员" name="在住人员">
          <el-table v-loading="showLoading" stripe border :data="HouseDtailTable" style="width: 100%">
            <el-table-column align="center" width="50" :show-overflow-tooltip="true" type="index" label="序号"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="userName" label="姓名"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="userPhone" label="电话"></el-table-column>
            <el-table-column align="center" width="80" prop="type" label="人员类型">
              <template slot-scope="{ row }">
                <span>{{ row.type | type }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" :show-overflow-tooltip="true" prop="createTime" label="注册时间"></el-table-column>

            <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="备注">
              <template slot-scope="{ row }">
                <span>{{ row.note ? row.note : "" }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="createTime" label="操作" :key="Math.random()" v-if="globalUpdateStatus">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteHousePeople(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="门禁卡" name="门禁卡">
          <el-table :data="cardList" style="width: 100%">
            <el-table-column align="center" width="50" :show-overflow-tooltip="true" type="index" label="序号"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="cardNo" label="卡号"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="createTime" label="添加时间"></el-table-column>

            <el-table-column align="center" :show-overflow-tooltip="true" prop="validDate" label="过期时间"></el-table-column>

            <el-table-column :show-overflow-tooltip="true" align="center" prop="note" label="状态">
              <template slot-scope="{ row }">
                <span>
                  {{
                    row.status === "0"
                      ? "正常"
                      : row.status === "-2"
                      ? "禁用"
                      : "过期"
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="count" label="累计刷卡次数"></el-table-column>
            <el-table-column align="center" :show-overflow-tooltip="true" prop="createTime" label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="unbindCard(scope.row, scope.$index)">解绑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="HouseDialogFormVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 自定义时间 -->
    <el-dialog class="newDialog" title="请选择" width="400px" :modal="false" :visible.sync="customTimeDialog">
      <el-date-picker style="width: 100%" size="small" v-model="cutomeTime.value" type="date" value-format="yyyy-MM-dd" format="yyyy - MM - dd" placeholder="选择日期"></el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="customTimeDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmCustomTime">确 定</el-button>
      </div>
    </el-dialog>

    <DialogChooseRoom v-if="dialogChooseRoom.visible" :selectedIds="doorDetail" @selectRoom="handleSelectRoom"></DialogChooseRoom>

    <ExportIn :uploadUrl="
        env === 'production'
          ? config.v5 + '/admin/scence-user/import'
          : config.v5 + '/admin/scence-user/import'
      " :downTemplateUrl="config.v5 + '/admin/scence-user/model'" @closeVisible="closeVisible" @successUpload="fetchData(initForm)" :visible.sync="visible" />
  </div>
</template>

<script lang="ts">
declare function require(string): string;
import { Component, Prop, Vue, Mixins } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
import { MessageBox } from "element-ui";
import config from "@/api/config";
import {
  addPeople,
  updateUserPhone,
  updateUserNote,
  updateRoleHouse,
  deleteFace,
  uploadFace,
  editPasstime,
  editRestDayPass,
  addPermission,
} from "@/api/peopleApi.ts";
import _axios from "@/plugins/axios.js";
import mixin from "@/config/minxins";
import { getBase64 } from "@/utils/index.js";
import {
  searchSuggestHouse,
  deleteTheHousePeople,
  getRegisterPeople,
  getRegisterPerson,
  deleteDoorCard,
  getCardListByHouseId,
  getHouseTreeData,
} from "@/api/houseApi.ts";
import {
  getUserPropertyPass,
  getFaceList,
  updateUser,
  userHouseUpdate,
  getUserDevLink,
  deleteUser,
} from "@/api/peopleApi.ts";
import { getCarStallByUserId } from "@/api/carApi.ts";
import {
  queryUserPhone, //根据手机号模糊查询办公成员
} from "@/api/peopleApi.ts";
import splitPane from "vue-splitpane";
import { getUserPropertyCar } from "@/api/carApi.ts";
import { getPassAddress } from "@/api/peopleApi.ts";
const ActionHeader = () => import("@/components/ActionHeader.vue");
const DiaLog = () => import("@/components/dialog.vue");
const BigImg = () => import("@/components/BigImg/index.vue");
const TwoImg = () => import("@/components/TwoImg/index.vue");
const ExportIn = () => import("@/components/exportIn/index.vue");
const DialogChooseRoom = () => import("./components/DialogChooseRoom.vue");
const DataTree = () => import("@/components/DataTree.vue");
@Component({
  mixins: [mixin],
  components: {
    ActionHeader,
    DiaLog,
    BigImg,
    TwoImg,
    ExportIn,
    DialogChooseRoom,
    DataTree,
    splitPane,
  },
  filters: {
    status(val: string) {
      const data = {
        "1": "自住",
        "2": "出租",
        "3": "闲置",
      };
      return data[val];
    },
    statusFilter(val: string) {
      const data = {
        USED: "正常",
        // "-1": "不在住",
        DISABLE: "禁用",
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
    statusType(val: string) {
      const data = {
        USED: "正常",
        DISABLE: "禁用",
        OVER_TIME: "过期",
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
    passMethod(val: string) {
      const data = {
        FACE_OPEN: "人脸开门",
        VISITOR_OPEN: "访客开门",
        SCAN_OPEN: "二维码开门",
        REMOTE_OPEN: "远程开门",
        CARD_OPEN: "刷卡开门",
      };
      return data[val];
    },
  },
})
export default class OwnerManage extends Vue {
  options: object = {
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7;
    },
  };
  private menuControl1: String = "menu-control";
  private menuControl2: String = "menu-visible";
  TreeData: Array<Object> = []; // 树形结构数据
  queryBuildingId: String = ""; //通过dataTree获取到的宿舍楼id
  queryBuildingName: String = ""; //通过dataTree获取到的宿舍楼名称
  exportUrl: string = config.v5 + "/admin/scence-user/export";
  config: any = config;
  dialogChooseRoom: any = {
    visible: false,
    selectedRoom: [],
  };
  chooseRommIds: Array<string> = [];
  @Action("SET_TOTAL") set_total: any;
  private rowSpan: number = 12;
  btnLoading: boolean = false;
  uploadFaceVisible: boolean = false;
  replayUpfaceLoading: boolean = false; //重新上传
  uploadFaceReplayVisible: boolean = false; //重新上传dialog
  uploadFaceReplaymessage: string = ""; //重新上传dialog 的title
  uploadFaceTitle: string = "上传人脸";
  upfaceLoading: boolean = false;
  uploadImageUrl: string = ""; //单独上传人脸
  rowline: object = {}; //每行数据
  private activeName: string = "first";
  private imageUrl: string = ""; //人脸
  private houseActiveName: string = "详细信息";
  private dialogFormVisible: boolean = false;
  private HouseDialogFormVisible: boolean = false;
  UserType: string = "owner";
  spanArray: Array<number> = []; // 合并单元格
  index: number = 0; // 合并单元格参数
  private detailDialog: Object = {
    nameStatus: false,
    cardNameStatus: false,
    cardNoStatus: false,
    noteStatus: false,
    sexStatus: false,
    phoneStatus: false,
    otherCardNameStatus: false,
    passTimeStatus: false,
    restDayPassStatus: false,
    note: "",
    passTime: [],
  };
  passRuleForm: any = {
    passtime: ["00:00", "23:59"],
  }; //
  passRules: any = {};
  cardList: Array<object> = []; //门禁卡列表
  env: string = process.env.NODE_ENV;
  phoneString: string = ""; // 需要改成的电话
  noteString: string = ""; // 需要改成的备注
  houseIndex: number = 0; // 合并单元格
  linkBuilding: Boolean = false; //添加办公成员  关联办公室
  updateHouseVisible: boolean = false; // 修改办公室弹框
  data: Array<object> = []; // 未分单元格人员数据
  faceList: Array<object> = []; // 人脸库列表
  facePage: object = {
    page: 1,
    limit: 10,
    userId: "",
  };
  personImg: string = require("@/assets/defaultPerson.png"); // 人员头像
  Form: any = {
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
    overTime: "",
    isRemoteOpen: 1, // 是否允许远程开门
    restDayPass: 1,
  };
  updateHouseForm: object = {}; // 增加办公成员时修改办公室的属性
  initForm: object = {
    url: config.v5 + "/admin/scence-user/page",
    method: "get",
  };
  filterForm: object = {
    name: "",
    phone: "",
    serialNumber: "",
    bindName: "",
    types: [],
    cardNo: "",
    buildingId: "",
  };
  deleteForm: object = {
    url: config.v5 + "/admin/scence-user",
    method: "delete",
    data: [],
    message:
      "此操作将永久删除选中的办公成员, 删除后办公成员将不存在,请谨慎操作!",
  };
  pickerOptions: object = {
    disabledDate(time) {
      return time.getTime() < Date.now();
    },
  }; // 添加用户 办公室的时间限制
  pickerOptionsUser: object = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
  };
  carList: Array<object> = [];
  houseDetailDialog: object = {};
  loading: boolean = false;
  phoneList: Array<object> = [];
  nameDisabled: boolean = false;
  HouseDtailTable: Array<object> = []; // 办公室下的注册人员
  visible: boolean = false; // 批量导入状态
  updateArray: Array<string> = ["noteStatus", "phoneStatus"];
  rules: any = {
    name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
    type: [{ required: true, message: "请选择用户类型", trigger: "blur" }],
    overTime: [
      { required: true, message: "请选择过期日期", trigger: "change" },
    ],
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
    house: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (!value.length) {
            callback(new Error("请添加办公室"));
          } else {
            callback();
          }
        },
        trigger: "change",
      },
    ],
  };
  private imgVisible: Boolean = false; // 控制放大图片的visible
  private bigImg: String = ""; // 保存放大图片的地址
  twoImg: any = {
    visible: false,
    leftTitle: "",
    rightTitle: "",
    leftImg: "",
    rightImg: "",
  };
  passList: object = {
    scenceUserId: "",
    limit: 10,
    page: 1,
  };
  doorList: object = {};
  userId: string = "";
  private dtailTable: Array<Object> = []; //通行记录
  private doorDetail: Array<Object> = []; //通行权限
  private carDtailTable: Array<Object> = [];
  private houseDtailTable: Array<Object> = [];
  private HouseDetailTable: Array<Object> = [];
  phoneCopy: string = "";

  private editData: String = ""; //行内修改 保存未改变的值
  private editForm: Object = {
    //修改表单字段
    id: "", //目标联系人id
  };
  private customTimeDialog: Boolean = false; // 时间自定义对话框
  // 自定义时间
  private cutomeTime: Object = {
    key: "",
    value: "",
  };
  selectVal: Array<object> = [];
  passTime: Array<string> = []; //通行时间
  isUpdate: boolean = false;
  dialogPassTimeVisible: boolean = false;
  rowLineId: string = ""; //每行数据id
  created() {
    this.passTime = ["00:00", "23:59"];
    this.getHouseTreeData();
    this.initForm["params"] = Object.assign(
      this.initForm["params"],
      this.page,
      this.filterForm
    ); // 合并参数
  }
  handleBuildingId(data) {
    /**@description 获取宿舍楼id */
    this.queryBuildingId = data.id;
    this.queryBuildingName = data.name;
  }
  // 获取办公室结构
  getHouseTreeData() {
    getHouseTreeData().then((res: Object) => {
      this.TreeData = res["data"]["data"];
    });
  }
  // 修改状态
  changeUserStatus(Obj: object) {
    userHouseUpdate({
      status: Obj["Status"],
      id: Obj["type"].links[0].id,
    }).then((res) => {
      this["message"]("success", "修改成功");
      this.noteString = "";
      this.fetchData(this.initForm);
    });
  }
  beforeAvatarUpload(file) {
    getBase64(file.raw).then((res) => {
      this.imageUrl = res;
    });
  }
  openUpload(row, type) {
    this.rowline = row;
    this.uploadFaceTitle = type == "update" ? "注册人脸" : "上传人脸";
    this.uploadImageUrl = type == "update" ? row.face : "";
    this.uploadFaceVisible = true;
  }
  beforeFaceUpload(file) {
    getBase64(file.raw).then((res) => {
      this.uploadImageUrl = res;
    });
  }
  confirmUploadFace() {
    if (this.uploadImageUrl == "") {
      this.$message.error("请先添加人脸");
      return;
    }
    this.upfaceLoading = true;
    let param = {
      baseFace: this.uploadImageUrl,
      id: this.rowline["id"],
    };
    this.uploadFace(param);
  }
  uploadFace(data) {
    if (data.baseFace.indexOf("http://") != -1) {
      this.upfaceLoading = false;
      this.uploadFaceVisible = false;
      this.replayUpfaceLoading = false;
      this.uploadFaceReplayVisible = false;
      this.uploadImageUrl = "";
      return;
    }
    uploadFace(data)
      .then((res) => {
        this.upfaceLoading = false;
        this.$message.success("添加成功！");
        this.uploadFaceVisible = false;
        this.replayUpfaceLoading = false;
        this.uploadFaceReplayVisible = false;
        this.uploadImageUrl = "";
        this.fetchData(this.initForm);
      })
      .catch((err) => {
        this.upfaceLoading = false;
        if (err.message.indexOf("相似") != -1) {
          this.uploadFaceReplayVisible = true;
          this.uploadFaceReplaymessage = err.message;
        }
      });
  }
  replayConfirmUploadFace() {
    this.replayUpfaceLoading = true;
    if (this["dialogCreate"]) {
      this.addUserConfirm("force");
      return;
    }
    let param = {
      baseFace: this.uploadImageUrl,
      id: this.rowline["id"],
      isForce: true,
    };
    this.uploadFace(param);
  }
  showImg(scope) {
    this.twoImg.visible = true;
    this.twoImg.leftImg = scope.row.photos;
    this.twoImg.leftTitle = "抓拍人脸";
    this.twoImg.rightImg = scope.row.facePhone;
    this.twoImg.rightTitle = "注册人脸";
  }
  deleteFace(row) {
    this.$confirm("是否确定解绑该人脸?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        let param = {
          userId: this.userId,
          devIds: [row.devId],
        };
        let { data } = await deleteFace(param);
        if (data.code == 200) {
          this.fetchFaceList(1);
          this["message"]("success", "解绑成功");
        }
      })
      .catch(() => {});
  }

  handleSelectRoom(item) {
    this.dialogChooseRoom.selectedRoom = item;
    this.chooseRommIds = [];
    item.map((i: any) => {
      this.chooseRommIds.push(i.id);
    });
  }

  updateSelectedOfficeOfStaff(field, row, command) {
    const chooseType: any = [];
    row[field] = command;
    if (field == "type") {
      if (command == "1") {
        row.overTime = "";
      } else {
        if (!row.overTime) {
          row.overTime = this["$util"].getOffsetDate(365) + " 00:00:00";
        }
      }
    }
  }

  checkcardName(str: string) {
    return ["身份证", "护照", "港澳居民来往内地通行证"].includes(str);
  }
  cardNameChange() {
    if (this.checkcardName(this.detailDialog["idcardType"])) {
      this.updateUser(
        { idcardType: this.detailDialog["idcardType"] },
        "otherCardNameStatus"
      );
      this.detailDialog["idcardType"] = this.detailDialog["idcardType"];
    } else {
      this.detailDialog["idcardType"] = "";
    }
  }
  // 更新用户
  updateUser(obj: object, flag: string) {
    obj["id"] = this.detailDialog["id"];
    this.detailDialog[flag] = false;
    if (flag == "passTimeStatus") {
      this.detailDialog["passStartTime"] = obj["passTime"][0];
      this.detailDialog["passEndTime"] = obj["passTime"][1];
      obj = {
        id: this.detailDialog["id"],
        passStartTime: obj["passTime"][0],
        passEndTime: obj["passTime"][1],
      };
    }
    updateUser(obj).then((res) => {
      this["message"]("success", "修改成功");
      this.noteString = "";
      this.fetchData(this.initForm);
    });
  }
  // 强制更新input
  inputChange() {
    this.$forceUpdate();
  }
  // 删除某个用户下的某个办公室
  deleteHouse(row, index) {
    this.$confirm(
      "此操作将永久删除该用户下的办公室,删除后办公室将不会与办公成员绑定,请谨慎操作!?",
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
            this["message"]("success", "删除成功");
            this.HouseDetailTable.splice(index, 1);
            this.houseDetailDialog = [...this.HouseDetailTable];
            this.fetchData(this.initForm);
          }
        });
      })
      .catch(() => {
        this["message"]("error", "已取消删除");
      });
  }
  // 解绑门禁卡
  unbindCard(row, index) {
    this.$confirm(
      `此操作将永久解绑该办公室下的此张门禁卡,解绑后将不与该办公室绑定,请谨慎操作!?`,
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
  // 用户详情页 点击门牌号查看更多信息
  showHouseDetail(row) {
    this.HouseDialogFormVisible = true;
    this.houseDetailDialog = Object.assign({}, row);
    this.houseActiveName = "详细信息";
    getRegisterPeople(row.houseId).then((res) => {
      this.HouseDtailTable = res.data.data;
    });
    // 获取门禁卡列表
    getCardListByHouseId(row.houseId).then((res) => {
      this.cardList = res.data.data;
    });
  }
  // 删除办公室下的某个用户
  deleteHousePeople(row, index) {
    this.$confirm(
      `此操作将永久删除该办公室下的办公成员,删除后${row.userName}将不与该办公室绑定,请谨慎操作!?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    )
      .then(() => {
        deleteTheHousePeople(row.houseId, row.userId, " ", "").then((res) => {
          if (res.data.code === 200) {
            this.HouseDtailTable.splice(index, 1);
            this.fetchData(this.initForm);
          }
        });
      })
      .catch(() => {
        this["message"]("error", "已取消删除");
      });
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
              this["$util"].resetObj(this.Form, {
                idcardType: "身份证",
                phone: this.Form.phone,
              });
            }
            this.nameDisabled = false;
            this.dialogChooseRoom.selectedRoom = [];
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
  /**
   *
   * @param page 关闭添加/修改框
   */
  handleClose() {
    this.dialogChooseRoom.selectedRoom = [];
    this.Form = {
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
      overTime: "",
      isRemoteOpen: 1, //是否允许远程开门
      restDayPass: 1,
    };
    this.isUpdate = false;
    this.$refs["Forms"]["resetFields"]();
    this["dialogCreate"] = false;
    this.nameDisabled = false;
    this.imageUrl = "";
    this.$refs["upload"]["clearFiles"]();
  }
  handleSelectWatchlist(item) {
    this.$refs["Forms"]["clearValidate"]();
    const Name = ["身份证", "护照", "港澳居民来往内地通行证"];
    this.Form["phone"] = item.phone;
    this.Form["name"] = item.name;
    this.Form["sex"] = item.sex;
    this.Form["idcardType"] = Name.includes(item.cardName)
      ? item.cardName
      : "其它";
    this.Form["cardName"] = item.cardName;
    this.Form["birthday"] = item.birthday;
    this.Form["cardNo"] = item.cardNo;
    this.Form["note"] = item.note;
    this.nameDisabled = true;
    this.dialogChooseRoom.selectedRoom = JSON.parse(JSON.stringify(item.house));
    this.dialogChooseRoom.selectedRoom.map((item: any, index) => {
      this.dialogChooseRoom.selectedRoom[index].id =
        this.dialogChooseRoom.selectedRoom[index].houseId;
      if (
        this.dialogChooseRoom.selectedRoom[index].overTime &&
        this.dialogChooseRoom.selectedRoom[index].overTime.split("").length < 11
      ) {
        this.dialogChooseRoom.selectedRoom[index].overTime += " 00:00:00";
      }
    });
  }
  closeVisible(flag: boolean) {
    this.visible = flag;
  }
  showExportIn() {
    this.visible = true;
  }
  // 修改手机号
  phoneChange(row) {
    this.phoneCopy = row.phone;
    this.phoneString = row.phone.length == 11 ? row.phone : "";
    this["list_data"].forEach((el) => {
      this.$set(el, "phoneStatus", false);
    });
    this.$set(row, "phoneStatus", !row.phoneStatus);
  }
  ComponentCommand(Status: string, type: string, row: object) {
    return {
      ...row,
      type,
      Status,
    };
  }
  // 确定添加办公成员
  addUserConfirm(type: string) {
    this.btnLoading = true;
    if (this.Form.idcardType !== "其它") {
      this.Form.cardName = this.Form.idcardType;
    }

    this.$refs["Forms"]["validate"]((valid) => {
      if (valid) {
        this.Form["house"] = [];
        let arr: Array<string> = [];
        this.dialogChooseRoom.selectedRoom.map((item: any) => {
          arr.push(item.id);
        });
        if (!arr.length) {
          this.btnLoading = false;
          this["message"]("error", "未选择办公室");
          return;
        }
        let param = {
          name: this.Form.name,
          idcardType:
            this.Form.cardNo == "" && this.Form.cardName == "身份证"
              ? ""
              : this.Form.cardName,
          idcardNo: this.Form.cardNo,
          sex: this.Form.sex,
          phone: this.Form.phone,
          officeId: arr,
          note: this.Form.note,
          birthday: this.Form.birthday,
          overTime: this.Form.overTime,
          baseFace: this.imageUrl.indexOf("http://") == -1 ? this.imageUrl : "",
          isRemoteOpen: this.Form.isRemoteOpen,
          restDayPass: this.Form.restDayPass,
          passStartTime: this.passTime[0] || "00:00",
          passEndTime: this.passTime[1] || "23:59",
        };
        if (type == "force") {
          param["force"] = true;
        }
        if (this.isUpdate) {
          //修改
          param["id"] = this.rowLineId;
          updateUser(param)
            .then((res) => {
              this["message"]("success", "修改成功");
              this["dialogCreate"] = false;
              this.Form["house"] = [];
              this["handleClose"]();
              this.fetchData(this.initForm);
              this.btnLoading = false;
              this.replayUpfaceLoading = false;
              this.uploadFaceReplayVisible = false;
            })
            .catch((err) => {
              if (err.message.indexOf("相似") != -1) {
                this.uploadFaceReplayVisible = true;
                this.uploadFaceReplaymessage = err.message;
              }
              this.btnLoading = false;
            });
          return;
        }
        addPeople(param)
          .then((res) => {
            if (res.data.code === 200) {
              this["message"]("success", "添加成功");
              this["dialogCreate"] = false;
              this.Form["house"] = [];
              this["handleClose"]();
              this.fetchData(this.initForm);
              this.btnLoading = false;
              this.replayUpfaceLoading = false;
              this.uploadFaceReplayVisible = false;
            }
          })
          .catch((err) => {
            if (err.message.indexOf("相似") != -1) {
              this.uploadFaceReplayVisible = true;
              this.uploadFaceReplaymessage = err.message;
            }
            this.btnLoading = false;
          });
      } else {
        this.btnLoading = false;
      }
    });
  }
  // 修改电话离开输入框
  phoneBlur(row) {
    row.phoneStatus = false;
    this.phoneString = "";
  }
  // 修改备注离开输入框
  noteBlur(row) {
    row.noteStatus = false;
    this.noteString = "";
  }
  resize() {}
  // 确定修改 电话
  confirmUpdatePhone(row) {
    if (this.phoneString === this.phoneCopy) {
      this.phoneCopy = "";
      this.$set(row, "phoneStatus", false);
      return false;
    }
    if (!/^1[123456789]\d{9}$/.test(this.phoneString)) {
      this["message"]("error", "请输入正确的手机格式");
      this.$set(row, "phoneStatus", false);
      return;
    }
    this.$confirm(`此操作将永久修改${row.name}电话号码,请谨慎操作!`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        let param = {
          id: row.id,
          phone: this.phoneString,
        };
        updateUserPhone(param)
          .then((res) => {
            if (res.data.code === 200) {
              this["message"]("success", "修改成功");

              this.detailDialog["phone"] = this.phoneString;
              this.detailDialog["phoneStatus"] = false;
              this.phoneString = "";
              this.fetchData(this.initForm);
            } else {
              this["message"]("error", res.data.message);
            }
          })
          .catch(() => {
            this.$set(row, "phoneStatus", false);
          });
      })
      .catch(() => {
        this.$set(row, "phoneStatus", false);
        this["message"]("error", "已取消修改");
      });
  }
  // 确定修改 备注
  confirmUpdateNote() {
    if (!this.detailDialog["note"]) {
      return this["message"]("error", "请输入备注信息");
    }
    updateUserNote(this.detailDialog["id"], this.detailDialog["note"]).then(
      (res) => {
        if (res.data.code === 200) {
          this["message"]("success", "修改成功");
          this.noteString = "";
          this.fetchData(this.initForm);
        } else {
          this["message"]("error", res.data.message);
        }
      }
    );
  }
  // 打开修改办公室的状态
  updateAddHouse(index, item) {
    this.houseIndex = index;
    this.updateHouseVisible = true;
    this.updateHouseForm = Object.assign({}, item);
  }
  // 将重新定义的数据 换到 house字段去
  confirmHouse() {
    if (this.updateHouseForm["type"] !== "1") {
      if (
        this.updateHouseForm["overTime"] === "" ||
        this.updateHouseForm["overTime"] === null
      ) {
        return this["message"]("error", "租客和家庭成员需要添加过期时间");
      }
    }
    this.Form["house"][this.houseIndex] = Object.assign(
      {},
      this.updateHouseForm
    );
    this.updateHouseVisible = false;
    this.updateHouseForm = {};
  }
  // 重写fetchdata函数
  fetchData(option: object) {
    this["list_data"] = [];
    for (let key in option["params"]) {
      if (option["params"][key] === "") {
        option["params"][key] = null;
      }
    }
    this["showLoading"] = true;
    _axios(option).then((res: any) => {
      if (res.data && res.data.data) {
        if (this["firstStatus"]) {
          this.set_total(res.data.data.total);
        }
        this["firstStatus"] = false;
        this.page["total"] = res.data.data.total;
        this.page["limit"] = res.data.data.size;
        this.data = res.data.data.records;
        this["list_data"] = this.data;
        this["showLoading"] = false;
        this.spanArray = [];
        this.index = 0;
      }
    });
  }
  // 添加办公室时删除办公室
  deleteAddHouse(index) {
    this.Form.house.splice(index, 1);
  }
  // 选择搜索建议列表某项 并赋值
  handleSelect(val: object) {
    let Obj = {
      buildingName: "",
      type: "1",
      status: "0",
      overTime: null,
      note: "",
      houseId: "",
      enableRemoteOpen: "1",
      enableInviteCar: "1",
      enableInviteVisitor: "1",
    };
    Obj.houseId = val["id"];
    Obj.buildingName = val["name"];
    this.Form.house.unshift(Obj);
    this.updateAddHouse(0, Obj);
  }
  // 办公室搜索建议
  querySearch(string: string, cb) {
    let result = [];
    searchSuggestHouse(string).then((res) => {
      if (res.data.data) {
        result = res.data.data;
        result.splice(10);
        let arr: Array<object> = [];
        result.forEach((item, index) => {
          if (JSON.stringify(this.Form.house).indexOf(item["id"]) === -1) {
            arr.push(item);
          }
        });
        cb(arr);
      }
    });
  }

  tabRowClassName({ row, rowIndex }) {
    let index = row.indexSort + 1;
    if (row.indexSort % 2 == 0) {
      return "info-row";
    }
    return "";
  }

  // 合并单元格
  objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    if (
      columnIndex === 0 ||
      columnIndex === 1 ||
      columnIndex === 2 ||
      columnIndex === 3 ||
      columnIndex === 4 ||
      columnIndex === 8 ||
      columnIndex === 9
    ) {
      const _row_1 = this.spanArray[rowIndex];
      const _col_1 = _row_1 > 0 ? 1 : 0; //如果被合并了_row=0则它这个列需要取消
      return {
        rowspan: _row_1,
        colspan: _col_1,
      };
    }
  }

  /*** row 列表数据 查看详情*/
  showDetail(row, index, indexSort, type) {
    type == "limit" ? (this.activeName = "three") : (this.activeName = "first");
    this.userId = row.id;
    this.passList["scenceUserId"] = row.id;
    this.doorList["scenceUserId"] = row.id;
    this.dialogFormVisible = true;
    this.detailDialog = Object.assign(
      this.detailDialog,
      this["list_data"][index]
    );
    this.detailDialog["passTime"] = [row.passStartTime, row.passEndTime];
    this.detailDialog["phone"] =
      this.detailDialog["phone"].length == 11 ? this.detailDialog["phone"] : "";
    // 获取人员通行记录
    this.pagePassChange(1);
    this.getPersonDevice(); //通行权限
    this.facePage["userId"] = row.id;
  }

  // 获取人脸库列表
  fetchFaceList(page: number) {
    this.facePage["page"] = page;
    getFaceList(this.facePage).then((res) => {
      this.facePage["total"] = res.data.data.total;
      this.faceList = res.data.data;
    });
  }

  // 获取特定办公成员的通行记录
  pagePassChange(page: number) {
    this.passList["page"] = page;
    getUserPropertyPass(this.passList).then((res) => {
      this.dtailTable = res.data.data.records;
      this.passList["total"] = res.data.data.total;
    });
  }
  //通行权限
  getPersonDevice() {
    getUserDevLink(this.doorList).then((res) => {});
  }
  // 添加权限
  addPermission() {
    let params = {
      officeIds: this.chooseRommIds,
      scenceUserId: this.passList["scenceUserId"],
    };
    addPermission(params).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "门禁权限添加成功");
        this.dialogFormVisible = false;
      }
      this.fetchData(this.initForm);
    });
  }
  closeDialog() {
    this.dialogFormVisible = false;
    this.doorDetail = [];
    this.dtailTable = [];
  }

  editCustomTime(row, key) {
    /**@description 修改自定义时间 */
    this.customTimeDialog = true;
    this.editForm = row;
    this.cutomeTime["value"] = row[key];
    this.cutomeTime["key"] = key;
  }

  confirmCustomTime() {
    /**@description 提交自定义时间 */
    this.editForm[this.cutomeTime["key"]] = this.cutomeTime["value"];
    this.confirmUpdate(this.editForm, this.cutomeTime["key"]);
    this.customTimeDialog = false;
  }

  confirmUpdate(item, value) {
    /**@description 修改过期时间 */
    const form = { [value]: item[value], id: item["house"][0]["id"] };
    updateRoleHouse(form).then((res) => {
      if (res.data.code === 200) {
        this["message"]("success", "设置过期时间成功");
        this.fetchData(this.initForm);
      }
    });
  }
  // 通行位置搜索建议
  querySearchBuild(string: string, cb) {
    let result = [];
    getPassAddress(string).then((res) => {
      if (res.data.data) {
        result = res.data.data;
        result.splice(10);
        cb(result);
      }
    });
  }
  // 选择搜索建议列表某项 并赋值
  handleSelectBuild(val: object) {
    this["filterForm"]["bindName"] = val["locationName"];
    this["filterForm"]["buildingId"] = val["id"];
  }
  menuVisible() {
    /**@description 控制楼栋 */
    if (this.rowSpan === 0) {
      this.rowSpan = 12;
    } else {
      this.rowSpan = 0;
    }
  }
  // 切换到修改时间框
  showUpdateTime(row) {
    this["list_data"].forEach((element) => {
      element["validDateStatus"] = false;
    });
    row.validDateStatus = !row.validDateStatus;
    this.$nextTick(() => {
      const timeInput = this.$refs[row.links[0].id] as HTMLElement;
      timeInput.focus();
    });
    // this.$forceUpdate();
  }
  // 时间修改失去焦点
  blurDate(row) {
    row.validDateStatus = false;
  }
  /// 修改门禁卡过期时间
  validDateChange(overTime: string, id: string) {
    userHouseUpdate({ overTime, id })
      .then((res: any) => {
        if (res.data.code === 200) {
          this["message"]("success", "修改过期日期成功");
          this.fetchData(this.initForm);
          getRegisterPerson(this.userId).then((res) => {
            this.HouseDetailTable = [...res.data.data];
          });
        }
      })
      .catch((err) => {
        this.fetchData(this.initForm);
      });
  }
  handleSelectionChange(val) {
    this.selectVal = val;
  }
  handleUpdate(row) {
    this.isUpdate = true;
    let arr: any = [];
    row.links.map((item) => {
      arr.push(item.office);
    });
    this.dialogChooseRoom.selectedRoom = arr;
    this.Form = {
      name: row.name,
      cardName: row.cardName,
      cardNo: row.idcardNo,
      sex: row.sex,
      phone: row.phone,
      house: arr,
      note: row.note,
      birthday: row.birthday,
      houseName: row.houseName,
      idcardType: row.idcardType,
      overTime: row.overTime,
      isRemoteOpen: row.isRemoteOpen,
      restDayPass: row.restDayPass,
    };

    this.passTime = [row.passStartTime || "00:00", row.passEndTime || "23:59"];
    this.imageUrl = row.face;
    this.rowLineId = row.id;
    this["dialogCreate"] = true;
  }
  setPassTime(row) {
    if (this.selectVal.length == 0) {
      this.selectVal[0] = row;
      this.passRuleForm.passtime = [
        row.passStartTime || "00:00",
        row.passEndTime || "23:59",
      ];
    }
    this.dialogPassTimeVisible = true;
  }
  handleClosePassTime() {
    this.dialogPassTimeVisible = false;
    this.passRuleForm.passtime = ["00:00", "23:59"];
    this.selectVal = [];
  }
  //单个设置非工作日通行
  restDayPassChange(num) {
    let param = {
      restDayPass: Number(num),
      id: this.detailDialog["id"],
    };
    this.restDayPassOrIsRemoteClick(param, "restDayPass", num);
  }
  // 设置是否允许远程开门
  isRemoteOpenChange(num) {
    let param = {
      isRemoteOpen: Number(num),
      id: this.detailDialog["id"],
    };
    this.restDayPassOrIsRemoteClick(param, "isRemoteOpen", num);
  }
  //设置非工作日通行 是否允许远程开门 同用方法
  restDayPassOrIsRemoteClick(param, name, num) {
    updateUser(param).then((res) => {
      this["message"]("success", "修改成功");
      this.noteString = "";
      this.fetchData(this.initForm);
      this.detailDialog[name] = Number(num);
      this.$forceUpdate();
    });
  }
  confirmSetPassTime(row) {
    let param = {
      startTime: this.passRuleForm.passtime[0] || "00:00",
      endTime: this.passRuleForm.passtime[1] || "23:59",
    };
    let ids: any = [];
    this.selectVal.map((item: any) => {
      ids.push(item.id);
    });
    param["ids"] = ids;
    editPasstime(param).then((res) => {
      this["message"]("success", "修改成功");
      this.fetchData(this.initForm);
      this.handleClosePassTime();
    });
  }
  setWorkPass(val, row) {
    let msg = val ? "确定允许非工作日通行吗？" : "确定禁止非工作日通行吗？";
    this.$confirm(msg, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      let ids: any = [];
      if (this.selectVal.length) {
        this.selectVal.map((item: any) => {
          ids.push(item.id);
        });
      } else {
        ids = [row.id];
      }
      let param = {
        isPass: val,
        ids,
      };
      editRestDayPass(param).then((res) => {
        this["message"]("success", "修改成功");
        this.fetchData(this.initForm);
      });
    });
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
::v-deep {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-button--mini {
    padding: 5px 10px;
  }
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
.avatar-single {
  width: 200px;
  height: 200px;
  line-height: 200px;
  object-fit: contain;
}
.mainAddContain {
  width: 100%;
  height: 200px;
  display: flex;
  .pic {
    width: 140px;
    height: 140px;
    flex: none;
    overflow: hidden;
    border: 1px dotted gray;
    font-size: 48px;
    text-align: center;
    line-height: 140px;
    border-radius: 10px;
  }
  .form {
    flex: 1;
  }
}
.floatForm {
  width: 50%;
  float: left;
  position: relative;
  z-index: 999;
}
.right {
  width: 62px;
  display: inline-block;
  height: 30px;
  text-align: right;
}
.el-icon-edit {
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
}
.blueCircleBtn {
  cursor: pointer;
  color: #589ff8;
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid #dcecfd;
  background: #eef5fe;
  border-radius: 20px;
  outline: none;
}
.redCircleBtn {
  cursor: pointer;
  color: #e57471;
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid #f9e3e3;
  background: #fcf1f0;
  border-radius: 20px;
  outline: none;
}
::v-deep {
  .miniPicker {
    width: 90px;
    input {
      padding-left: 20px;
      padding-right: 5px;
      height: 28px !important;
    }
    .el-icon-date {
      width: 10px;
    }
  }
}
.cur-img {
  cursor: pointer;
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
.reg-face {
  width: 100px;
  height: 100px;
}
.cur {
  cursor: pointer;
}
</style>
