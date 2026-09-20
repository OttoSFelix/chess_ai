module.exports = {
	mode: "development",
	entry: "./src/renderer/index.ts",
	target: "electron-renderer",
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".md"],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|woff|woff2|ogg|mp3|wav)$/i,
				type: "asset/resource",
			},
			{
				test: /\.md$/,
				use: [{ loader: "html-loader" }, { loader: "markdown-loader" }],
			},
		],
	},
};
