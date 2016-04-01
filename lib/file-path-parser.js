// Exports a factory for testing purposes.
// Otherwise process will be the real deal.
// Also, testing with time/timezones is rather difficult, so that's all mocked.
module.exports = function(myProcess, myDate, myFormatter) {
  return function(s) {
    r = s;
    var now = myDate.now();
    var pidRE = regexTokenCreator('pid');
    var cwdRE = regexTokenCreator('cwd');
    var simpleTSRE = regexTokenCreator('(?:ts|timestamp)');
    var customTSRE = regexTokenCreator('(?:ts|timestamp):\\s*["\']([^"\']*)["\']');

    r = r.replace(pidRE, myProcess.pid);
    r = r.replace(cwdRE, myProcess.cwd());
    r = r.replace(simpleTSRE, myFormatter(now, 'isoDateTime'));

    // collect all of our regex matches
    var matches = [];
    var match;
    while ((match = customTSRE.exec(r)) !== null) {
      matches.push(match);
    }

    // Use each match to replace the whole with the date in the format of the
    // first matching group (the contents of the quotes).
    matches.forEach(function(match) {
      r = r.replace(match[0], myFormatter(now, match[1]));
    });

    return r;
  }
}

function regexTokenCreator(s) {
  return new RegExp('\\${\\s*' + s + '\\s*}', 'ig');
}
