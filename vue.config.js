/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
const webpack = require('webpack')
module.exports = {
    configureWebpack: {

        plugins: [

            new webpack.ProvidePlugin({

                $:"jquery",

                jQuery:"jquery",

                "windows.jQuery":"jquery"

            })

        ]

    },
    devServer: {
        port: 8084, // 端口
    },
}
