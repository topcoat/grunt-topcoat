/*
 * grunt-topcoat
 *
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    request = require('request'),
    exec = require('child_process').exec,
    debug = require('debug')('build');

module.exports = function(grunt) {

    grunt.registerMultiTask('topcoat', 'Downloads specified repos for use in the TopCoat build process.', function() {
        var _ = grunt.util._,
            async = grunt.util.async,
            done = this.async(),
            file = grunt.file,
            options = this.options(),
            hostname = options.hostname || "https://github.com/",
            srcPath = options.srcPath || "src/",
            controlsPath = options.controlsPath || srcPath + "controls/",
            skinsPath = options.skinsPath || srcPath + "skins/",
            themePath = options.themePath || srcPath + "theme/",
            utilsPath = options.utilsPath || srcPath + "utils/",
            deps = options.repos,
            controls = deps.controls || {},
            skins = deps.skins || {},
            utils = deps.utils || {},
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
                var prefix = hostname,
                    suffix = "/archive/",
                    ext = ".zip";

                return prefix + repo + suffix + tag + ext;
            };

        // Returns a clone url for the current master of a git repo
        // repo: user/repo unique name of git repo. Ex: topcoat/button
        var getNightlyArchiveURL = function(repo) {
                var prefix = hostname,
                    suffix = ".git";

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
                    'encoding': 'binary',
                    'headers': {'user-agent': 'topcoat.io'}
                }, function(error, response, body) {
                    if (!error) {
                        fs.writeFileSync(path, body, 'binary');
                    } else {
                        grunt.fail.fatal(error);
                    }
                    callback(error, body);
                });
                debug("REQUEST:", req);
            };

        var shallowClone = function(url, path, callback) {
                var cmd = "git clone " + url + " --depth 1 " + path,
                    process = exec(cmd, function(error, stdout, stderr) {
                        callback(error);
                    });
            };

        var downloadTag = function(obj, next) {
                var zipPath = obj.path + obj.name + ".zip";
                grunt.log.writeln("\nDownloading: " + obj.url + "\nTo => " + zipPath);
                curl(obj.url, zipPath, next);
            };

        var downloadNightly = function(obj, next) {
                var clonePath = obj.path + obj.name;
                grunt.log.writeln("\nCloning: " + obj.url + "\nTo => " + clonePath);
                shallowClone(obj.url, clonePath, next);
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
                        tag: value,
                        name: name,
                        url: getDownloadURL(key, value),
                        path: path
                    });
                });

                async.forEachSeries(urls, function(obj, next) {
                    if (obj.tag) {
                        downloadTag(obj, next);
                    } else {
                        downloadNightly(obj, next);
                    }
                }, callback);
            };

        // Download controls, theme and skins into specified folders for the
        // build
        async.parallel([

        function(callback) {
            if (!_.isEmpty(controls)) {
                file.mkdir(controlsPath);
                downloadResources(controls, controlsPath, callback);
            } else {
                callback();
                grunt.log.writeln("No controls specified");
            }
        },

        function(callback) {
            if (!_.isEmpty(theme)) {
                downloadResources(theme, srcPath, callback);
            } else {
                callback();
                grunt.log.writeln("No theme specified");
            }
        },

        function(callback) {
            if (!_.isEmpty(utils)) {
                file.mkdir(utilsPath);
                downloadResources(utils, utilsPath, callback);
            } else {
                callback();
                grunt.log.writeln("No utils specified");
            }
        },

        function(callback) {
            if (!_.isEmpty(skins)) {
                file.mkdir(skinsPath);
                downloadResources(skins, skinsPath, callback);
            } else {
                callback();
                grunt.log.writeln("No skins specified");
            }
        },

        function(callback) {
            grunt.task.run('unzip');
            callback();
        },

        function(callback) {
            grunt.task.run('clean:zip');
            callback();
        }

        ], done);
    });
};
