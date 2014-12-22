/**
 * Module dependencies.
 */

var mocha = require("mocha")
  , Base = mocha.reporters.Base
  , utils = mocha.utils
  , escape = utils.escape
  , config = require("../config.json")
  , fs = require("fs")
  , filePath = process.env.XUNIT_FILE || config.file || process.cwd() + "/xunit.xml"
  , fd = fs.openSync(filePath, 'w', 0755)
  , consoleOutput = config.consoleOutput || {};

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Expose `XUnitFile`.
 */

exports = module.exports = XUnitFile;

/**
 * Initialize a new `XUnitFile` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function XUnitFile(runner) {
  Base.call(this, runner);
  var stats = this.stats
    , tests = []
    , self = this;

  runner.on('suite', function(suite){
    if(consoleOutput.suite){
      console.log('  ' + suite.title);
    }
  });

  runner.on('test', function(test){
    if(consoleOutput.test){
      console.log('  ◦ ' + test.title);
    }
  });

  runner.on('pass', function(test){
    tests.push(test);
  });

  runner.on('fail', function(test){
    if(consoleOutput.fail){
      console.log('  - ' + test.title);
    }
    tests.push(test);
  });

  runner.on('pending', function(test) {
      tests.push(test);
  });

  runner.on('end', function(){
    
    appendLine(tag('testsuite', {
        name: process.env.SUITE_NAME || 'Mocha Tests'
      , tests: stats.tests
      , failures: stats.failures
      , errors: stats.failures
      , skipped: stats.tests - stats.failures - stats.passes
      , timestamp: (new Date).toUTCString()
      , time: stats.duration / 1000
    }, false));

    tests.forEach(test);
    appendLine('</testsuite>');
    fs.closeSync(fd);
  });
}

/**
 * Inherit from `Base.prototype`.
 */

XUnitFile.prototype.__proto__ = Base.prototype;

/**
 * Output tag for the given `test.`
 */

function test(test) {
  var attrs = {
      classname: test.parent.fullTitle()
    , name: test.title
    // , time: test.duration / 1000 //old
    ,time: test.duration ? test.duration / 1000 : 0 //new
  };

  if ('failed' == test.state) {
    var err = test.err;
    appendLine(tag('testcase', attrs, false, tag('failure', { message: escape(err.message) }, false, cdata(err.stack))));
  } else if (test.pending) {
    delete attrs.time;
    appendLine(tag('testcase', attrs, false, tag('skipped', {}, true)));
  } else {
    appendLine(tag('testcase', attrs, true) );
  }
}

/**
 * HTML tag helper.
 */

function tag(name, attrs, close, content) {
  var end = close ? '/>' : '>'
    , pairs = []
    , tag;

  for (var key in attrs) {
    pairs.push(key + '="' + escape(attrs[key]) + '"');
  }

  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
  if (content) tag += content + '</' + name + end;
  return tag;
}

/**
 * Return cdata escaped CDATA `str`.
 */

function cdata(str) {
  return '<![CDATA[' + escape(str) + ']]>';
}

function appendLine(line) {
    if (process.env.LOG_XUNIT) {
        console.log(line);
    }
    fs.writeSync(fd, line + "\n", null, 'utf8');
}
