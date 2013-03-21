grunt-topcoat
==================

Install
-------

`npm install grunt-topcoat --save-dev`

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


