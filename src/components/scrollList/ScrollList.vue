<template>
  <div ref="scrollList" class="scrollList" :style="`height:${height}px`">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "ScrollList",
  components: {},
  props: ["height", "canPullUp"],
  data() {
    return {
      lastScrollTop: 0
    };
  },
  created() {},
  mounted() {
    let _this = this;
    this.$refs.scrollList.addEventListener("scroll", function() {
      if (_this.lastScrollTop < this.scrollTop) {
        if (this.scrollHeight - (this.scrollTop + this.clientHeight) < 10) {

          if (_this.canPullUp) {
            _this.$emit("scrollToBottom");
          }
        }
      }
      _this.lastScrollTop = this.scrollTop;
    });
  },
  methods: {
    scrollToTop(){
      this.$refs.scrollList.scrollTop=0;
    }
  }
};
</script>
<style lang="scss" scoped>
.scrollList {
  overflow: auto;
}
</style>