/*
 * grunt-clone
 * https://github.com/krjoseph/grunt-clone
 *
 * Copyright (c) 2013 @dam
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>', ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
            zip: ['tmp/src/*.zip', 'tmp/src/controls/*.zip', 'tmp/src/utils/*.zip', 'tmp/src/skins/*.zip']
        },

        // Configuration to be run (and then tested).
        topcoat: {
            download: {
                options: {
                    srcPath: 'tmp/src/',
                    repos: '<%= pkg.topcoat %>'
                }
            }
        },

        unzip: {
            controls: {
                src: "tmp/src/controls/*.zip",
                dest: "tmp/src/controls"
            },
            theme: {
                src: "tmp/src/*.zip",
                dest: "tmp/src/"
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
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-zip');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'topcoat', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
