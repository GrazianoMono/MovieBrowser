const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'development',
	entry: {
		index: './src/index.js',
		movie: './src/pages/movie.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
	devServer: {
		static: './dist',
		compress: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'MovieBrowser',
			filename: 'index.html',
			template: './src/index.html',
			chunks: ['index'],
		}),
		new HtmlWebpackPlugin({
			title: 'Movie',
			filename: 'movie.html',
			template: './src/pages/movie.html',
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
