import test from 'ava';

const WebpackClean = require('../index');

test('WebpackClean constructor optional params', t => {
  const plugin = new WebpackClean('file.js', 'dist', true);
  t.truthy(plugin.removeMaps);
  t.is(plugin.pluginName, 'WebpackClean:');
});

test('getFilesList should return a list of file/files', t => {
  const getFileList = WebpackClean.prototype.getFileList;
  t.deepEqual(getFileList('one.file.only'), ['one.file.only']);
  t.deepEqual(getFileList(['file1.js', 'file2.js']), ['file1.js', 'file2.js']);
  t.deepEqual(getFileList([]), []);
});

test('addMapExtension should return the map file name', t => {
  const addMapExtension = WebpackClean.prototype.addMapExtension;
  t.is(addMapExtension('filename'), 'filename.map');
  t.is(addMapExtension('file.name.js'), 'file.name.js.map');
});

test('getContext should return the proper context', t => {
  const getContext = WebpackClean.prototype.getContext;
  t.is(getContext('some/base/path'), 'some/base/path');
  t.is(getContext(), __dirname);
});

test('joinFilePath should return the proper file path', t => {
  const plugin = new WebpackClean('file.js', 'dist');
  const joinFilePath = plugin.joinFilePath;
  t.is(joinFilePath('dist', 'file.js'), 'dist/file.js');
});
