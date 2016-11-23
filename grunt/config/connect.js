module.exports = {
    options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729
    },
    livereload: {
        proxies: [
            {
                context: ['/api'], host: '127.0.0.1',
                port: 8080
            },
            {
                context: ['/ws'], host: '127.0.0.1',
                port: 8080,
                ws: true
            }
        ],
        options: {
            open: true,
            middleware: function (connect) {
                console.log("<%= config.app %>");
                return [
                    require('grunt-connect-proxy/lib/utils').proxyRequest,
                    require('connect-modrewrite')(['!\\.html|\\.js|\\.ico|\\.svg|\\.css|\\.png|\\.gif|\\.jpg|\\.woff|\\.woff2|\\.ttf$ /index.html [L]']),
                    connect().use(
                        '/bower_components',
                        connect.static('./bower_components')
                    ),
                    connect.static("app")
                ];
            }
        }
    },
    dist: {
        proxies: [
            {
                context: ['/api'],
                host: '127.0.0.1',
                port: 8080
            }
        ],
        options: {
            open: true,
            middleware: function (connect) {
                return [
                    require('grunt-connect-proxy/lib/utils').proxyRequest,
                    require('connect-modrewrite')(['!\\.html|\\.js|\\.ico|\\.svg|\\.css|\\.png|\\.gif|\\.jpg|\\.woff|\\.woff2|\\.ttf$ /index.html [L]']),
                    connect().use(
                        '/styles',
                        connect.static('./styles')
                    ),
                    connect().use(
                        '/scripts',
                        connect.static('./scripts')
                    ),
                    connect().use(
                        '/images',
                        connect.static('./images')
                    ),
                    connect.static("dist")
                ];
            }
        }
    }
};