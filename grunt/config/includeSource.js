module.exports = {
    options: {
        basePath: '<%= config.app %>',
        baseUrl: '/'
    },
    templates: {
        html: {
            js: '<script src="{filePath}"></script>',
            css: '<link rel="stylesheet" type="text/css" href="{filePath}" />'
        }
    },
    myTarget: {
        files: {
            'app/index.html': 'app/index.html'
        }
    }
};