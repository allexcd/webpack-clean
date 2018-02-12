import test from 'ava';
const WebpackClean = require('../index');

test('getFilesList should return a list of file/files', t => {
  const getFileList = WebpackClean.prototype.getFileList;
  t.deepEqual(getFileList('one.file.only'), ['one.file.only']);
  t.deepEqual(getFileList(['file1.js', 'file2.js']), ['file1.js', 'file2.js']);
  t.deepEqual(getFileList([]), []);
});

test('fileMap should return the map file name', t => {
  const fileSlice = WebpackClean.prototype.fileMap;
  t.is(fileSlice('filename'), 'filename.map');
  t.is(fileSlice('file.name.js'), 'file.name.js.map');
});
