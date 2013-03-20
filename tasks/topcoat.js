/*
 * grunt-topcoat
 * https://github.com/krjoseph/grunt-topcoat
 *
 * Copyright (c) 2013 @dam
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Please see the grunt documentation for more information regarding task
    // creation: https://github.com/gruntjs/grunt/blob/devel/docs/toc.md
    grunt.registerMultiTask('topcoat', 'Downloads specified repos for use in the TopDoat build process.', function() {
        var _ = grunt.util._,
            async = grunt.util.async,
            done = this.async(),
            spawn = grunt.util.spawn,
            file = grunt.file,
            options = this.options(),
            prefix = "https://github.com/",
            suffix = "/archive/",
            ext = ".zip",
            srcPath = options.srcPath || "src/",
            deps = options.repos,
            controls = deps.controls || {},
            skins = deps.skins || {},
            theme = deps.theme || {},
            controlsUrls, skinsUrls;

        var getRepoName = function(key) {
                if (key) return key.split('/')[1];
            };

        var downloadResources = function(obj, path, callback) {
                var urls = [];
                _.forIn(obj, function(value, key) {
                    var name = getRepoName(key);
                    urls.push({
                        name: name,
                        url: prefix + key + suffix + value + ext
                    });
                });
                console.log("URLS:", urls);

                async.forEachSeries(urls, function(obj, next) {
                    var zipPath = path + obj.name + ext;
                    grunt.log.writeln("Downloading: " + zipPath);
                    var downloadProcess = spawn({
                        cmd: 'curl',
                        args: ['-L', '-o', zipPath, obj.url]
                    }, next);

                    downloadProcess.stdout.pipe(process.stdout);
                    downloadProcess.stderr.pipe(process.stderr);
                }, callback);
            }

            // If a version number is given we assume it is a tag and use this url
            // convention:
            // https://github.com/topcoat/topcoat/archive/0.1.0.zip
            //
            // TODO:
            // If no version is given we use the download api with this url convention:
            // https://api.github.com/repos/user/repo/zipball/dev
            //
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
            async.series([

            function(callback) {
                if (!_.isEmpty(controls)) {
                    var controlsPath = srcPath + "controls/";
                    file.mkdir(controlsPath);
                    downloadResources(controls, controlsPath, callback);
                } else {
                    callback();
                    grunt.log.writeln("No controls specified");
                }
            },

            function(callback) {
                // Download theme into srcPath/theme
                if (!_.isEmpty(theme)) {
                    downloadResources(theme, srcPath, callback);
                } else {
                    callback();
                    grunt.log.writeln("No theme specified");
                }
            },

            function(callback) {
                // Download theme into srcPath/theme
                if (!_.isEmpty(skins)) {
                    var skinsPath = srcPath + "skins/";
                    file.mkdir(skinsPath);
                    downloadResources(skins, skinsPath, callback);
                } else {
                    callback();
                    grunt.log.writeln("No skins specified");
                }
            }, function() {
                done();
            }]);

    });

};
