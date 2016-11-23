module.exports = {
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dist %>',
            src: [
                'images/**/*.*',
                'index.html'
            ]
        }, {
            expand: true,
            dot: true,
            cwd: 'static',
            dest: 'dist/static',
            src: [
                '**/*.*'
            ]
        }]
    }
};