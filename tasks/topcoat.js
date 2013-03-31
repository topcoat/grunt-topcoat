/*
 * grunt-topcoat
 *
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    request = require('request'),
    ProgressBar = require('progress');

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

        // Cross platform "curl" like functionality
        // url: url to download from
        // path: path to write the downloaded artifact to
        // callback: function to call once download completes or error is
        // thrown
        var curl = function(url, path, callback) {
                var req = request.get({
                    'url': url,
                    'encoding': 'binary'
                }, function(error, result, body) {
                    if (!error) {
                        fs.writeFileSync(path, body, 'binary');
                    } else {
                        grunt.fail.fatal(error);
                    }
                    callback(error, body);
                });

//                req.on('response', function(res) {
//                    var len = parseInt(res.headers['content-length'], 10);
//
//                    console.log();
//                    var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
//                        complete: '=',
//                        incomplete: ' ',
//                        width: 20,
//                        total: len
//                    });
//
//                    res.on('data', function(chunk) {
//                        bar.tick(chunk.length);
//                    });
//
//                    res.on('end', function() {
//                        console.log('\n');
//                    });
//                });
            };

        // Loop over topcoat dependency object and downloads dependecies in
        // order.
        // obj: topcoat dependency object defined in package.json
        // path: destination directory path to download dependencies into
        // callback: function to call once all dependencies have finished
        // downloading
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

        // Download controls, theme and skins
        // controls and the theme to use is downloaded into the topcoat
        // repo by the topcoat grunt script
        //
        // skins are downloaded into the theme by the theme repos grunt
        // script
        // TODO: Find out a way to automate calling grunt on the theme
        // after it has been downloaded and unzipped in the topcoat repo
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
            grunt.task.run('unzip:controls');
            callback();
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
            grunt.task.run('unzip:theme');
            callback();
        },

        function(callback) {
            // FIXME: Need to unzip the theme before we can download skins
            // into it.
            // Download skins into srcPath/theme-*/skins/
            if (!_.isEmpty(skins)) {
                var themePath = grunt.file.expand('src/theme-*'),
                    skinsPath = srcPath + "skins/";

                grunt.log.write("themePath "+ themePath);
                file.mkdir(skinsPath);
                downloadResources(skins, skinsPath, callback);
            } else {
                callback();
                grunt.log.writeln("No skins specified");
            }
        },

        function(callback) {
            grunt.task.run('unzip:skins');
            callback();
        },

        function(callback) {
            grunt.task.run('clean:zip');
            callback();
        },

        function() {
            done();
        }]);
    });
};
