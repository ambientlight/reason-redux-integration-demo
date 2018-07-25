import webpack from 'webpack'
import path from 'path'
import { getIfUtils, removeEmpty } from 'webpack-config-utils'

import HTMLWebpackPlugin from 'html-webpack-plugin'

const config = target => env => {
    const { ifProduction, ifNotProduction } = getIfUtils(env)
    const base = {
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, 'app/dist'),
            publicPath: ''
        },

        mode: ifProduction('production', 'development'),
        devtool: ifProduction('eval', 'sourcemaps'),
        devServer: {
            port: 8080,
            historyApiFallback: true
        },

        resolve: {
            alias: {
                reason: path.resolve(__dirname, "lib/js/src"),
                src: path.resolve(__dirname, "src")
            },
            extensions: [".js", ".ts", ".jsx", ".tsx", ".json"]
        },
        module: {
            rules: [
                { test: /\.tsx?$/, loaders: ["awesome-typescript-loader"], exclude: [/\.(spec|e2e|d)\.ts$/] },
                { test: /\.css$/, loaders: ['style-loader', 'css-loader']},
                { test: /\.(woff|woff2|eot|ttf|svg|png)$/, loader: 'file-loader?name=assets/[name].[ext]'}
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env.production ? 'production' : 'development'),
                ENVIRONMENT: JSON.stringify({
                    isDev: !env.production,
                    shouldHotReloadEpics: env.hotEpics !== undefined
                })
            })
        ],

        // Don't let webpack substitude these 
        node: {
            __dirname: false,
            __filename: false
        }
    }

    // config chunk for main process
    const main = {
        target: 'electron-main',
        entry: {
            main: [
                ifProduction('./src/main.ts', './src/main_dev.ts')
            ]
        },
        plugins: base.plugins
    }

    // config chunk for renderer process
    const renderer = {
        target: 'electron-renderer',
        entry: {
            renderer: [
                './src/index.tsx'
            ]
        },
        plugins: [
            ...base.plugins,
            new HTMLWebpackPlugin({
                //hash: true,
                excludeChunks: [],
                template: './base.html'
            }),
            new webpack.NamedModulesPlugin()
        ]
    }
    
    return Object.assign(base, target === 'electron-main' ? main : renderer) 
}

export default [config('electron-main'), config('electron-renderer')]