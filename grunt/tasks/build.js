module.exports = function (grunt) {
    grunt.registerTask('build', [
        'clean:dist',
        'jshint:all',
        'wiredep',
        'ngtemplates',
        'includeSource',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'copy:dist',
        'babel',
        'ngAnnotate',
        'cssmin',
        'usemin',
        'uglify',
        'clean:template'
    ]);
};