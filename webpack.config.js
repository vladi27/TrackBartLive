const webpack = require("webpack");
var path = require("path");
module.exports = (env, argv) => {
  return {
    entry: "./src/index.js",
    output: {
      path: path.join(__dirname, "dist"),
      // publicPath: "/dist",
      // publicPath: "/",
      filename: "bundle.js",
      publicPath: argv.mode === "production" ? "/dist" : "/",
    },
    //devServer: { contentBase: "dist" },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },

        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: "[name]_[local]_[hash:base64]",
                sourceMap: true,
                minimize: true,
              },
            },
          ],
        },
      ],
    },
    //devtool: "source-map",
    resolve: {
      extensions: [".js", ".jsx", "*"],
    },
  };
};
