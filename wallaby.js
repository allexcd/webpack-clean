module.exports = function () {
  return {
    files: [
      {pattern: '**/*.js', load: true},
      {pattern: 'test/**/*.js', ignore: true},
      {pattern: 'node_modules/**/*', ignore: true}
    ],
    tests: [
      'test/**/*test.js'
    ],
    env: {
      type: 'node'
    },
    testFramework: 'ava',
    debug: true
  };
};
