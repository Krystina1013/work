

export const msg= {
  hasNoData: "暂无数据",
  oneData: "请选择一条数据",
  oneMoreData: "请至少选择一条数据",
  onlyOneData: "只能选择一条数据",
  isDelete:"确定删除当前选中的数据吗？",
  deleteSuccess:"删除成功",
  addSuccess:"新增成功",
  updateSuccess:"修改成功",
};

export const pagination= {
  total: 0,
  pageSize: 10,
  currentPage: 1,
    pageSizes: [10, 30, 50],
    maxCount:10000
};

export const identityList=[
  {label:"业主",value:"1"},
  {label:"租户",value:"2"},
  {label:"家庭成员",value:"3"},
];
export const identityMap={
  "1":"业主",
  "2":"租户",
  "3":"家庭成员",
};
export const allowOrNotMap = {
  1: "允许",
  0: "禁止",
};