/**
 * Created by AlexCD on 07/09/2015.
 */

const path = require('path');
const join = path.join;
const fs = require('fs-extra');
const logger = require('winston-color');
const fileExists = require('file-exists');

function WebpackClean (files, context, removeMaps) {
  this.files = this.getFileList(files);
  this.context = this.getContext(context); // get webpack roots
  this.removeMaps = removeMaps;
  this.pluginName = 'WebpackClean:';
}

WebpackClean.prototype.log = function (type, msg) {
  logger[type](`${this.pluginName} ${msg}`);
};

WebpackClean.prototype.getFileList = function (files) {
  return (!Array.isArray(files)) ? new Array(files) : files;
};

WebpackClean.prototype.getContext = function (context) {
  return context || path.dirname(module.parent.filename);
};

WebpackClean.prototype.joinFilePath = function (context, file) {
  return join(context, file);
};

WebpackClean.prototype.addMapExtension = function (file) {
  return file + '.map';
};

WebpackClean.prototype.isExistingFile = function (filePath) {
  return fileExists(filePath)
    .then(exists => {
      if (exists) {
        return this.removeFile(filePath);
      } else {
        this.log('warn', 'file does not exist ' + filePath);
      }
    })
    .catch(err => {
      this.log('error', this.pluginName, err);
    });
};

WebpackClean.prototype.removeFile = function (file) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    fs.unlink(file, err => {
      if (err) {
        reject(err);
      } else {
        self.log('info', 'removed ' + file);
        resolve(self.pluginName, 'file removed:', file);
      }
    });
  });

  return promise;
};

WebpackClean.prototype.checkFiles = function (files, removeMaps) {
  let fileExistsPromises = [];
  const self = this;

  // check if each file exists
  files.forEach(file => {
    const filePath = self.joinFilePath(self.context, file);
    const fileMapPath = self.addMapExtension(filePath);

    // add to list the file to be removed
    fileExistsPromises.push(self.isExistingFile(filePath));
    // add to list the map file to be removed
    if (removeMaps) {
      fileExistsPromises.push(self.isExistingFile(fileMapPath));
    }
  });

  return fileExistsPromises;
};

WebpackClean.prototype.apply = function (compiler) {
  const self = this;

  compiler.plugin('done', stats => {
    Promise.all(self.checkFiles(self.files, self.removeMaps))
      .then(removalPromises => Promise.all(removalPromises))
      .then(() => { self.log('info', 'done'); })
      .catch((err) => {
        self.log('error', err);
        stats.compilation.errors.push(new Error(err));
      });
  });
};

module.exports = WebpackClean;
