[![GitHub stars](https://img.shields.io/github/stars/allexcd/webpack-clean.svg?style=flat-square)](https://github.com/allexcd/webpack-clean/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/allexcd/webpack-clean.svg?style=flat-square)](https://github.com/allexcd/webpack-clean/network)
[![GitHub issues](https://img.shields.io/github/issues/allexcd/webpack-clean.svg?style=flat-square)](https://github.com/allexcd/webpack-clean/issues)
[![GitHub issues closed](https://img.shields.io/github/issues-closed/allexcd/webpack-clean.svg?style=flat-square)](https://github.com/allexcd/webpack-clean/issues?q=is%3Aissue+is%3Aclosed)

[![Github release date](https://img.shields.io/github/release-date/allexcd/webpack-clean.svg?style=flat-square)](https://github.com/allexcd/webpack-clean/releases)
[![Github release version](https://img.shields.io/github/release/allexcd/webpack-clean.svg?style=flat-square)](https://github.com/allexcd/webpack-clean/releases)
[![npm release version](https://img.shields.io/npm/v/webpack-clean.svg?style=flat-square)](https://nodei.co/npm/webpack-clean)
[![Github commits since last release](https://img.shields.io/github/commits-since/allexcd/webpack-clean/latest.svg?style=flat-square)](https://www.npmjs.com/package/webpack-clean)

[![npm](https://nodei.co/npm/webpack-clean.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/webpack-clean)

[![npm monthly downloads](https://img.shields.io/npm/dm/webpack-clean.svg?style=flat-square)](https://www.npmjs.com/package/webpack-clean)
[![npm yearly downloads](https://img.shields.io/npm/dy/webpack-clean.svg?style=flat-square)](https://www.npmjs.com/package/webpack-clean)

[![license](https://img.shields.io/github/license/allexcd/webpack-clean.svg?style=flat-square)](https://github.com/allexcd/webpack-clean/blob/master/LICENSE)

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

* `files` - array of files or string for a single file relative to the `basePath` or to the `context` of your config (if the `basePath` param is not specified),
* `basePath` (optional) - string - directory to be resolved to
* `removeMaps` (optional) - boolean - specify if the `.map` files should be automatically removed. Disabled by default.
* `forceDelete` (optional) - boolean - specify if the files should be force deleted in case of compile errors. If `forceDelete` is not enabled, the compile errors will be logged to `stdout` but the deletion of the files will not take place. Disabled by default.

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

module.exports = {
    plugins: [
        new WebpackCleanPlugin([
            'fileA.js',
            'fileB.js'
        ], {basePath: path.join(__dirname, 'dist'), removeMaps: true, forceDelete: true)}
    ]
};
```
