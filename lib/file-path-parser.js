// Exports a factory for testing purposes.
// Otherwise process will be the real deal.
// Also, testing with time/timezones is rather difficult, so that's all mocked.
module.exports = function(myProcess, myDate, myFormatter) {
  return function(pathTemplate) {
    var now = myDate.now();
    var pidRE = regexTokenCreator('pid');
    var cwdRE = regexTokenCreator('cwd');
    var simpleTSRE = regexTokenCreator('(?:ts|timestamp)');
    var customTSRE = regexTokenCreator('(?:ts|timestamp):\\s*["\']([^"\']*)["\']');
    var matches = [];
    var match;

    //process the template to get the final path
    path = pathTemplate;
    path = path.replace(pidRE, myProcess.pid);
    path = path.replace(cwdRE, myProcess.cwd());
    path = path.replace(simpleTSRE, myFormatter(now, 'isoDateTime'));

    // collect all of our regex matches
    while ((match = customTSRE.exec(path)) !== null) {
      matches.push(match);
    }

    // Use each match to replace the whole with the date in the format of the
    // first matching group (the contents of the quotes).
    matches.forEach(function(match) {
      path = path.replace(match[0], myFormatter(now, match[1]));
    });

    return path;
  }
}

function regexTokenCreator(s) {
  return new RegExp('\\${\\s*' + s + '\\s*}', 'ig');
}
