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
    grunt.registerMultiTask('topcoat', 'Clones git projects to specified directory.', function() {
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

        var downloadResources = function(obj, path) {
            var urls = [];
            _.forIn(obj, function(value, key) {
                var name = getRepoName(key);
                urls.push({
                    name: name,
                    url: prefix + key + suffix + value + ext
                });
            });

            async.forEachSeries(urls, function(obj, next) {
                var zipPath = path + obj.name + ext;
                var downloadProcess = spawn({
                    cmd: 'curl',
                    args: ['-L', '-o', zipPath, obj.url]
                }, next);

                downloadProcess.stdout.pipe(process.stdout);
                downloadProcess.stderr.pipe(process.stderr);
            }, done);
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
        if (!_.isEmpty(controls)) {
            var controlsPath = srcPath + "controls/";
            file.mkdir(controlsPath);
            downloadResources(controls, controlsPath);
        } else {
            grunt.log.writeln("No controls specified");
        }

        // Download theme into srcPath/theme
        if (!_.isEmpty(theme)) {
            grunt.log.writeln("Downloading theme");
            downloadResources(theme, srcPath);
        } else {
            grunt.log.writeln("No theme specified");
        }

    });

};
