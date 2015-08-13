var runFixture = require('./lib/util').runFixture
  , fs = require('fs');

describe('output', function () {
  afterEach(function () {
    delete process.env.XUNIT_FILE;
  });

  it('should write the report to the path specified by the XUNIT_FILE environment variable', function (done) {
    process.env.XUNIT_FILE = '_tmp/out/target.xml';
    runFixture('success', function () {
      var reportExists = fs.existsSync('_tmp/out/target.xml');
      (reportExists) ? done() : done(new Error('Report not found'));
    })
  });
});