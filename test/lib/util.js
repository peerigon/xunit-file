var spawn = require('child_process').spawn
  , mochaBin = require.resolve('mocha/bin/_mocha')

exports.runFixture = function(name, cb) {
  var suitePath = 'test/fixture/' + name
    , result = { code: 0, stdout: '', stderr: '' }
    , mocha;

  mocha = spawn(mochaBin, [ '--reporter', '../../../index.js', suitePath ]);

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