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

    Pattern for including components is the unique github username/repo
    and a tag number.
    Leaving an empty string for the tag number will download the current
    head of master. i.e. nightly

```json
"topcoat": {
"controls": {
    "topcoat/button-base": "",
    "topcoat/input-base": "0.1.0"
},
"skins": {
    "topcoat/button": ""
},
"utils": {
    "topcoat/utils": ""
},
"theme": {
    "topcoat/theme": "0.4.0"
}
},
```

Parse the package.json in your Gruntfile:

```javascript
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    topcoat: {
        options: {
            repos: '<%= pkg.topcoat %>',
            src: 'src',
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
                releasePath: 'css'
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

* `hostname`:
    * The hostname where your git repos are hosted. You could host your own
      repos if you like with this property.
    * defaults to 'https://github.com/'
* `srcPath`:
    * The source directory to load the dependencies into
    * defaults to 'src/'
* `controlsPath`:
    * The directory to load the base controls into
    * defaults to srcPath + 'controls/'
* `skinsPath`:
    * The directory to load skins into
    * defaults to srcPath + 'skins/'
* `themePath`:
    * The directory to load the theme into
    * defaults to srcPath + 'theme/'
* `utilsPath`:
    * The directory to download utilities into
    * defaults to srcPath + 'utils/'
* `proxy`
    * The proxy ( if any ) needed to make requests via. Useful when dark
      overlords lock you inside walls of fire.
    * defaults to ''
* `releasePath`:
    * The directory to compile the final css to.
    * defaults to 'css'
* `themePrefix`:
    * The file name prefix of the theme files to compile. Looks like
  theme-topcoat-mobile-light.styl.
    * defaults to 'theme'

[⇧](#toc)

