<template>
  <bm-overlay
    ref="deviceOverlay"
    class="device-point"
    :class="deviceInfo.fault ? 'falult' : 'normal'"
    pane="markerPane"
    @draw="draw"
  >
    <div class="container">
      <div
        class="dot"
        :class="deviceInfo.fault ? 'dot-falult' : 'dot-normal'"
      ></div>
      <div
        class="pulse"
        :class="deviceInfo.fault ? 'pulse-falult' : 'pulse-normal'"
      ></div>
      <div
        class="pulse1"
        :class="deviceInfo.fault ? 'pulse1-falult' : 'pulse1-normal'"
      ></div>
    </div>
  </bm-overlay>
</template>

<script>
export default {
  props: {
    deviceInfo: {
      type: Object,
      required: true
    }
  },
  watch: {
    position: {
      handler() {
        this.$refs.deviceOverlay.reload();
      },
      deep: true
    }
  },
  methods: {
    draw({ el, BMap, map }) {
      const { lng, lat } = this.deviceInfo;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - 5 + "px";
      el.style.top = pixel.y - 5 + "px";
    }
  }
};
</script>

<style lang="scss" scoped>
$falult-color: #f55c61;
$normal-color: #37dab5;
.device-point {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  box-shadow: 0 0 5px #000;
  position: absolute;
}
.device-point.falult {
  background: $falult-color;
}
.device-point.normal {
  background: $normal-color;
}

@keyframes warn {
  0% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0;
  }

  25% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0.1;
  }

  50% {
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    opacity: 0.3;
  }

  75% {
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
    opacity: 0.5;
  }

  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

@keyframes warn1 {
  0% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0;
  }

  25% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0.1;
  }

  50% {
    transform: scale(0.3);
    -webkit-transform: scale(0.3);
    opacity: 0.3;
  }

  75% {
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    opacity: 0.5;
  }

  100% {
    transform: scale(0.8);
    -webkit-transform: scale(0.8);
    opacity: 0;
  }
}

.container {
  position: relative;
  width: 12px;
  height: 12px;
}
/* 保持大小不变的小圆点 */
.dot {
  position: absolute;
  width: 12px;
  height: 12px;
  left: -1px;
  top: -1px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border: 1px solid $falult-color;
  border-radius: 50%;
  background-color: $falult-color; /* 实心圆 ，如果没有这个就是一个小圆圈 */
  z-index: 2;
  box-shadow: 1px 1px 30px red; /* 阴影效果 */
}

.dot-falult {
  border: 1px solid $falult-color;
  background-color: $falult-color;
  box-shadow: 1px 1px 30px red;
}

.dot-normal {
  border: 1px solid $normal-color;
  background-color: $normal-color;
  box-shadow: 1px 1px 30px $normal-color;
}
/* 产生动画（向外扩散变大）的圆圈 第一个圆 */
.pulse {
  position: absolute;
  width: 38px;
  height: 38px;
  left: -14px;
  top: -14px;
  border: 1px solid $falult-color;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  -webkit-animation: warn 2s ease-out;
  -moz-animation: warn 2s ease-out;
  animation: warn 2s ease-out;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  box-shadow: 1px 1px 30px red; /* 阴影效果 */
  /* border: 1px solid red; */
}

.pulse-falult {
  border: 1px solid $falult-color;
  box-shadow: 1px 1px 30px red;
}

.pulse-normal {
  border: 1px solid $normal-color;
  box-shadow: 1px 1px 30px green;
}
/* 产生动画（向外扩散变大）的圆圈 第二个圆 */
.pulse1 {
  position: absolute;
  width: 38px;
  height: 38px;
  left: -14px;
  top: -14px;
  border: 1px solid $falult-color;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  z-index: 1;
  opacity: 0;
  -webkit-animation: warn1 2s ease-out;
  -moz-animation: warn1 2s ease-out;
  animation: warn1 2s ease-out;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  box-shadow: 1px 1px 30px red; /* 阴影效果 */
}

.pulse1-falult {
  border: 1px solid $falult-color;
  box-shadow: 1px 1px 30px red;
}

.pulse1-normal {
  border: 1px solid $normal-color;
  box-shadow: 1px 1px 30px green;
}
</style>
