const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        index: path.resolve(__dirname, './browser.test.ts')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './bin')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
}