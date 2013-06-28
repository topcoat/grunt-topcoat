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
            tests: ['tmp'],
            zip: [
                'tmp/src/*.zip',
                'tmp/src/controls/*.zip',
                'tmp/src/utils/*.zip',
                'tmp/src/skins/*.zip'
                ]
        },

        // Configuration to be run (and then tested).
        topcoat: {
            options: {
                repos: '<%= pkg.topcoat %>',
                src: 'tmp/src',
                controlsPath: '<%= topcoat.options.src %>/controls',
                skinsPath: '<%= topcoat.options.src %>/skins',
                themePath: '<%= topcoat.options.src %>/theme',
                utilsPath: '<%= topcoat.options.src %>/utils',
            },
            download: {
                options: {
                    hostname: 'https://github.com/',
                    proxy: '',
                    download: true,
                    compile: false
                }
            },
            compile: {
                options: {
                    themePrefix: 'theme',
                    download: false,
                    compile: true,
                    releasePath: 'tmp/css'
                }
            }
        },

        download: {},

        compile: {},

        unzip: {
            controls: {
                src: "tmp/src/controls/*.zip",
                dest: "tmp/src/controls"
            },
            theme: {
                src: "tmp/src/theme/*.zip",
                dest: "tmp/src/theme"
            },
            utils: {
                src: "tmp/src/utils/*.zip",
                dest: "tmp/src/utils"
            },
            skins: {
                src: "tmp/src/skins/*.zip",
                dest: "tmp/src/skins"
            }
        },

        // Unit tests.
        simplemocha: {
            options: {
                ui: 'bdd',
                reporter: 'Nyan'
            },
            all: ['test/*.test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-zip');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'topcoat', 'simplemocha']);
    //grunt.registerTask('download', ['clean', 'topcoat:download', 'simplemocha']);
    //grunt.registerTask('compile', ['clean', 'topcoat:compile', 'simplemocha']);
    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
