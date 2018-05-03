const path = require('path');
const project = require('./project.config');
const webpack = require('webpack');

const inProject = path.resolve.bind(path, project.basePath);
const inProjectSrc = (file) => inProject(project.srcDir, file);

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const __DEV__ = project.env === 'development';
const __TEST__ = project.env === 'test';
const __PROD__ = project.env === 'production';


const config = {
    entry: {
        normalize: [
            inProjectSrc('normalize'),
        ],
        main: [
            inProjectSrc(project.main),
        ]
    },
    output: {
        filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        path: inProject(project.outDir),
        publicPath: project.publicPath
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: ['babel-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin(Object.assign({
            'process.env': { NODE_ENV: JSON.stringify(project.env) },
            __DEV__,
            __TEST__,
            __PROD__,
        }, project.globals)),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: 'vendor',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        runtimeChunk: {
            name: 'runtime',
        },
    }
};

// Styles
// ------------------------------------
const extractStyles = new MiniCssExtractPlugin({
    filename: 'styles/[name].[contenthash].css',
    allChunks: true,
    chunkFilename: "[id].css",
    disable: __DEV__,
})

config.module.rules.push({
    test: /\.(sass|scss)$/,
    use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        'sass-loader',
    ]
});
config.plugins.push(extractStyles);

// Images
// ------------------------------------
config.module.rules.push({
    test    : /\.(png|jpg|gif|svg)$/,
    loader  : 'url-loader',
    options : {
        limit : 8192,
    },
})
// HTML Template
// ------------------------------------
config.plugins.push(new HtmlWebpackPlugin({
    template: inProjectSrc('index.html'),
    inject: true,
    minify: {
        collapseWhitespace: true,
    },
}))

// Development Tools
// ------------------------------------
if (__DEV__) {
    config.mode = 'production';
    config.entry.main.push(
        `webpack-hot-middleware/client.js?path=${config.output.publicPath}__webpack_hmr`
    )
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    )
}

module.exports = config;