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
    request = require('request'),
    exec = require('child_process').exec,
    debug = require('debug')('download');

exports.init = function(grunt) {

    var exports = {};

    // Cross platform "curl" like functionality
    // url: url to download from
    // path: path to write the downloaded artifact to
    // callback: function to call once download completes or error is
    // thrown
    var curl = function(url, path, proxy, callback) {
            var req = request.get({
                'url': url,
                'encoding': 'binary',
                'headers': {
                    'user-agent': 'topcoat.io'
                },
                'proxy': proxy
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

    // hostname: uri of archive host. Ex: https://github.com
    // repo: user/repo unique name of git repo. Ex: topcoat/button
    // tag:  tag number of git tag to use
    //
    // If a version number is given we assume it is a tag and use this url
    // convention:
    // https://github.com/user/repo/archive/0.1.0.zip
    //
    // If no tag is given we use the download api with this url convention:
    // https://api.github.com/repos/user/repo/zipball/dev
    var getDownloadURL = function(hostname, repo, tag) {
            var downloadURL = '';
            if (tag) {
                downloadURL = getTagArchiveURL(hostname, repo, tag);
            } else {
                downloadURL = getNightlyArchiveURL(hostname, repo);
            }

            debug('DOWNLOAD URL:', downloadURL);
            return downloadURL;
        };

    // Returns a download url for a tagged git archive
    // hostname: uri of archive host. Ex: https://github.com
    // repo: user/repo unique name of git repo. Ex: topcoat/button
    // tag:  tag number of git tag to use
    // https://github.com/user/repo/archive/0.1.0.zip
    var getTagArchiveURL = function(hostname, repo, tag) {
            var prefix = hostname,
                suffix = "/archive/",
                ext = ".zip";

            return prefix + repo + suffix + tag + ext;
        };

    // Returns a clone url for the current master of a git repo
    // hostname: uri of archive host. Ex: https://github.com
    // repo: user/repo unique name of git repo. Ex: topcoat/button
    var getNightlyArchiveURL = function(hostname, repo) {
            var prefix = hostname,
                suffix = ".git";

            return prefix + repo + suffix;
        };

    // Downloads a tagged version of a repo from github as a zip file
    // obj: configuration object containing
    //      path: path to save zip to
    //      name: name to name the zip archive
    // next: callback function to call upon completion
    var downloadTag = function(obj, proxy, next) {
            var zipPath = obj.path + '/' + obj.name + ".zip";
            grunt.log.writeln("\nDownloading: " + obj.url + "\nTo => " + zipPath);
            curl(obj.url, zipPath, proxy, next);
        };

    // Fetches a clone of the current, untagged, version of a repo
    // obj: configuration object containing
    //      path: path of repo to clone
    //      name: name to name the cloned directory
    // *Calls shallowClone internally
    var downloadNightly = function(obj, next) {
            var clonePath = obj.path + '/' + obj.name;
            grunt.log.writeln("\nCloning: " + obj.url + "\nTo => " + clonePath);
            shallowClone(obj.url, clonePath, next);
        };

    exports.getDirectoryName = getDirectoryName;
    exports.getDownloadURL = getDownloadURL;
    exports.getTagArchiveURL = getTagArchiveURL;
    exports.getNightlyArchiveURL = getNightlyArchiveURL;
    exports.downloadTag = downloadTag;
    exports.downloadNightly = downloadNightly;

    return exports;
};

