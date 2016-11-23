module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: '<%= config.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: '<%= config.app %>/images'
        }]
    }
};
