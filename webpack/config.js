const path = require("path");
const envSettings = require("./environment.config.js");

const getLoaders = require("./loaders.js");
const webpack = require("webpack");

const assetsPath = path.resolve(__dirname, "..", "build", "assets");

module.exports = env => {
  let config = {
    context: path.resolve(__dirname, ".."),
    entry: {
      main: ["./src/js/main.js", "./src/scss/styles.scss"]
    },
    mode: env,
    output: {
      path: assetsPath,
      filename: env == "development" ? "[name].js" : "[name]-[hash].js",
      chunkFilename:
        env == "development" ? "[name].js" : "[name]-[chunkhash].js",
      publicPath: "/assets/"
    },
    optimization: {
      minimize: env === "production"
    },
    module: {
      rules: getLoaders()
    }
  };

  return envSettings(config, env);
};
