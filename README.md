grunt-topcoat
==================

[![Build Status](https://travis-ci.org/topcoat/grunt-topcoat.png?branch=master)](https://travis-ci.org/topcoat/grunt-topcoat)

[![NPM](https://nodei.co/npm/grunt-topcoat.png)](https://nodei.co/npm/grunt-topcoat/)

<a href="toc"></a>
TOC
=====================

1. [Install](#install)
1. [Usage](#usage)
1. [Options](#options)

<a href="install"></a>
Install
-------

`npm install grunt-topcoat --save-dev`

[⇧](#toc)

<a href="usage"></a>
Usage
-----

Load the npm task in your Gruntfile:

`grunt.loadNpmTasks('grunt-topcoat');`

Add a TopCoat section to your package.json:

```
topcoat: {
    options: {
        // This is where you would specify target browsers for build.
        browsers: ['last 2 versions'],
        namespace: 'topcoat',
        license: 'test/fixtures/license.txt',
        vars: true,
        extend: true
    },
    compile: {
        files: [{
                src: ['test/fixtures/mobile-dark-button.css'],
                dest: 'tmp/mobile-dark-button.out.css'
            }
        ]
    },
    debug: {
        options: {
            debug: true
        },
        files: [{
                src: ['test/fixtures/mobile-dark-button.css'],
                dest: 'tmp/mobile-dark-button.out.css'
            }
        ]
    },
    compile_all: {
        files: [{
                expand: true,
                cwd: 'test/fixtures',
                src: ['*.css'],
                dest: 'tmp/',
                ext: '.out.css'
            }
        ]
    }
}
```

[⇧](#toc)

<a href="options"></a>
Options
=======

* `browsers`:
    * Your target browsers
    * defaults to the last two releases
* `namspace`:
    * The namespace to prefix your class selectors with. This can be used to avoid class name collisions
    * defaults to 'topcoat'
* `license`:
    * The license file you want to add to the final output

[⇧](#toc)

