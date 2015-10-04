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
    "file" : "xunit.xml",
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
```

# Credits
This reporter is just the original [xunit reporter](https://github.com/visionmedia/mocha/blob/master/lib/reporters/xunit.js) from mocha only writing the result in an xml file.

# LICENSE

MIT
