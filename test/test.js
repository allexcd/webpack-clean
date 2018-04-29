import test from 'ava';

const rewire = require('rewire');
const WebpackClean = rewire('../index');

let getFileList, addMapExtension, getContext, joinFilePath;

test.beforeEach(() => {
  getFileList = WebpackClean.__get__('getFileList');
  addMapExtension = WebpackClean.__get__('addMapExtension');
  getContext = WebpackClean.__get__('getContext');
  joinFilePath = WebpackClean.__get__('joinFilePath');
});

test('WebpackClean constructor should receive optional params', t => {
  const files = ['files.js'];
  const basePath = 'dist';
  const removeMaps = true;

  const plugin = new WebpackClean(files, {basePath: basePath, removeMaps: removeMaps});
  t.is(plugin.context, basePath);
  t.truthy(plugin.removeMaps);
});

test('WebpackClean constructor should use default options if options object is omitted', t => {
  const files = ['files.js'];
  const plugin = new WebpackClean(files);
  t.is(plugin.context, __dirname);
  t.falsy(plugin.removeMaps);
});

test('WebpackClean constructor should use the default options if options object is empty, ', t => {
  const files = ['files.js'];
  const plugin = new WebpackClean(files, {});
  t.is(plugin.context, __dirname);
  t.falsy(plugin.removeMaps);
});

test('getFilesList should return a one item list, if one single file is received', t => {
  t.deepEqual(getFileList('one.file.only'), ['one.file.only']);
});

test('getFilesList should return the list of files provided', t => {
  t.deepEqual(getFileList(['file1.js', 'file2.js']), ['file1.js', 'file2.js']);
});

test('getFilesList should return an empty list', t => {
  t.deepEqual(getFileList([]), []);
});

test('getFilesList should return an empty list if no files provided', t => {
  t.deepEqual(getFileList(), []);
});

test('addMapExtension should return the map file name', t => {
  t.is(addMapExtension('filename'), 'filename.map');
  t.is(addMapExtension('file.name.js'), 'file.name.js.map');
});

test('getContext should return the context provided', t => {
  t.is(getContext('some/base/path'), 'some/base/path');
});

test('getContext should return the basePath if no context is provided', t => {
  t.is(getContext(), __dirname);
});

test('joinFilePath should return the joined path', t => {
  t.is(joinFilePath('dist', 'file.js'), 'dist/file.js');
});
