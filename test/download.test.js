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
    download = require('../tasks/lib/download').init(grunt);


describe('download', function() {

    describe('getDirectoryName', function() {
        it('should return correct directory name', function() {
            var repo = 'topcoat/button',
                expected = 'button',
                actual = download.getDirectoryName(repo);
            assert.equal(actual, expected);
        });
    });

    describe('getDownloadURL', function() {
        it('should return correct URL when tag is supplied', function() {
            var hostname = 'https://github.com/',
                repo = 'topcoat/button',
                tag = '0.1.0',
                expected = 'https://github.com/topcoat/button/archive/0.1.0.zip',
                actual = download.getDownloadURL(hostname, repo, tag);

            assert.equal(actual, expected);
        });

        it('should return correct URL when no tag is supplied', function() {
            var hostname = 'https://github.com/',
                repo = 'topcoat/button',
                tag = '',
                expected = 'https://github.com/topcoat/button.git',
                actual = download.getDownloadURL(hostname, repo, tag);

            assert.equal(actual, expected);
        });
    });

    describe('getTagArchiveURL', function() {
        it('should return correct URL', function() {
            var hostname = 'https://github.com/',
                repo = 'topcoat/button',
                tag = '0.1.0',
                expected = 'https://github.com/topcoat/button/archive/0.1.0.zip',
                actual = download.getTagArchiveURL(hostname, repo, tag);

            assert.equal(actual, expected);
        });
    });

    describe('getNightlyArchiveURL', function() {
        it('should return correct URL', function() {
            var hostname = 'https://github.com/',
                repo = 'topcoat/button',
                tag = '',
                expected = 'https://github.com/topcoat/button.git',
                actual = download.getDownloadURL(hostname, repo, tag);

            assert.equal(actual, expected);
        });
    });

});
