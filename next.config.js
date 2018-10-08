require("dotenv").config();

const path = require("path");
const webpack = require("webpack");

module.exports = {
  webpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.ETHEREUM_HTTP": JSON.stringify(process.env.ETHEREUM_HTTP),
        "process.env.VOTER_ADDRESS": JSON.stringify(process.env.VOTER_ADDRESS),
        "process.env.TWEETH_ADDRESS": JSON.stringify(
          process.env.TWEETH_ADDRESS
        ),
        "process.env.URL": JSON.stringify(process.env.URL)
      })
    );
    return config;
  }
};
