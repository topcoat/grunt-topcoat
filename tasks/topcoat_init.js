/*
 * grunt-topcoat-init
 * https://github.com/krjoseph/grunt-topcoat-init
 *
 * Copyright (c) 2013 @dam
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Please see the grunt documentation for more information regarding task
    // creation: https://github.com/gruntjs/grunt/blob/devel/docs/toc.md
    grunt.registerMultiTask('topcoat_init', 'Clones git projects to specified directory.', function() {
        var _ = grunt.util._;
        var async = grunt.util.async;
        var done = this.async();
        var spawn = grunt.util.spawn;
        var file = grunt.file;
        var options = this.options();
        var prefix = "https://github.com/";
        var suffix = "/archive/";
        var ext = ".zip";
        var srcPath = options.srcPath || "src/";
        var deps = options.repos;
        var controls = deps.controls || {};
        var skins = deps.skins || {};
        var theme = deps.theme || {};
        var controlsUrls, skinsUrls;

        // If a version number is given we assume it is a tag and use this url
        // convention:
        // https://github.com/topcoat/topcoat/archive/0.1.0.zip
        // If no version is given we use the download api with this url convention:
        // https://api.github.com/repos/user/repo/zipball/dev
        // Loop over controls object
        // Example:
        // "controls": {
        //    "topcoat/button": "0.1.0"
        //  }
        //
        //  controls becomes the name of the directory under src. src/controls
        //  download url is constructed with:
        //    prefix + key + suffix + value + ext
        //
        // Example:
        // https://github.com/topcoat/button/archive/0.1.0.zip
        //
        if (!_.isEmpty(controls)) {
            controlsUrls = [];
            var controlName;
            var controlsPath = srcPath + "controls/";

            file.mkdir(controlsPath);

            _.forIn(controls, function(value, key) {
                controlName = key.split('/')[1];
                controlsUrls.push({
                    name: controlName,
                    url: prefix + key + suffix + value + ext
                });
            });

            async.forEachSeries(controlsUrls, function(obj, next) {
                var zipPath = controlsPath + obj.name + ext;
                var downloadProcess = spawn({
                    cmd: 'curl',
                    args: ['-o', zipPath, obj.url]
                }, next);

                downloadProcess.stdout.pipe(process.stdout);
                downloadProcess.stderr.pipe(process.stderr);
            }, done);

        } else {
            console.log("Controls was empty");
        }

    });
};
