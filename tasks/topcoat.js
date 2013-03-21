/*
 * grunt-topcoat
 *
 */

'use strict';

var fs = require('fs'),
    request = require('request');

module.exports = function(grunt) {

    grunt.registerMultiTask('topcoat', 'Downloads specified repos for use in the TopDoat build process.', function() {
        var _ = grunt.util._,
            async = grunt.util.async,
            done = this.async(),
            file = grunt.file,
            options = this.options(),
            srcPath = options.srcPath || "src/",
            deps = options.repos,
            controls = deps.controls || {},
            skins = deps.skins || {},
            theme = deps.theme || {};

        // Splits the supplied user/repo name so we can use just the repo name
        //   for the zip file name.
        //   Example:
        //     topcoat/button
        //     button.zip
        var getDirectoryName = function(repo) {
                if (repo) {
                    return repo.split('/')[1];
                }
            };

        // If a version number is given we assume it is a tag and use this url
        // convention:
        // https://github.com/user/repo/archive/0.1.0.zip
        //
        // If no tag is given we use the download api with this url convention:
        // https://api.github.com/repos/user/repo/zipball/dev
        var getDownloadURL = function(repo, tag) {
            var downloadURL = '';
            if (tag) {
                downloadURL = getTagArchiveURL(repo, tag);
            } else {
                downloadURL = getNightlyArchiveURL(repo);
            }
            return downloadURL;
        };

        // Returns a download url for a tagged git archive
        // repo: user/repo unique name of git repo. Ex: topcoat/button
        // tag:  tag number of git tag to use
        // https://github.com/user/repo/archive/0.1.0.zip
        var getTagArchiveURL = function(repo, tag) {
            var prefix = "https://github.com/",
                suffix = "/archive/",
                ext = ".zip";

            return prefix + repo + suffix + tag + ext;
        };

        // Returns a download url for the current master of a git repo
        // repo: user/repo unique name of git repo. Ex: topcoat/button
        // https://api.github.com/repos/user/repo/zipball/dev
        // api is described here:
        // http://developer.github.com/v3/repos/contents/#get-archive-link
        var getNightlyArchiveURL = function(repo) {
            var prefix = "https://api.github.com/repos/",
                suffix = "/zipball";

            return prefix + repo + suffix;
        };

        var curl = function(url, path, callback) {
            request.get({
                'url': url,
                'encoding': 'binary'
            },
            function(error, result, body) {
                if (!error) {
                    fs.writeFileSync(path, body, 'binary');
                } else {
                    grunt.fail.fatal(error);
                }
                callback(error, body);
            });
        };

        var downloadResources = function(obj, path, callback) {
                var urls = [];
                _.forIn(obj, function(value, key) {
                    var name = getDirectoryName(key);
                    urls.push({
                        name: name,
                        url: getDownloadURL(key, value)
                    });
                });

                async.forEachSeries(urls, function(obj, next) {
                    var zipPath = path + obj.name + ".zip";
                    grunt.log.writeln("Downloading: " + obj.url + "\n into >> " + zipPath);
                    curl(obj.url, zipPath, next);
                }, callback);
            };

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
                // Download controls into srcPath/controls/
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
                // Download skins into srcPath/skins/
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
