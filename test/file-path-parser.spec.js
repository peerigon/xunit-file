var parserFactory = require('../lib/file-path-parser.js');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('file-path-parser', function() {
  var testTime;
  var parser;
  var mockProcess;
  var mockDate;
  var mockFormatter;

  beforeEach(function() {
    testTime = 1459546726107;
    mockProcess = {};
    mockProcess.pid = 'mockpid123';
    mockProcess.cwd = function() { return '/my/mock/cwd'; };

    mockDate = {};
    mockDate.now = function() { return testTime; };

    mockFormatter = sinon.stub();
    mockFormatter.returnsArg(1);
    mockFormatter.withArgs(testTime, 'isoDateTime').returns('defaultTS');

    parser = parserFactory(mockProcess, mockDate, mockFormatter);
  });

  it('should add in the current working directory', function() {
    var input = '${cwd}/xunit.xml';
    var output = parser(input);
    expect(output).to.equal('/my/mock/cwd/xunit.xml');
  });

  it('should be able to add in the process id', function() {
    var input = '~/myProject/xunit-${pid}.xml';
    var output = parser(input);
    expect(output).to.equal('~/myProject/xunit-mockpid123.xml');
  });

  it('should be able to add in multiple process ids', function() {
    var input = '~/myProject/xunit/${pid}/report-${pid}.xml';
    var output = parser(input);
    expect(output).to.equal('~/myProject/xunit/mockpid123/report-mockpid123.xml');
  });

  it('should be able to add a default timestamp with shorthand', function() {
    var input = '~/myProject/xunit-${ts}.xml';
    var output = parser(input);
    expect(output).to.equal('~/myProject/xunit-defaultTS.xml');
  });

  it('should be able to add a default timestamp with longform', function() {
    var input = '~/myProject/xunit-${timestamp}.xml';
    var output = parser(input);
    expect(output).to.equal('~/myProject/xunit-defaultTS.xml');
  });

  it('should be able to add in multiple default timestamps', function() {
    var input = '~/myProject/xunit/${ts}/report-${timestamp}.xml';
    var output = parser(input);
    expect(output).to.equal('~/myProject/xunit/defaultTS/report-defaultTS.xml');
  });

  it('should be able to add in custom timestamps using double quotes and short form', function() {
    var input = '~/myProject/xunit-${ts: "M"}.xml';
    var output = parser(input);
    expect(output).to.equal('~/myProject/xunit-M.xml');
    expect(mockFormatter.calledWith(testTime, 'M')).to.be.true;
  });

  it('should be able to add in custom timestamps using single quotes and long form', function() {
    var input = '~/myProject/xunit-${timestamp: \'yyss\'}.xml';
    var output = parser(input);
    expect(output).to.equal('~/myProject/xunit-yyss.xml');
    expect(mockFormatter.calledWith(testTime, 'yyss')).to.be.true;
  });

  it('should be able to add in multiple custom timestamps', function() {
    var input = '~/myProject/xunit/${ts: \'yyyy\'}/report-${timestamp:"ddmmss"}.xml';
    var output = parser(input);
    expect(output).to.equal('~/myProject/xunit/yyyy/report-ddmmss.xml');
    expect(mockFormatter.calledWith(testTime, 'yyyy')).to.be.true;
    expect(mockFormatter.calledWith(testTime, 'ddmmss')).to.be.true;
  });

  it('should put it all together', function() {
    var input = '${cwd}/${pid}/p-${pid}/time-${ts}/xunit-${timestamp:    "mmdd"   }.xml';
    var output = parser(input);
    expect(output).to.equal('/my/mock/cwd/mockpid123/p-mockpid123/time-defaultTS/xunit-mmdd.xml');
    expect(mockFormatter.calledWith(testTime, 'mmdd')).to.be.true;
  });
});
