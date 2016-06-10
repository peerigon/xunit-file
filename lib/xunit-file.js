/**
 * Module dependencies.
 */

var mocha = require("mocha")
  , Base = mocha.reporters.Base
  , utils = mocha.utils
  , escape = utils.escape
  , config = require("../config.json")
  , fs = require("fs")
  , path = require("path")
  , mkdirp = require("mkdirp")
  , dateFormat = require('dateformat')
  , filePathParser = require('./file-path-parser')(process, global.Date, dateFormat)
  , filePath = filePathParser(process.env.XUNIT_FILE || config.file || "${cwd}/xunit.xml")
  , consoleOutput = process.env.XUNIT_SILENT ? {} : config.consoleOutput || {};

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
    , fd;

  mkdirp.sync(path.dirname(filePath));
  fd = fs.openSync(filePath, 'w', 0755);

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
    var timestampStr = (new Date).toISOString().split('.', 1)[0];
    appendLine(fd, tag('testsuite', {
        name: process.env.SUITE_NAME || 'Mocha Tests'
      , tests: stats.tests
      , failures: stats.failures
      , errors: stats.failures
      , skipped: stats.tests - stats.failures - stats.passes
      , timestamp: timestampStr
      , time: stats.duration / 1000
    }, false));

    if( process.env.XUNIT_LOG_ENV) {
      logProperties(fd);
    }
  
    tests.forEach(function(test){
      writeTest(fd, test);
    });

    appendLine(fd, '</testsuite>');
    fs.closeSync(fd);
  });
}

/**
 * Inherit from `Base.prototype`.
 */

XUnitFile.prototype.__proto__ = Base.prototype;

/**
 * Writes a list of process and environment variables to the <properties> section in the XML. 
 */
function logProperties(fd) {
  var attrs = new Object();
  var properties = "\n";

  properties += logProperty('process.arch', process.arch);
  properties += logProperty('process.platform', process.platform);
  properties += logProperty('process.memoryUsage', objectToString(process.memoryUsage()));
  properties += logProperty('process.cwd', process.cwd());
  properties += logProperty('process.execPath', process.execPath)
  properties += logProperty('process.execArgv', process.execArgv.join( ' '));
  properties += logProperty('process.argv', process.argv.join( ' '));
  properties += logProperty('process.version', process.version.replace('"',''));
  properties += logProperty('process.versions', objectToString(process.versions));
  properties += logProperty('process.env.PATH', process.env.PATH);
  properties += logProperty('process.env.NODE_PATH', process.env.NODE_PATH);
  properties += logProperty('process.env.SUITE_NAME', process.env.SUITE_NAME);
  properties += logProperty('process.env.XUNIT_FILE', process.env.XUNIT_FILE);
  properties += logProperty('process.env.LOG_XUNIT', process.env.LOG_XUNIT);

  appendLine(fd, tag('properties', {}, false, properties));
}

/**
 * Formats a single property value. 
 */

function logProperty( name, value) {
  return '  ' + tag('property', { name: name, value: value }, true) + '\n';
}

/**
 * Simple utility to convert a flat Object to a readable string. 
 */

function objectToString( obj) {
  var arrayString = '';

  if( obj) {
    for (var prop in obj) {
      var propValue = '' + obj[prop];
      if( arrayString.length > 0) {
    	  arrayString += ', ';
      }
      arrayString += prop + ": '" + propValue.replace( "'", "\\'") + "'";
    }
  }
  return '[ ' + arrayString + ']';
}


/**
 * Output tag for the given `test.`
 */

function writeTest(fd, test) {
  var attrs = {
      classname: test.parent.fullTitle()
    , name: test.title
    // , time: test.duration / 1000 //old
    ,time: test.duration ? test.duration / 1000 : 0 //new
  };

  if ('failed' == test.state) {
    var err = test.err;
    appendLine(fd, tag('testcase', attrs, false, tag('failure', { message: escape(err.message) }, false, cdata(err.stack))));
  } else if (test.pending) {
    delete attrs.time;
    appendLine(fd, tag('testcase', attrs, false, tag('skipped', {}, true)));
  } else {
    appendLine(fd, tag('testcase', attrs, true) );
  }
}

/**
 * HTML tag helper.
 */

function tag(name, attrs, close, content) {
  var end = close ? '/>' : '>'
    , pairs = []
    , result;

  for (var key in attrs) {
    pairs.push(key + '="' + escape(attrs[key]) + '"');
  }

  result = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
  if (content) result += content + '</' + name + end;
  return result;
}

/**
 * Return cdata escaped CDATA `str`.
 */

function cdata(str) {
  return '<![CDATA[' + escape(str) + ']]>';
}

function appendLine(fd, line) {
    if (process.env.LOG_XUNIT) {
        console.log(line);
    }
    fs.writeSync(fd, line + "\n", null, 'utf8');
}
