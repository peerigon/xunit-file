xunit-file
==========

Basically the same reporter as mocha's xunit reporter, but writes the output to a file.

# How to use

1. Add "xunit-file" to your package.json as a developmentDependency
2. Run mocha with `-R xunit-file` or `--reporter xunit-file`
3. The xunit output file is saved to the file given in the XUNIT_FILE environment variable, the file named in config.json, or process.cwd()/xunit.xml

    XUNIT_FILE=output/xunit.xml mocha -R xunit-file

# Credits
This reporter is just the original [xunit reporter](https://github.com/visionmedia/mocha/blob/master/lib/reporters/xunit.js) from mocha only writing the result in an xml file.
