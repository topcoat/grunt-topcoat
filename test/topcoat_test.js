'use strict';

var grunt = require('grunt'),
    fs    = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.topcoat = {
    download: function(test) {
        fs.exists("tmp/src/controls/button-0.1.0", function(exists) {
            test.ok(exists);
        });

        fs.exists('tmp/src/controls/button-base', function(exists) {
            test.ok(exists);
        });

        fs.exists('tmp/src/utils/utils', function(exists) {
            test.ok(exists);
        });

        fs.exists("tmp/src/theme-0.1.0", function(exists) {
            test.ok(exists);
        });

        fs.exists("tmp/src/skins/button-0.1.0", function(exists) {
            test.ok(exists);
        });

        test.done();
    }
};
