module.exports = {
    app: {
        src: ['<%= config.app %>/index.html'],
        ignorePath: /\.\.\//,
        fileTypes: {
            html: {
                block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
                detect: {
                    js: /<script.*src=['"]([^'"]+)/gi,
                    css: /<link.*href=['"]([^'"]+)/gi
                },
                replace: {
                    js: '<script src="/{{filePath}}"></script>',
                    css: '<link rel="stylesheet" href="/{{filePath}}" />'
                }
            }
        }
    }
};