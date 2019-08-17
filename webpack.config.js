const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function generateConfig(name) {
    const uglify = name.indexOf('min') > -1;
    const config = {
        entry: './src/Form.js',
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: name + '.js',
            sourceMapFilename: name + '.map',
            library: 'formla',
            libraryTarget: 'umd',
        },
        node: {
            process: false
        },
        mode: 'production',
        optimization: {
            minimize: uglify,
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                            ],
                            presets: [
                                '@babel/preset-flow',
                            ],
                        }
                    }
                }
            ]
        }
    };

    if (uglify) {
        config.optimization.minimizer = [new UglifyJsPlugin({
            sourceMap: true,
        })];
    }

    return config;
}

module.exports = ['Form', 'Form.min'].map(function (key) {
    return generateConfig(key);
});
