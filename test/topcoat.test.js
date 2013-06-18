'use strict';

var grunt = require('grunt'),
    fs    = require('fs'),
    debug = require('debug')('test');

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

exports.nodeunit = {
    download: function(test) {
        test.expect(5);

        test.ok(fs.existsSync('tmp/src/controls/button-0.1.0'));

        test.ok(fs.existsSync('tmp/src/controls/button-base'));

        test.ok(fs.existsSync('tmp/src/utils/utils'));

        test.ok(fs.existsSync('tmp/src/theme-0.1.0'));

        test.ok(fs.existsSync('tmp/src/skins/button-0.1.0'));

        test.done();
    }
};
