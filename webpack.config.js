const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { NONAME } = require('dns')

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		compress: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Portfolio',
			template: './src/index.html',
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
				exclude: '/node_modules',
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
				exclude: '/node_modules',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				exclude: '/node_modules',
			},
			{
				test: /\.html$/i,
				loader: 'html-loader',
				exclude: '/node_modules',
			},
		],
	},
}
