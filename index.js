/**
 * Created by AlexCD on 07/09/2015.
 */

var fs = require('fs-extra');
var path = require('path');
var vow = require('vow');
var fileExists = require('file-exists');
var join = path.join;

function WebpackClean (files, context) {
  if (!Array.isArray(files)) files = [files];
  //
  this.files = files;
  // get webpack root
  this.context = context || path.dirname(module.parent.filename);
}

WebpackClean.prototype.filePath = function (file) {
  return join(this.context, file);
};

WebpackClean.prototype.fileSlice = function (file) {
  // remove extension
  return file.slice(0, -3);
};

WebpackClean.prototype.fileMap = function (file) {
  var _self = this;
  return _self.fileSlice(file) + '.js.map';
};

WebpackClean.prototype.cleanFile = function (file) {
  var _defer = vow.defer();
  var _removeFile = [
    fs.remove(file, function (err) {
      if (err) _defer.reject('WebpackClean: ' + err);
      console.log('File removed: ' + file);
    })
  ];

  _defer.resolve(vow.all(_removeFile));

  return _defer.promise();
};

WebpackClean.prototype.apply = function (compiler) {
  var _self = this;

  compiler.plugin('done', function (compilation) {
    var _promises = [];

    _self.files.forEach(function (file) {
      var _filePath = _self.filePath(file);
      var _fileMap = _self.fileMap(_filePath);

      // remove file
      _promises.push(_self.cleanFile(_filePath));

      // automatically remove map files
      if (fileExists(_fileMap)) _promises.push(_self.cleanFile(_fileMap));
    });

    vow.all(_promises).then(function () {
      // done
    }).fail(function (text) {
      compilation.errors.push(new Error(text));
    });
  });
};

module.exports = WebpackClean;
