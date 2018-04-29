## Webpack Clean

A webpack plugin to clean specified files after build

### Getting started

Install the plugin:

```
npm install webpack-clean --save-dev
yarn add webpack-clean --dev
```


### API
```javascript
new WebpackCleanPlugin(files: array|string, [ { [basePath: string], [removeMaps: boolean] } ])
```

* `files` � array of files or string for a single file relative to the `basePath` or to the `context` of your config (if the `basePath` param is not specified),
* `basePath` (optional) � directory to be resolved to
* `removeMaps` (optional) � specify if the `.map` files should be automatically removed

### Usage

```javascript
var WebpackCleanPlugin = require('webpack-clean');

module.exports = {
    context: path.join(__dirname, './'),
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new WebpackCleanPlugin([
            'dist/test1.js',
            'dist/test2.js'
        ])
    ]
};

module.exports = {
    plugins: [
        new WebpackCleanPlugin(
            'dist/fileA.js',
            {basePath: path.join(__dirname, './')}
        )
    ]
};

module.exports = {
    plugins: [
        new WebpackCleanPlugin([
            'fileA.js',
            'fileB.js'
        ], {basePath: path.join(__dirname, 'dist'))}
    ]
};

module.exports = {
    plugins: [
        new WebpackCleanPlugin([
            'fileA.js',
            'fileB.js'
        ], {basePath: path.join(__dirname, 'dist'), removeMaps: true)}
    ]
};
```
