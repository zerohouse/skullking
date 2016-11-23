module.exports = {
    bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
    },
    js: {
        files: ['<%= config.app %>/{,*/}*.js'],
        tasks: ['newer:jshint:all', 'includeSource'],
        options: {
            livereload: '<%= connect.livereload %>'
        }
    },
    less: {
        files: [
            '<%= config.app %>/**/*.less'
        ],
        tasks: ['less', 'includeSource'],
        options: {
            interrupt: true
        }
    },
    gruntfile: {
        files: ['Gruntfile.js']
    },
    livereload: {
        options: {
            livereload: '<%= connect.livereload %>'
        },
        files: [
            '<%= config.app %>/{,*/}*.html',
            '<%= config.app %>/{,*/}*.js',
            '<%= config.app %>/{,*/}*.css'
        ]
    }
};