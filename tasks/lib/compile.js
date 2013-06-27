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

var path = require('path'),
    debug = require('debug')('compile');

exports.init = function(grunt) {

    var exports = {};

    var getCompileData = function(options) {
            var compileData = {},
                stylusPathData = getStylusPathData(options);

            grunt.util._.forEach(options.themeFiles, function(theme) {
                compileData[theme] = {
                    options: {
                        paths: stylusPathData,
                        import: getStylusImportData(theme, options),
                        compress: false
                    },
                    files: getStylusFilesData(theme, options)
                };
            });

            return compileData;
        };

    var getStylusPathData = function(options) {
            var pathData = [
                options.controlsFilesPath,
                options.utilsFilesPath,
                options.themeFilesPath
            ];

            return pathData;
        };

    var getStylusImportData = function(theme, options) {
            var importData = [
                options.mixinFiles,
                theme,
                'nib'
            ];

            importData.forEach(function(element, index, array) {
                array[index] = path.basename(element);
            });

            return importData;
        };

    var getStylusFilesData = function(theme, options) {
            var fileData = [],
                releasePath = options.releasePath,
                skinFiles = options.skinsPath + '**/src/*.styl',
                //TODO: Add platform file.
                //  write out nib vendor-prefixes variable with chosen platform variables
                //  in this format:
                //  vendor-prefixes ?= webkit moz o ms official
                includes = options.srcPath + '**/src/includes/*.styl',
                fileName = path.basename(theme).split('.styl').join('.css');

            fileData.push({
                src: [includes, skinFiles],
                dest: releasePath + fileName.replace(options.themePrefix, '')
            });

            return fileData;
        };

    debug('CONFIG DATA:', JSON.stringify(getCompileData(), null, 2));

    exports.getCompileData = getCompileData;
    exports.getStylusPathData = getStylusPathData;
    exports.getStylusImportData = getStylusImportData;
    exports.getStylusFilesData = getStylusFilesData;

    return exports;
};
