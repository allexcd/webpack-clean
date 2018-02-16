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
  this.context = this.getContext(context); // get webpack roots
  this.promises = [];
  this.pluginName = 'WebpackClean'
}

WebpackClean.prototype.getFileList = function (files) {
  return (!Array.isArray(files)) ? new Array(files) : files;
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

WebpackClean.prototype.addToRemovalList = function (filePath) {
  fileExists(filePath, (err, exists) => {
    if (err) {
      console.error(this.pluginName, err)
    }
    if (exists) {
      this.promises.push(this.cleanFile(filePath));
    }
  })
};

WebpackClean.prototype.cleanFile = function (file) {
  const _self = this;
  const _defer = vow.defer();
  const _removeFile = [
    fs.remove(file, function (err) {
      if (err) {
        _defer.reject(_self.pluginName + ' ' + err);
      }
      console.log(_self.pluginName, 'file removed:', file);
    })
  ];

  _defer.resolve(vow.all(_removeFile));

  return _defer.promise();
};

WebpackClean.prototype.apply = function (compiler) {
  const _self = this;

  compiler.plugin('done', function (compilation) {
    _self.files.forEach(function (file) {
      const _filePath = _self.filePath(file);
      const _fileMap = _self.fileMap(_filePath);

      // add to list the file to be removed
      _self.addToRemovalList(_filePath);
      // add to list the map file to be removed
      _self.addToRemovalList(_fileMap);
    });

    vow.all(_self.promises)
      .then(function () {
        console.log(_self.pluginName, 'done');
      })
      .catch(function (text) {
        compilation.errors.push(new Error(text));
      });
  });
};

module.exports = WebpackClean;
