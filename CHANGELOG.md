# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2023-02-01

- [#40](https://github.com/peerigon/xunit-file/pull/40) relax package.json engine restriction to allow v18
 
## [2.0.0] - 2021-11-24

BREAKING CHANGE: This is the first version which has a node engines specifier. Hence we are releasing this as a major version. 
 
### Added

- [#36](https://github.com/peerigon/xunit-file/pull/36) chore: CI Action to run tests 

### Changed
  
- [#27](https://github.com/peerigon/xunit-file/pull/27) fix: Dont count xunit failures as errors (thanks @mlucool)
- [#25](https://github.com/peerigon/xunit-file/pull/25) fix: Remove escaping character in CDATA (thanks @jugend)
- [#38](https://github.com/peerigon/xunit-file/pull/38) feat!: Specified supported node engine versions `> 12 < 16`
 
### Fixed
 
- [#38](https://github.com/peerigon/xunit-file/pull/38) fix: Update packages to resolve CVE issues #38 (thanks @gagyibenedek)
