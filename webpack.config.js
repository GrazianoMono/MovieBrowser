const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'development',
	entry: {
		index: './src/index.js',
		movie: './src/movie.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	devServer: {
		static: './dist',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/pages/index.html',
			filename: 'index.html',
			chunks: ['index'],
		}),
		new HtmlWebpackPlugin({
			template: './src/pages/movie.html',
			filename: 'movie.html',
			chunks: ['movie'],
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
