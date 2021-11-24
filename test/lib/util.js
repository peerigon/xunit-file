var path = require('path');
var spawn = require('child_process').spawn;
var mochaBin = require.resolve('mocha/bin/_mocha');

exports.runFixture = function(name, cb) {
  var suitePath = 'test/fixture/' + name
    , result = { code: 0, stdout: '', stderr: '' }
    , mocha;

  mocha = spawn(mochaBin, [ '--reporter', path.resolve(__dirname, '../../index.js'), suitePath ]);

  mocha.stdout.on('data', function (data) {
    result.stdout += data.toString();
  });

  mocha.stderr.on('data', function (data) {
    result.stderr += data.toString();
  });

  mocha.on('close', function (code) {
    result.code = code;
    cb(result);
  });
};