const OptimizeJsPlugin = require("optimize-js-plugin");
const resolvers = require("./resolvers.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const url = require("url");

// Vue config Stuff
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const path = require("path");
const webpack = require("webpack");

const assetsPath = path.resolve(__dirname, "..", "public", "assets");

function isProduction(env) {
  return env === "production";
}

function getPlugins(env) {
  let plugins = [new webpack.ProgressPlugin({ profile: false })];
  return [
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
    new CleanWebpackPlugin(),
    new OptimizeJsPlugin({
      sourceMap: !isProduction(env)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      filename: env == "development" ? "[name].css" : "[name]-[chunkhash].css",
      chunkFilename: "[id].css"
    }),
    // Map output assets to eleventy data
    new WebpackAssetsManifest({
      output: "../../data/manifest.json",
      transform: (assets, manifest) => {
        // Object to contain final asset map
        let output = {};
        // Create dedicated asset map for vue components
        let vueComponents = {};
        Object.keys(manifest.compiler.records).forEach(e => {
          if (e.includes(".vue?")) {
            // Add vue component to object with component name as key
            const compName = e
              .match(/\/(.*)\.vue/)[1]
              .split("/")
              .pop();
            vueComponents[compName] = url.parse(e.split(" ")[1], true).query.id;
          }
        });

        // Add vue components to the 'vue' key of the asset manifest
        output.vue = vueComponents;

        Object.keys(assets).forEach(assetName => {
          const batchName = assetName.replace(/\.[^/.]+$/, ""),
            outputName = assets[assetName];

          if (typeof output[batchName] == "undefined") {
            output[batchName] = {};
          }

          if (outputName.endsWith(".js")) {
            output[batchName].js = outputName;
          } else if (outputName.endsWith(".css")) {
            output[batchName].css = outputName;
          }
        });
        return output;
      }
    }),
    new VueLoaderPlugin()
  ];
}

module.exports = (config, env, target) => {
  if (!isProduction(env)) {
    config.devtool = "cheap-module-eval-source-map";
  }
  config.resolve = resolvers;
  config.plugins = getPlugins(env);
  config.externals = {
    window: "window"
  };
  config.optimization = { minimize: isProduction(env) };

  return config;
};
