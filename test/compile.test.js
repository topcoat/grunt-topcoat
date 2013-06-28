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

/*global describe, it*/

'use strict';

var grunt = require('grunt'),
    assert = require('assert'),
    fs = require('fs'),
    debug = require('debug')('test'),
    compile = require('../tasks/lib/compile').init(grunt),
    compileOptions = {};

compileOptions.themeFiles = ['src/theme/src/theme-fake-dark.styl'];
compileOptions.controlsFilesPath = ['src/controls/button-base/src/mixins'];
compileOptions.utilsFilesPath = ['src/utils/utils/src/mixins'];
compileOptions.themeFilesPath = ['src/theme/src'];
compileOptions.mixinFiles = ['src/controls/button-base/src/mixins/button-mixin.styl'];
compileOptions.utilFiles = ['src/utils/utils/src/mixins/utils.styl'];
compileOptions.releasePath = 'css';
compileOptions.skinsPath = 'src/skins';
compileOptions.srcPath = 'src';
compileOptions.includeFiles = 'src/**/src/includes/*.styl';
compileOptions.skinsFiles = 'src/skins/**/src/*.styl';
compileOptions.themePrefix = 'theme';

describe('compile', function() {

    describe('getCompileData', function() {
        it('should return the correct compile data', function() {
            var expected = {
                'src/theme/src/theme-fake-dark.styl': {
                    options: {
                        paths: [
                            'src/controls/button-base/src/mixins',
                            'src/utils/utils/src/mixins',
                            'src/theme/src'
                        ],
                        import: [
                            'theme-fake-dark.styl',
                            'nib',
                            'button-mixin.styl'
                        ],
                        compress: false
                    },
                    files: [
                        {
                            src: [
                                'src/**/src/includes/*.styl',
                                'src/skins/**/src/*.styl'
                            ],
                            dest:'css/fake-dark.css'
                        }
                    ]
                }
            };

            debug('ACTUAL:', JSON.stringify(compile.getCompileData(compileOptions), null, 4));
            debug('EXPECTED:', JSON.stringify(expected,  null, 4));
            assert.deepEqual(compile.getCompileData(compileOptions), expected);
        });
    });

    describe('getPathData', function() {
        it('should return the correct path data', function() {
            var expected = [
                'src/controls/button-base/src/mixins',
                'src/utils/utils/src/mixins',
                'src/theme/src'
            ];

            debug('ACTUAL:',compile.getPathData(compileOptions), null, 4);
            debug('EXPECTED:', expected);
            assert.deepEqual(compile.getPathData(compileOptions), expected);
        });
    });

    describe('getImportData', function() {
        it('should return the correct import data', function() {
            var expected = [
                'theme-fake-dark.styl',
                'nib',
                'button-mixin.styl'
            ];

            assert.deepEqual(compile.getImportData('src/theme/src/theme-fake-dark.styl',compileOptions), expected);
        });
    });

    describe('getFilesData', function() {
        it('should return the correct files data', function() {
            var expected = [{
                        src: [
                            'src/**/src/includes/*.styl',
                            'src/skins/**/src/*.styl'
                        ],
                        dest:'css/fake-dark.css'
                    }];

            debug('EXPECTED:', JSON.stringify(expected, null));
            debug('ACTUAL:', JSON.stringify(compile.getFilesData('src/theme/src/theme-fake-dark.styl',compileOptions), null));

            assert.deepEqual(compile.getFilesData('src/theme/src/theme-fake-dark.styl',compileOptions), expected);
        });
    });
});
