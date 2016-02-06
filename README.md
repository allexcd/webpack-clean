## Webpack Clean

A webpack plugin to clean specified files after build

### Getting started

Install the plugin:

```
npm install webpack-clean --save-dev
```


### API
```javascript
new WebpackCleanPlugin(files: array, [basePath: string])
```

* `files` – array of files relative to `basePath` or to `context` of your config (if `basePath` param is not specified),
* `basePath` (this is optional) – directory to be resolved to

### Usage

```javascript
var WebpackCleanPlugin = require('webpack-clean');

module.exports = {
    context: path.join(__dirname, 'app'),
    plugins: [
        new WebpackCleanPlugin([
            'dist/fileA.js',
            'dist/fileB.js'
        ])
    ]
};

module.exports = {
    plugins: [
        // Cleanup before build. Useful for clearing old hashed files.
        new WebpackCleanPlugin([
            'dist/fileC.*.js',
        ], path.join(__dirname, 'app'), true),

        // Cleanup after build
        new WebpackCleanPlugin([
            'dist/fileA.js',
            'dist/fileB.js'
        ], path.join(__dirname, 'app'))
    ]
};
```
