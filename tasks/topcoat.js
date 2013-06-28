/*
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

var debug = require('debug')('topcoat');

module.exports = function(grunt) {
    'use strict';

    var download = require('./lib/download').init(grunt),
        compile = require('./lib/compile').init(grunt);

    grunt.registerMultiTask('topcoat', 'Downloads dependencies and compiles a topcoat css and usage guide', function() {

        var options = this.options({
            hostname: 'https://github.com/',
            proxy: null,
            srcPath: 'src',
            controlsPath: 'src/controls',
            skinsPath: 'src/skins',
            themePath: 'src/theme',
            themePrefix: 'theme',
            utilsPath: 'src/utils',
            releasePath: 'css/',
            platforms: ['webkit', 'moz', 'o', 'ms', 'official'],
            download: true,
            compile: true
        }),
            _ = grunt.util._,
            async = grunt.util.async,
            done = this.async(),
            file = grunt.file,
            deps = options.repos,
            controls = deps.controls || {},
            skins = deps.skins || {},
            utils = deps.utils || {},
            theme = deps.theme || {},
            compileOptions = {};

        // Loop over topcoat dependency object and downloads dependecies in
        // order.
        // obj: topcoat dependency object defined in package.json
        // path: destination directory path to download dependencies into
        // callback: function to call once all dependencies have finished
        // downloading
        var downloadResources = function(obj, path, callback) {
                var urls = [];
                _.forIn(obj, function(value, key) {
                    var name = download.getDirectoryName(key);
                    urls.push({
                        tag: value,
                        name: name,
                        url: download.getDownloadURL(options.hostname, key, value),
                        path: path
                    });
                });

                async.forEachSeries(urls, function(obj, next) {
                    if (obj.tag) {
                        download.downloadTag(obj, options.proxy, next);
                    } else {
                        download.downloadNightly(obj, next);
                    }
                }, callback);
            };

        if (options.download) {
            debug('DOWNLOAD');

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
                    file.mkdir(options.themePath);
                    downloadResources(theme, options.themePath, callback);
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
        }

        //Compile
        if (options.compile) {
            debug('COMPILE');
            //FIXME: This file expansion BS is gross.
            // Need to make a pull request to grunt-contrib-stylus to
            // expand file *s
            compileOptions.themeFiles = grunt.file.expand(options.themePath + '/**/src/' + options.themePrefix + '-' + '*.styl');
            compileOptions.controlsFilesPath = grunt.file.expand(options.controlsPath + '/**/src/mixins');
            compileOptions.utilsFilesPath = grunt.file.expand(options.utilsPath + '/**/src/mixins');
            compileOptions.themeFilesPath = grunt.file.expand(options.themePath + '/**/src');
            compileOptions.mixinFiles = grunt.file.expand(options.controlsPath + '/**/src/mixins/*.styl');
            compileOptions.utilFiles = grunt.file.expand(options.utilsPath + '/**/src/mixins/*.styl');
            compileOptions.releasePath = options.releasePath;
            compileOptions.skinsPath = options.skinsPath;
            compileOptions.srcPath = options.srcPath;
            compileOptions.themePrefix = options.themePrefix;


            debug('COMPILE OPTIONS:', compileOptions);
            debug('COMPILE DATA:', JSON.stringify(compile.getCompileData(compileOptions), null, 4));

            done();

            grunt.loadNpmTasks('grunt-contrib-stylus');
            grunt.config('stylus', compile.getCompileData(compileOptions));
            grunt.task.run('stylus');
        }

    });
};
