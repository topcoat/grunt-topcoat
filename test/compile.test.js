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

compileOptions.themeFiles = ['src/theme/src/theme-fake-dark.style'];
compileOptions.controlsFilesPath = ['src/controls/button-base/src/mixins'];
compileOptions.utilsFilesPath = ['src/utils/utils/src/mixins'];
compileOptions.themeFilesPath = ['src/theme/src'];
compileOptions.mixinFiles = ['src/controls/button-base/src/mixins/button-mixin.styl'];
compileOptions.utilFiles = ['src/utils/utils/src/mixins/utils.styl'];
compileOptions.releasePath = 'css/';
compileOptions.skinsPath = 'src/skins/';
compileOptions.srcPath = 'src/';
compileOptions.themePrefix = 'theme-';

describe('compile', function() {

    describe('getCompileData', function() {
        it('should return the correct compile data', function() {
            var expected = {};

            debug('OPTIONS:', compileOptions);
            assert.equals(compile.getCompileData(compileOptions), expected);
        });
    });

});
