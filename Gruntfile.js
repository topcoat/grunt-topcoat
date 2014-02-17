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

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: [
                    'Gruntfile.js',
                    'tasks/*.js',
                    '<%= simplemocha.all %>'
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp/*']
        },

        // Configuration to be run (and then tested).
        topcoat: {
            options: {
                // This is where you would specify target browsers for build.
                browsers: ['last 2 versions'],
                namespace: 'topcoat',
                license: 'test/fixtures/license.txt',
                vars: true,
                extend: true
            },
            debug: {
                options: {
                    debug: true
                },
                files: [{
                        src: 'test/fixtures/mobile-dark-button.css',
                        dest: 'tmp/mobile-dark-button-debug.out.css'
                    }
                ]
            },
            compile: {
                files: [{
                        src: 'test/fixtures/mobile-dark-button.css',
                        dest: 'tmp/mobile-dark-button.out.css'
                    }
                ]
            }
        },

        // Unit tests.
        simplemocha: {
            all: ['test/*.test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'topcoat', 'simplemocha']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
