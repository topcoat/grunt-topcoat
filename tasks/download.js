/**
 *
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    request = require('request'),
    exec = require('child_process').exec,
    debug = require('debug')('download');

module.exports = function(grunt) {

    grunt.registerMultiTask('download', 'Downloads specified repos for use in the TopCoat build process.', function() {

        // Handle default options
        var options = this.options({
            hostname: 'https://github.com/',
            srcPath: 'src/',
            controlsPath: 'src/controls/',
            skinsPath: 'src/skins/',
            themePath: 'src/theme/',
            utilsPath: 'src/utils/',
            proxy: ''
        }),
            _ = grunt.util._,
            async = grunt.util.async,
            done = this.async(),
            file = grunt.file,
            deps = options.repos,
            controls = deps.controls || {},
            skins = deps.skins || {},
            utils = deps.utils || {},
            theme = deps.theme || {};

        debug('OPTIONS:', options);

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
                var prefix = options.hostname,
                    suffix = "/archive/",
                    ext = ".zip";

                return prefix + repo + suffix + tag + ext;
            };

        // Returns a clone url for the current master of a git repo
        // repo: user/repo unique name of git repo. Ex: topcoat/button
        var getNightlyArchiveURL = function(repo) {
                var prefix = options.hostname,
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
                    'headers': {
                        'user-agent': 'topcoat.io'
                    },
                    'proxy': options.proxy
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

        // Makes a git shallow clone to omit uneeded
        //  git history
        //  url: url to clone from
        //  path: path to clone into
        //  callback: function to call on completion
        var shallowClone = function(url, path, callback) {
                var cmd = "git clone " + url + " --depth 1 " + path,
                    process = exec(cmd, function(error, stdout, stderr) {
                        callback(error);
                    });
            };

        // Downloads a tagged version of a repo from github as a zip file
        // obj: configuration object containing
        //      path: path to save zip to
        //      name: name to name the zip archive
        // next: callback function to call upon completion
        var downloadTag = function(obj, next) {
                var zipPath = obj.path + obj.name + ".zip";
                grunt.log.writeln("\nDownloading: " + obj.url + "\nTo => " + zipPath);
                curl(obj.url, zipPath, next);
            };

        // Fetches a clone of the current, untagged, version of a repo
        // obj: configuration object containing
        //      path: path of repo to clone
        //      name: name to name the cloned directory
        // *Calls shallowClone internally
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
                file.mkdir(options.controlsPath);
                downloadResources(controls, options.controlsPath, callback);
            } else {
                callback();
                grunt.log.writeln("No controls specified");
            }
        },

        function(callback) {
            if (!_.isEmpty(theme)) {
                downloadResources(theme, options.srcPath, callback);
            } else {
                callback();
                grunt.log.writeln("No theme specified");
            }
        },

        function(callback) {
            if (!_.isEmpty(utils)) {
                file.mkdir(options.utilsPath);
                downloadResources(utils, options.utilsPath, callback);
            } else {
                callback();
                grunt.log.writeln("No utils specified");
            }
        },

        function(callback) {
            if (!_.isEmpty(skins)) {
                file.mkdir(options.skinsPath);
                downloadResources(skins, options.skinsPath, callback);
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
