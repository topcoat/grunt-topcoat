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

module.exports = function(grunt) {

    grunt.registerMultiTask('compile', 'Generates dynamic config and compiles css', function() {

        // Handle default options
        var options = this.options({
            srcPath: 'src/',
            releasePath: 'css/'
        }),
            //Externalize these paths?
            controlsPath = options.srcPath + 'controls/',
            skinsPath = options.srcPath + 'skins/',
            themePath = options.srcPath + 'theme*/',
            utilsPath = options.srcPath + 'utils/';


        var getCompileData = function() {
                var compileData = {},
                    themeFiles = grunt.file.expand(options.srcPath + '**/src/theme-*.styl'),
                    stylusPathData = getStylusPathData();

                grunt.util._.forEach(themeFiles, function(theme) {
                    compileData[theme] = {
                        options: {
                            paths: stylusPathData,
                            import: getStylusImportData(theme),
                            compress: false
                        },
                        files: getStylusFilesData(theme)
                    };
                });

                return compileData;
            };

        var getStylusPathData = function() {
                var controlsFilesPath = grunt.file.expand(controlsPath + '**/src/mixins'),
                    utilsFilesPath = grunt.file.expand(utilsPath + '**/src/mixins'),
                    themeFilesPath = grunt.file.expand(themePath + '**/src');

                return controlsFilesPath.concat(utilsFilesPath, themeFilesPath);
            };

        var getStylusImportData = function(theme) {
                var mixinFiles = grunt.file.expand(controlsPath + '**/src/mixins/*.styl'),
                    utilFiles = grunt.file.expand(utilsPath + '**/src/mixins/*.styl'),
                    importData = mixinFiles.concat([theme, 'nib']);

                    importData.forEach(function(element, index, array) {
                        array[index] = path.basename(element);
                    });

                return importData;
            };

        var getStylusFilesData = function(theme) {
                var fileData = [],
                    releasePath = options.releasePath,
                    skinFiles = skinsPath + '**/src/*.styl',
                    includes = options.srcPath + '**/src/includes/*.styl',
                    fileName = path.basename(theme).split('.styl').join('.css');

                var releaseFile = releasePath + fileName,
                    files = includes.concat(skinFiles);

                fileData.push({
                    src: [includes, skinFiles],
                    dest: releasePath + fileName.replace('theme-', "")
                });

                return fileData;
            };

        debug('CONFIG DATA:', JSON.stringify(getCompileData(), null, 2));

        grunt.config('stylus', getCompileData());
        grunt.task.run('stylus');
    });
};
