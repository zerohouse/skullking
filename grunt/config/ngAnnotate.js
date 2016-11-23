module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: 'dist',
            src: '**/*.js',
            dest: 'dist'
        }]
    }
};