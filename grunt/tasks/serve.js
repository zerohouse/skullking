module.exports = function (grunt) {
    grunt.registerTask('serve', 'Compile then start a connect web server', (target)=> {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }
        grunt.task.run([
            'includeSource',
            'clean:server',
            'wiredep',
            'concurrent:server',
            'configureProxies:livereload',
            'connect:livereload',
            'watch'
        ]);
    });
};