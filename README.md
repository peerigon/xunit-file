mocha-xunit-file-reporter
=========================

Basically the same reporter as mocha's xunit reporter, but writes the output in a file.

# How to use

1. Add "xunit-file" to your package.json as a developmentDependency
2. Run mocha with `-R xunit-file` or `--reporter xunit-file`
3. The xunit-file is stored in process.cwd() or a given path in the config.json

# Credits
This reporter is just the original [xunit reporter](https://github.com/visionmedia/mocha/blob/master/lib/reporters/xunit.js) from mocha only writing the result in an xml file.