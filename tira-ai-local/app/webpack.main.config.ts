const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
	target: "electron-main",
	mode: "development",
	entry: "./src/main.ts",

	resolve: {
		extensions: [".tsx", ".ts", ".js", ".md"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
			},
			{
				test: /\.md$/,
				use: [{ loader: "html-loader" }, { loader: "markdown-loader" }],
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(
						__dirname,
						"./../background-service/dist/background-service.pex",
					),
				},
			],
		}),
	],
};
