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

/*global describe, it, before*/

'use strict';

var grunt = require('grunt'),
    assert = require('assert'),
    read = require('fs').readFileSync,
    mkdirp = require('mkdirp');

describe('topcoat', function() {

    before(function() {
        mkdirp.sync('tmp');
    });

    it('should create the expected mobile dark button file', function() {
        var actual = read('tmp/mobile-dark-button.out.css').toString().trim(),
            expected = read('test/expected/mobile-dark-button.expected.css').toString().trim();
        assert.equal(actual, expected, 'Mobile dark button file should match expected result');
    });

    it('should create the expected mobile light button file', function() {
        var actual = read('tmp/mobile-light-button.out.css').toString().trim(),
            expected = read('test/expected/mobile-light-button.expected.css').toString().trim();
        assert.equal(actual, expected, 'Mobile light button file should match expected result');
    });
});
