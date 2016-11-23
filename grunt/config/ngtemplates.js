module.exports = {
    dist: {
        options: {
            prefix: '/',
            module: '<%= config.ngModule %>'
        },
        cwd: '<%= config.app %>',
        src: ['**/*.html', '!index.html'],
        dest: '<%= config.app %>/template.js'
    }
};
