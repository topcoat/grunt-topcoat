var debug = require('debug')('topcoat');

module.exports = function(grunt) {
    'use strict';

    grunt.registerMultiTask('topcoat', 'Downloads dependencies and compiles a topcoat css and usage guide', function() {

        var options = this.options({
            hostname: 'https://github.com/',
            proxy: '',
            srcPath: 'src/',
            controlsPath: 'src/controls/',
            skinsPath: 'src/skins/',
            themePath: 'src/theme*/',
            utilsPath: 'src/utils/',
            releasePath: 'css/',
            download: true,
            compile: true
        });

        if (options.download) {
            debug('DOWNLOAD');
            grunt.config('download', this.options);
            grunt.task.run('download');
        }

        if (options.compile) {
            debug('COMPILE');
            grunt.config('compile', this.options);
            grunt.task.run('compile');
        }

    });
};
