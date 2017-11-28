import webpack from 'webpack';
import git from 'git-rev-sync';
import baseConfig from './base.config';
import startKoa from './utils/start-koa';
import config from 'config';

// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// baseConfig.plugins.push(new BundleAnalyzerPlugin());

export default {
    ...baseConfig,
    devtool: 'cheap-module-eval-source-map',
    output: {
        ...baseConfig.output,
        publicPath: '/assets/'
    },
    module: {
        ...baseConfig.module,
        rules: [
            ...baseConfig.module.rules,
        ]
    },
    // https://github.com/webpack-contrib/css-loader/issues/447
    node: {
        fs: 'empty'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(config.get('BROWSER')),
                NODE_ENV: JSON.stringify(config.util.getEnv('NODE_ENV')),
                VERSION: JSON.stringify(git.long())
            },
            global: {
                TYPED_ARRAY_SUPPORT: JSON.stringify(false)
            }
        }),
        ...baseConfig.plugins,
        function () {
            console.log("Please wait for app server startup (~60s)" +
                " after webpack server startup...");
            this.plugin('done', startKoa);
        }
    ]
};
