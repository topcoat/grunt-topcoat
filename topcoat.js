
module.exports = function(grunt) {
    'use strict';

    var topcoat = require('topcoat');
    grunt.registerMultiTask('topcoat', 'Downloads dependencies and compiles a topcoat css and usage guide', function() {

        var options = this.options({
            srcPath: 'src/',
            releasePath: 'css/'
        });

    });
};
