grunt-topcoat
==================

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

```json
{
    "topcoat": {
        "controls": {
            "topcoat/button": "0.1.0",
            "topcoat/button-group": "0.1.0"
        },
        "theme": {
            "topcoat/theme": "0.1.0"
        }
    }
}
```

Parse the package.json in your Gruntfile:

```javascript
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    topcoat: {
        download:
            options: {
                srcPath: "src/",
                repos: '<%= pkg.topcoat %>'
            }
        }
    }
});
```

You should only run this task once to get started.
After the initial run you only need to run it when you want to update the included repos or their versions.
You can update the included repos by editing the entries in the topcoat section of package.json and then running this task again.

[⇧](#toc)

<a href="options"></a>
Options
=======

Options available to pass in from topcoat initconfig block.

* `hostname` defaults to 'https://github.com/'
* `srcPath` defaults to 'src/'
* `controlsPath` defaults to srcPath + 'controls/'
* `skinsPath` defaults to srcPath + 'skins/'
* `themePath` defaults to srcPath + 'theme/'
* `utilsPath` defaults to srcPath + 'utils/'
* `proxy` defaults to ''

[⇧](#toc)
