/* global __dirname, require, module*/

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env  = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'colorLibrary';

let plugins = [], outputFile;

if (env === 'build') {
	plugins.push(new UglifyJsPlugin({ minimize: true }));
	outputFile = libraryName + '.min.js';
} else {
	outputFile = libraryName + '.js';
}

var config = {
	entry: [
		__dirname +  '/scripts/colorNamer/src/nameThatColor.js',
		__dirname +  '/scripts/colorNamer/src/eventDetectNTC.js',
		__dirname +  '/scripts/colorNamer/src/extract-colors.js'
	],
	devtool: 'source-map',
	output: {
		path: __dirname + '/scripts/colorNamer//lib',
		filename: outputFile,
		library: libraryName
		// libraryTarget: 'umd',
		// umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /(\.jsx|\.js)$/,
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, "scripts"),
				],
				query: {
					presets: [
						"es2015",
						"stage-0"
					],
					plugins: [],
					cacheDirectory: true
				},
				exclude: /(node_modules|bower_components)/
			},
			{
				test: /(\.jsx|\.js)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		modules: [
			path.resolve(__dirname) ,
			path.resolve(__dirname, "scripts")
		],
		extensions: ['.json', '.js']
	},
	plugins: plugins
};


var inPutFolder = 'scripts/colorNamer/target';
var outPutFolder = 'scripts/colorNamer/dist';

config = {
	entry: {
		preload: './scripts/colorNamer/target/main.js'
	},
	output: {
		path: path.join(__dirname, outPutFolder),
		publicPath: outPutFolder,
		filename: '[name].bundle.js',
		chunkFilename: '[id].bundle.js'
	}
};

module.exports = config;