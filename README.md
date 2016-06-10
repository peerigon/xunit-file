xunit-file
==========

Basically the same reporter as mocha's xunit reporter, but writes the output to a file.

![](https://img.shields.io/npm/v/xunit-file.svg)
![](https://img.shields.io/npm/dm/xunit-file.svg)

# Usage

```
npm install xunit-file --save-dev
```

Run mocha with `-R xunit-file` or `--reporter xunit-file`

The xunit.xml output is saved in `process.cwd()/xunit.xml` by default.

### Options

To change the output and activate terminal output, you can create a `config.json`, or use environment variables.

**config.json**
```
{
    "file" : "${cwd}/xunit.xml",
    "consoleOutput" : {
      "suite" : true,
      "test" : true,
      "fail" : false
    }
}
```

**environment variables**
```
$ XUNIT_FILE=output/xunit.xml mocha -R xunit-file // writes result to output/xunit.xml
$ LOG_XUNIT=true mocha -R xunit-file // activates terminal output
$ XUNIT_SILENT=true mocha -R xunit-file // disable all terminal output
```

Set XUNIT_LOG_ENV environment variable, if you want the output process and environment variables in the properties section of the xml file.

```
$ XUNIT_LOG_ENV=true mocha -R xunit-file
```

Add the following to the xml report.

```xml
<properties>
  <property name="process.arch" value="x64"/>
  <property name="process.platform" value="win32"/>
  <property name="process.memoryUsage" value="[ rss: '26570752', heapTotal: '17734144', heapUsed: '8982088']"/>
  <property name="process.cwd" value="D:\Dev\Demo\git\Demo\DemoApp\build\jsTest"/>
  <property name="process.execPath" value="D:\Dev\Demo\git\Demo\DemoApp\build\nodeJs\node-v0.11.10-windows-x64\bin\node.exe"/>
  <property name="process.version" value="v0.11.10"/>
  <property name="process.versions" value="[ http_parser: '2.2', node: '0.11.10', v8: '3.22.24.10', uv: '0.11.17', zlib: '1.2.3', modules: '13', openssl: '1.0.1e']"/>

  ...

  <property name="process.env.NODE_PATH" value="D:\Dev\Demo\git\Demo\DemoApp\build\jsTest\node_modules"/>
  <property name="process.env.SUITE_NAME" value="jsTest.myTest"/>
  <property name="process.env.XUNIT_FILE" value="D:\Dev\Demo\git\Demo\DemoApp\build\test-results\TEST-jsTest.myTest.xml"/>
  <property name="process.env.LOG_XUNIT" value="undefined"/>
</properties>
```

**File Path Options**

The file path accepts a few custom tokens to allow creation of dynamic file names.  This can be useful for multithreaded testing (such as using a Selenium Grid) or to keep multiple files by timestamp.  Tokens are in the following format:

```
${tokenName: 'Token Data'}
```

The available tokens are `pid` to inject the process id, `cwd` to inject the current working directory, and `ts` or `timestamp` to inject a timestamp.

By default `ts` and `timestamp` use the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format, ex: `2016-03-31T07:27:48+00:00`.  However, if you specify a custom format in the Token Data, the timestamp uses the [node dateformat](https://github.com/felixge/node-dateformat) library to output a string in that format.

A full example `config.json` is as follows:

```
{
  "file": "${cwd}/${timestamp: 'MMDD-hhmm'}/xunit-${pid}.xml"
}
```

This would output something like `~/myProject/1217-1507/xunit-1234.xml`.  This example would keep copies good for a year without collision, and group multithreaded results by test run.

Tokens can be used in either environment variables or a config.json. The default filepath is always `${cwd}/xunit.xml`.

# Credits
This reporter is just the original [xunit reporter](https://github.com/visionmedia/mocha/blob/master/lib/reporters/xunit.js) from mocha only writing the result in an xml file.

# LICENSE

MIT
