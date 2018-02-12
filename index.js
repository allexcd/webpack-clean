/**
 * Created by AlexCD on 07/09/2015.
 */

const fs = require('fs-extra');
const path = require('path');
const vow = require('vow');
const fileExists = require('file-exists');
const join = path.join;

function WebpackClean (files, context) {
  this.files = this.getFileList(files);
  this.context = this.getContext(context); // get webpack root
}

WebpackClean.prototype.getFileList = function (files) {
  return (!Array.isArray(files)) ? [files] : files;
};

WebpackClean.prototype.getContext = function (context) {
  return context || path.dirname(module.parent.filename);
};

WebpackClean.prototype.filePath = function (file) {
  return join(this.context, file);
};

WebpackClean.prototype.fileMap = function (file) {
  return file + '.map';
};

WebpackClean.prototype.cleanFile = function (file) {
  const _defer = vow.defer();
  const _removeFile = [
    fs.remove(file, function (err) {
      if (err) {
        _defer.reject('WebpackClean: ' + err);
      }
      console.log('File removed: ' + file);
    })
  ];

  _defer.resolve(vow.all(_removeFile));

  return _defer.promise();
};

WebpackClean.prototype.apply = function (compiler) {
  const _self = this;

  compiler.plugin('done', function (compilation) {
    let _promises = [];

    _self.files.forEach(function (file) {
      const _filePath = _self.filePath(file);
      const _fileMap = _self.fileMap(_filePath);

      // add to list the file to be removed
      if (fileExists(_filePath)) {
        _promises.push(_self.cleanFile(_filePath));
      }
      // add to list the map file to be removed
      if (fileExists(_fileMap)) {
        _promises.push(_self.cleanFile(_fileMap));
      }
    });

    vow.all(_promises).then(function () {
      console.log('webpack-clean done')
    }).fail(function (text) {
      compilation.errors.push(new Error(text));
    });
  });
};

module.exports = WebpackClean;
