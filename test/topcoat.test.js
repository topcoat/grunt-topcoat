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
    fs    = require('fs'),
    debug = require('debug')('test');

describe('topcoat', function() {

    it('should download correct resources', function() {
        assert.equal(true, fs.existsSync('tmp/src/controls/input-base-0.1.0'));
        assert.equal(true, fs.existsSync('tmp/src/controls/button-base'));
        assert.equal(true, fs.existsSync('tmp/src/utils/utils'));
        assert.equal(true, fs.existsSync('tmp/src/theme/theme-0.4.0'));
        assert.equal(true, fs.existsSync('tmp/src/skins/button'));
    });

    it('should create the correct output css files', function() {
        assert.equal(true, fs.existsSync('tmp/css/topcoat-desktop-light.css'));
        assert.equal(true, fs.existsSync('tmp/css/topcoat-desktop-dark.css'));
        assert.equal(true, fs.existsSync('tmp/css/topcoat-mobile-light.css'));
        assert.equal(true, fs.existsSync('tmp/css/topcoat-mobile-dark.css'));
    });
});

