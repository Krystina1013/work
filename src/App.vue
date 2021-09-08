<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { systemSetting } from "@/api/police";
import { getToken } from '@/utils/auth'
export default {
  name: "App",
  created() {
    if (getToken()) {
      this.getSet();
    }

  },
  methods: {
    getSet() {
      systemSetting().then(res => {
        let data = res.data.data.data
        let similarity = {
          high: data.high,
          medium: data.medium,
          low: data.low,
        }
        let similarityList = [
          { label: `高（${data.high}%）`, value: data.high },
          { label: `中（${data.medium}%）`, value: data.medium },
          { label: `低（${data.low}%）`, value: data.low }
        ];
        localStorage.setItem('similarity', JSON.stringify(similarity));
        localStorage.setItem('similarityList', JSON.stringify(similarityList));
      })
    }
  },
};
</script>
<style lang="scss">
* {
  margin: 0px;
  padding: 0px;
}
#app {
  background-color: #f8f8f8;
}
body {
  overflow: hidden;
}
body .el-table th.gutter {
  display: table-cell !important;
}
// #nprogress .bar {
//   background: #4e80a4 !important; //nprogress自定义颜色
// }
</style>
