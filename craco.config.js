const path = require("path");

module.exports = {
  reactScriptsVersion: "react-scripts",
  paths: function (paths, env) {
    paths.appBuild = path.resolve(__dirname, "dist");
    return paths;
  },
  webpack: {
    alias: {
      //别名配置
      "@": path.resolve(__dirname, "src"),
    },
  },
};
