const autoprefixer = require("autoprefixer");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const production = JSON.stringify(process.env) === "production";

module.exports = function() {
  let cssLoaders = [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          importLoaders: 1
        }
      }
    ],
    sassLoaders = [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          sourceMap: !production,
          url: false
        }
      },
      {
        loader: "postcss-loader",
        options: {
          plugins: function(e) {
            return [autoprefixer(["last 2 version", "> 1%", "ie 9", "ie 8"])];
          },
          sourceMap: !production
        }
      },
      {
        loader: "sass-loader", // compiles Sass to CSS
        options: {
          sourceMap: !production
        }
      }
    ];

  return [
    {
      test: /\.woff$|\.woff2?$|\.ttf$|\.eot$|\.otf$|\.svg$/,
      loader: "file-loader",
      options: {
        emitFile: false,
        name: "[name].[ext]",
        publicPath: "fonts"
      },
      exclude: /src\/svg/
    },
    {
      test: /\.(png|jpg|gif)$/,
      loader: "file-loader",
      options: {}
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      use: cssLoaders
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: sassLoaders
    },
    // Loader for Vue files
    {
      test: /\.vue?$/,
      use: "vue-loader"
    }
  ];
};
