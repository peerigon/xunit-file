mocha-xunit-file-reporter
=========================

Basically the same reporter as mocha's xunit reporter, but writes the output in a file.

# How to use

1. Clone this repository into mocha's reporters folder (MOCHA_ROOT/lib/reporters/)
2. (optional) Change the config.json with the destination file
3. Run the mocha test with the reporter xunit-file:

        mocha -R xunit-file


# ToDo
Find a solution to include the reporter installed via npm

# Credits
This reporter is just the original [xunit reporter](https://github.com/visionmedia/mocha/blob/master/lib/reporters/xunit.js) from mocha only writing the result in an xml file.