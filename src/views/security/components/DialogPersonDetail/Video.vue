<template>
  <div>
    <video
      id="playvideo"
      width="100%"
      :height="height?height:'375'"
      ref="playvideo"
      class="video-js"
      playsinline
      :data-name="name"
      muted
    ></video>
    <p class="reflv-replay" v-if="!isPc&&replay" @click="retry">点击重试</p>
    <p v-if="!isPc&&canplay" @click="can">播放</p>
  </div>
</template>

<script>
let player, timer;
import flvjs from "flv.js";
import videojs from "video.js";
import "videojs-contrib-hls";
let flv, hls;
export default {
  name: "Reflv",
  props: ["url", "height", "isPc","name"],
  data() {
    return {
      flvPlayer: null,
      hls: null,
      replay: false,
      canplay: false
    };
  },
  watch: {
    url() {
      // this.play();
    }
  },
  mounted() {},
  methods: {
    play() {
      console.log(this.url)
      flv= this.url.flvUrl;
      hls= this.url.m3u8Url;
      let that = this;
      this.$nextTick(() => {
        player = document.getElementById("playvideo");
        if (typeof this.flvPlayer !== "undefined") {
          if (this.flvPlayer != null) {
            this.flvPlayer.unload();
            this.flvPlayer.detachMediaElement();
            this.flvPlayer.destroy();
            this.flvPlayer = null;
          }
        }
        if (flvjs.isSupported()&&flv) {
          this.flvPlayer = flvjs.createPlayer(
            {
              type: "flv",
              url: flv,
              isLive: true
            },
            {
              enableWorker: false,
              lazyLoadMaxDuration: 3 * 60,
              isLive: true,
              enableStashBuffer: false,
              stashInitialSize: 128 // 减少首桢显示等待时长
            }
          );

          this.flvPlayer.attachMediaElement(player);
          this.flvPlayer.load(); //加载
          setTimeout(() => {
            this.flvPlayer.play();
            console.log(this.flvPlayer);
            this.flvPlayer.on("error", err => {
              console.log("err", err);
            });
          }, 10);
        } else {
          console.log(hls)
          if (this.hls != null) {
            this.hls = videojs(this.$refs.playvideo);
            this.hls.src({
              src: hls,
              type: "application/x-mpegURL" //在重新添加视频源的时候需要给新的type的值
            });
            this.hls.load(hls);
            this.hls.play(hls);
            return;
          }
          let src = hls;
          let that = this;

          this.hls = videojs(
            this.$refs.playvideo,
            {
              controls: false,
              sources: [
                {
                  src,
                  type: "application/x-mpegURL"
                }
              ]
            },
            function() {
              this.play();
              this.on("error", function(err) {
                timer = setTimeout(() => {
                  that.hls = videojs(that.$refs.playvideo);
                  that.hls.src({
                    src: hls,
                    type: "application/x-mpegURL" //在重新添加视频源的时候需要给新的type的值
                  });
                  that.hls.load(hls);
                  that.hls.play(hls);
                }, 1000);
              });
              this.on("loadedmetadata", function() {
                console.log("加载完成-");
                // clearTimeout(timer);
                if (!that.isPc) {
                  that.canplay = true;
                }
                that.replay = false;
              });
              this.on("loadstart", function() {
                console.log("开始请求数据 ");
              });
              this.on("progress", function() {
                console.log("正在请求数据 ");
              });
              this.on("canplaythrough", function() {
                console.log("视频源数据加载完成");
                clearTimeout(timer);
                that.replay = false;
                that.canplay = false;
              });
              this.on("waiting", function() {
                console.log("等待数据");
              });
              this.on("play", function() {
                console.log("视频开始播放");
              });
              this.on("playing", function() {
                console.log("视频播放中");
              });
              this.on("pause", function() {
                console.log("视频暂停播放", that.isPc);
                if (!that.isPc) {
                  clearTimeout(timer);
                }
                that.replay = true;
                that.canplay = true;
              });
              this.on("ended", function() {
                console.log("视频播放结束");
              });
            }
          );
        }
      });
    },
    retry() {
      let that = this;
      timer = setTimeout(() => {
        that.hls = videojs(that.$refs.playvideo);
        that.hls.src({
          src: hls,
          type: "application/x-mpegURL" //在重新添加视频源的时候需要给新的type的值
        });
        that.hls.load(hls);
        that.hls.play(hls);
      }, 1000);
    },
    can() {
      console.log("play-----", this.hls);
      // this.hls = videojs(this.$refs.playvideo);
      // this.hls.src({
      //   src: hls,
      //   type: "application/x-mpegURL" //在重新添加视频源的时候需要给新的type的值
      // });
      this.hls.load(hls);
      this.hls.play(hls);
    },
    flv_destroy() {
      this.$nextTick(() => {
        if (!this.flvPlayer) {
          return;
        }
        this.flvPlayer.pause();
        this.flvPlayer.unload();
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy();
        this.flvPlayer = null;
      });
    },
    hls_destyoy(){
        if (this.hls) {
        const videoDom = this.$refs.playvideo;
        videojs(videoDom).dispose();
        return;
        }
    }
  },
  beforeDestroy() {
    if (this.hls) {
      const videoDom = this.$refs.playvideo;
      videojs(videoDom).dispose();
      return;
    }
  }
};
</script>

<style lang="scss">
.vjs-modal-dialog-content {
  width: 100%;
  height: 100%;
  display: none;
}
.video-js {
  width: 100%;
  height: 100%;
  video{
    height: 100%;
  }
}
.vjs-error .vjs-error-display:before {
  display: none !important;
}
.reflv-replay {
  cursor: pointer;
}
.vjs-control-bar,.vjs-big-play-button,.vjs-modal-dialog,.vjs-loading-spinner{
  display: none;
}
.vjs-text-track-display>div{
     display: none;
}
#playvideo_html5_api{
  display: block;
  margin: 0 auto;
}
</style>
