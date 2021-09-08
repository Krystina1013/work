"use strict";
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  
  outputDir: "dist",
  devServer: {
    port:'5000',
    proxy: {
      "/v1": {
        // target: "http://192.168.3.131:8084/community", //xa
        target: "http://139.196.14.225:8084/community", 
        // target: "http://192.168.101.27:8084/community", 
        // changeOrigin: false,
        pathRewrite: {
          "^/v1": "/"
        }
      },
      "/v2": {
        // target: "http://192.168.3.131:8082/dev", //xa
        target: "http://192.168.3.133:8082/dev", 
        // target: "http://139.196.14.225:8082/dev", 
        changeOrigin: false,
        pathRewrite: {
          "^/v2": "/"
        }
      },
      "/v3": {
        // target: "http://192.168.3.131:8083/user", //xa
        // target: "http://192.168.101.27:8083/user", 
        target: "http://139.196.14.225:8083/user", 
        changeOrigin: false,
        pathRewrite: {
          "^/v3": "/"
        }
      },
      "/v4": {
        // target: "http://192.168.3.131:8084/community", //xa
        // target: "http://192.168.101.27:8084/community", 
        target: "http://139.196.14.225:8084/community", 
        changeOrigin: false,
        pathRewrite: {
          "^/v3": "/"
        }
      },
      "/v5": {
        // target: "http://192.168.3.131:8085/office-parks", //xa
        // target: "http://192.168.3.133:8085/office-parks", 
        target: "http://139.196.14.225:8085/office-parks", 
        changeOrigin: false,
        pathRewrite: {
          "^/v5": "/"
        }
      },
      "/map-api/": {
        target: "http://api.map.baidu.com/geocoding/", // http://192.168.3.19:8000/ 192.168.2.175:9000
        changeOrigin: true,
        pathRewrite: {
          "^/map-api/": "" // 需要rewrite的,
        }
      }
    },
    host: "0.0.0.0"
  },
  // 生产环境 sourceMap
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  assetsDir: "static",
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
  }
};
