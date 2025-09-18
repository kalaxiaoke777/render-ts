const path = require("path");

module.exports = {
  webpack: {
    alias: {
      //别名配置
      "@": path.resolve(__dirname, "src"),
    },
  },
};
