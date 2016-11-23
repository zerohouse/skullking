module.exports = function (grunt) {
    var path = require('path');
    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt/config'),
        jitGrunt: {
            customTasksDir: 'grunt/tasks',
            staticMappings: {
                useminPrepare: 'grunt-usemin',
                ngtemplates: 'grunt-angular-templates',
                cdnify: 'grunt-google-cdn',
                configureProxies: 'grunt-connect-proxy'
            }
        },
        data: {
            config: {
                app: 'app',
                dist: 'dist',
                ngModule: 'app'
            }
        }
    });
    require('time-grunt')(grunt);
};