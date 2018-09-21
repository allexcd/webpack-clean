/**
 * Created by AlexCD on 07/09/2015.
 */

const path = require('path');
const join = path.join;
const fs = require('fs-extra');
const logger = require('winston-color');
const fileExists = require('file-exists');

const pluginName = 'WebpackClean';

const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';

function log (type, msg) {
  logger[type](`${pluginName} - ${msg}`);
};

function throwErr (msg, err) {
  throw new Error(msg, err);
}

function getFileList (files) {
  if (!files) {
    return [];
  }
  return (Array.isArray(files)) ? files : new Array(files);
};

function addMapExtension (file) {
  return `${file}.map`;
};

function getContext (basePath) {
  return basePath || path.dirname(module.parent.filename);
};

function joinFilePath (context, file) {
  return join(context, file);
};

function removeFile (file) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    fs.unlink(file, err => {
      if (err) {
        reject(err);
      } else {
        log(INFO, `removed ${file}`);
        resolve(self.pluginName, 'file removed:', file);
      }
    });
  });

  return promise;
};

function isExistingFile (filePath) {
  return fileExists(filePath)
    .then(exists => {
      if (exists) {
        return removeFile(filePath);
      } else {
        log(WARN, `file ${filePath} does not exist`);
      }
    })
    .catch(err => throwErr(pluginName, err));
};

function checkFiles (files, context, removeMaps) {
  let fileExistsPromises = [];

  // check if each file exists
  files.forEach(file => {
    const filePath = joinFilePath(context, file);
    const fileMapPath = addMapExtension(filePath);

    // add to list the file to be removed
    fileExistsPromises.push(isExistingFile(filePath));
    // add to list the map file to be removed
    if (removeMaps) {
      fileExistsPromises.push(isExistingFile(fileMapPath));
    }
  });

  return fileExistsPromises;
};

function doRemove () {
  const self = this;

  Promise.all(checkFiles(self.files, self.context, self.removeMaps))
    .then(removalPromises => Promise.all(removalPromises))
    .then(() => { log(INFO, 'DONE'); })
    .catch(err => throwErr(pluginName, err));
}

// allow the options object to be omitted in the constructor function
function WebpackClean (files, {basePath = null, removeMaps = false, forceDelete = false} = {}) {
  this.files = getFileList(files);
  this.context = getContext(basePath); // get webpack roots
  this.removeMaps = removeMaps;
  this.forceDelete = forceDelete;
}

WebpackClean.prototype.apply = function (compiler) {
  const self = this;
  const hasLifecycleHooks = compiler.hasOwnProperty('hooks'); // Webpack 4.x.x
  const logErrMsg = 'Files removal aborted due to:';

  if (hasLifecycleHooks) {
    compiler.hooks.failed.tap(pluginName, err => {
      if (!self.forceDelete) {
        log(ERROR, `${logErrMsg} \n${err}`);
        return false;
      }
    });
    compiler.hooks.done.tap(pluginName, stats => {
      doRemove.call(self);
    });
  } else {
    compiler.plugin('done', stats => {
      if (!self.forceDelete && stats.compilation.errors && stats.compilation.errors.length > 0) {
        log(ERROR, `${logErrMsg} \n${stats.compilation.errors}`);
        return false;
      }
      doRemove.call(self);
    });
  }
};

module.exports = WebpackClean;
