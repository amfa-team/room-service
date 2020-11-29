const path = require("path");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const slsw = require("serverless-webpack");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const plugins = [new webpack.WatchIgnorePlugin([/\.d\.ts$/])];

if (!slsw.lib.webpack.isLocal) {
  plugins.push(
    new SentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "side-by-side-sas",
      project: "room-service-api",
      include: "./src",
    }),
  );
}

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              projectReferences: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@amfa-team/shared": path.resolve(__dirname, "../shared/src"),
      "@amfa-team/types": path.resolve(__dirname, "../types/src"),
    },
  },
  plugins,
  externals: [
    nodeExternals({
      allowlist: ["@amfa-team/shared", "@amfa-team/types"],
      additionalModuleDirs: [
        path.resolve(__dirname, "..", "..", "node_modules"),
      ],
    }),
  ],
  cache: false,
  stats: "minimal",
};