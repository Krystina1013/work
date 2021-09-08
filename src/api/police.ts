import _axios from "../plugins/axios";
import config from './config';

// 摄像机列表---分组
export function getCameraTree(params) { 
    return _axios({
        url: config.v5 + '/csia/camera/tree',
        method: 'get',
        params
    })
}

// 相似度
export function systemSetting() {
    return _axios({
        url: config.v2 + '/csia/system/setting',
        method: 'get',
    })
}


// 视频盒子--列表
export function getBoxList(params) {
    return _axios({
        url: config.v2 + '/csia/box',
        method: 'get',
        params
    })
}
// 视频盒子--添加
export function addBox(data) {
    return _axios({
        url: config.v2 + '/csia/box',
        method: 'post',
        data
    })
}
// 视频盒子--修改
export function updateBox(data) {
    return _axios({
        url: config.v2 + '/csia/box',
        method: 'put',
        data
    })
}
// 摄像机列表---不分页
export function getCameraNoPage(data: any) {
    return _axios({
        url: config.v2 + '/csia/camera/noPage',
        method: 'post',
        data
    })
}
// 摄像机列表---分页
export function getCamera(data) {
    return _axios({
        url: config.v2 + '/csia/camera/page',
        method: 'post',
        data
    })
}
// 摄像机列表---添加
export function addCamera(data) {
    return _axios({
        url: config.v2 + '/csia/camera',
        method: 'post',
        data
    })
}
// 摄像机列表---修改
export function updateCamera(data) {
    return _axios({
        url: config.v2 + '/csia/camera',
        method: 'put',
        data
    })
}

// 身份搜索-照片 
export function faceSearch(data) {
    return _axios({
        url: config.v2 + '/csia/face/faceSearch',
        method: 'post',
        data
    })
}
// 身份搜索-人员信息
export function faceAttrSearch(data) {
    return _axios({
        url: config.v2 + '/csia/face/faceAttrSearch',
        method: 'post',
        data
    })
}

// 人脸抓拍-抓拍记录
export function unknownFaceTimeSearch(data) {
    return _axios({
        url: config.v5 + '/csia/face/unknownFaceCapSearch',
        method: 'post',
        data
    })
}
// 人脸抓拍-某个摄像机抓拍
export function unknownFaceRecentCap(data) {
    return _axios({
        url: config.v2 + '/csia/face/unknownFaceRecentCap',
        method: 'post',
        data
    })
}

// 首次出现
export function firstAppear(params) {
    return _axios({
        url: config.v2 + '/csia/face/firstAppear/list',
        method: 'get',
        params
    })
}
// 首次出现---某天
export function firstAppearDay(params) {
    return _axios({
        url: config.v2 + '/csia/face/firstAppear/day/page',
        method: 'get',
        params
    })
}
// 重点人员--分组列表
export function importantGroup(params) {
    return _axios({
        url: config.v2 + '/csia/alertTask',
        method: 'get',
        params
    })
}
// 重点人员--分组添加
export function AddimportantGroup(data) {
    return _axios({
        url: config.v2 + '/csia/alertTask',
        method: 'post',
        data
    })
}
// 重点人员--分组修改
export function updateImportantGroup(data) {
    return _axios({
        url: config.v2 + '/csia/alertTask',
        method: 'put',
        data
    })
}
// 重点人员--分组删除
export function delateImportantGroup(data) {
    return _axios({
        url: config.v2 + '/csia/alertTask',
        method: 'delete',
        data
    })
}
// 重点人员--列表
export function getImportantPerson(data) {
    return _axios({
        url: config.v2 + '/csia/alertPhoto/page',
        method: 'post',
        data
    })
}
// 重点人员--添加
export function addImportantPerson(data) {
    return _axios({
        url: config.v2 + '/csia/alertPhoto',
        method: 'post',
        data
    })
}
// 重点人员--修改
export function updateImportantPerson(data) {
    return _axios({
        url: config.v2 + '/csia/alertPhoto',
        method: 'put',
        data
    })
}
// 重点人员--删除
export function deleteImportantPerson(data) {
    return _axios({
        url: config.v2 + '/csia/alertPhoto',
        method: 'delete',
        data
    })
}
// 人脸检测 
export function faceDetect(data) {
    return new Promise((resolve, reject) => {
        _axios({
            url: config.v2 + '/csia/face/detect',
            method: 'post',
            data
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
// 人脸上传
export function faceUpload(data) {
    return _axios({
        url: config.v2 + '/csia/face/upFace',
        method: 'post',
        data
    })
}
// 人脸修改
export function faceUpdate(data) {
    return _axios({
        url: config.v2 + '/csia/face/faceUpdate',
        method: 'post',
        data
    })
}
// 实时监控--告警
export function allAlert(params) {
    return _axios({
        url: config.v2 + '/csia/alert/all',
        method: 'get',
        params
    })
}
// 实时监控--告警--已读
export function alertRead(data) {
    return _axios({
        url: config.v2 + '/admin/dev-device-warning/read',
        method: 'put',
        data
    })
}
// 实时监控--告警--元数据
export function capMessage(params) {
    return _axios({
        url: config.v2 + '/csia/alert/capMessage',
        method: 'get',
        params
    })
}
// 播放视频
export function play(params) {
    return _axios({
        url: config.v2 + '/csia/camera/play',
        method: 'get',
        params
    })
}

// 关注人员--列表 
export function getCareUser(params) {
    return _axios({
        url: config.v4 + '/admin/care-user',
        method: 'get',
        params
    })
}
// 关注人员--添加
export function addCareUser(data) {
    return _axios({
        url: config.v4 + '/admin/care-user',
        method: 'post',
        data
    })
}
// 关注人员--修改
export function updateCareUser(data) {
    return _axios({
        url: config.v4 + '/admin/care-user',
        method: 'put',
        data
    })
}
// 关注人员--删除
export function deleteCareUser(data) {
    return _axios({
        url: config.v4 + '/admin/care-user',
        method: 'delete',
        data
    })
}
// 设备告警--列表
export function deviceWarning(params) {
    return _axios({
        url: config.v2 + '/admin/dev-device-warning/page',
        method: 'get',
        params
    })
}
// 设备告警--修改
export function updateDeviceWarning(params) {
    return _axios({
        url: config.v2 + '/admin/dev-device-warning',
        method: 'put',
        params
    })
}

// 播放视频--短视频
export function playBackTime(params: any) {
    return _axios({
        url: config.v2 + '/csia/camera/playBackTime',
        method: 'get',
        params
    })
}
//抓拍首次出现加入重点人员
export function addImportant(data: any) {
    return _axios({
        url: config.v2 + '/csia/alertPhoto/alertPhoto/byFaceUrl',
        method: 'post',
        data
    })
}