const path = require("path");
const webpack = require("webpack");

const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv === "production";

let externals = ["utf-8-validate", "bufferutil", "appdynamics"];

const entry = isProduction
    ? [path.resolve(path.join(__dirname, "./src/server.ts"))]
    : [
          "webpack/hot/poll?1000",
          path.resolve(path.join(__dirname, "./src/server.ts")),
      ];

module.exports = {
    devtool: "inline-source-map",
    performance: {
        hints: false,
    },
    mode: nodeEnv || "development",
    plugins: [new webpack.HotModuleReplacementPlugin()],
    entry,
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: "server.bundle.js",
    },
    target: "node",
    externals,
    module: {
        rules: [
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                use: {
                    loader: "graphql-tag/loader",
                },
            },
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                        },
                    },
                ],
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
            },
            {
                test: /\.js?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    },
                },
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto",
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx", ".json", ".gql"],
    },
};
