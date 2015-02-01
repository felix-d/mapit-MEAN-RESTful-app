(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null),
  cookie = require('cookie');

var defaultOptions = {};

/**
 * @ngdoc module
 * @name ngCookie
 * @module ngCookie
 * @description
 * AngularJS module for simple browser cookie access.
 */
angular.module('ngCookie', [])
  .provider('cookies', function() {
    /**
     * @ngdoc provider
     * @name cookiesProvider
     * @module ngCookie
     * @description
     * Use `cookiesProvider` to configure how cookies are parsed and serialized.
     */
    this.$get = /* @ngInject */ ["$document", function($document) {
      var lastCookieString,
        cookies,
        document = $document[0];

      /**
       * @ngdoc service
       * @name cookies
       * @module ngCookie
       * @kind object
       * @description
       * Get and set cookies from the browser `document.cookie` "API".
       */
      return {
        /**
         * @ngdoc method
         * @name service:cookies#get
         * @description
         * Get a cookie value by name.
         *
         * @param {string} name Name of cookie.
         *
         * @returns {string} Value of cookie or `undefined`.
         */
        get: function(name) {
          if (document.cookie !== lastCookieString) {
            lastCookieString = document.cookie;
            cookies = cookie.parse(lastCookieString, defaultOptions);
          }

          return cookies[name];
        },

        /**
         * @ngdoc method
         * @name service:cookies#set
         * @description
         * Set a cookie named `name` to value `value`.
         *
         * @param {string} name Name of cookie.
         * @param {*} value Value of cookie. Will be coerced to string and passed through
         *  `encodeURIComponent` unless `encode` is overriden.
         * @param {object} options Cookie options, see {@link cookiesProvider#useDefaults useDefaults}.
         */
        set: function(name, value, options) {
          options = angular.extend(angular.extend({}, defaultOptions), options || {});

          document.cookie = cookie.serialize(name, value, options);
        }
      };
    }];

    /**
     * @ngdoc method
     * @name cookiesProvider#useDefaults
     * @description
     * Configure default options for serializing cookies, according to [RFC6265](http://tools.ietf.org/html/rfc6265).
     * Supported options are:
     *
     *    - `path` - cookie path
     *    - `expires` - absolute expiration date for the cookie (Date object)
     *    - `maxAge` - relative max age of the cookie from when the client receives it (seconds)
     *    - `domain` - domain for the cookie
     *    - `secure` - `true` or `false`
     *    - `httpOnly` - `true` or `false` (not supported by all browsers)
     *
     * @param {object} defaults Default options.
     */
    this.useDefaults = function(defaults) {
      angular.extend(defaultOptions, defaults);
    };
  })
  ;

module.exports = angular.module('ngCookie');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"cookie":2}],2:[function(require,module,exports){

/// Serialize the a name value pair into a cookie string suitable for
/// http headers. An optional options object specified cookie parameters
///
/// serialize('foo', 'bar', { httpOnly: true })
///   => "foo=bar; httpOnly"
///
/// @param {String} name
/// @param {String} val
/// @param {Object} options
/// @return {String}
var serialize = function(name, val, opt){
    opt = opt || {};
    var enc = opt.encode || encode;
    var pairs = [name + '=' + enc(val)];

    if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
        pairs.push('Max-Age=' + maxAge);
    }

    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');

    return pairs.join('; ');
};

/// Parse the given cookie header string into an object
/// The object has the various cookies as keys(names) => values
/// @param {String} str
/// @return {Object}
var parse = function(str, opt) {
    opt = opt || {};
    var obj = {}
    var pairs = str.split(/; */);
    var dec = opt.decode || decode;

    pairs.forEach(function(pair) {
        var eq_idx = pair.indexOf('=')

        // skip things that don't look like key=value
        if (eq_idx < 0) {
            return;
        }

        var key = pair.substr(0, eq_idx).trim()
        var val = pair.substr(++eq_idx, pair.length).trim();

        // quoted values
        if ('"' == val[0]) {
            val = val.slice(1, -1);
        }

        // only assign once
        if (undefined == obj[key]) {
            try {
                obj[key] = dec(val);
            } catch (e) {
                obj[key] = val;
            }
        }
    });

    return obj;
};

var encode = encodeURIComponent;
var decode = decodeURIComponent;

module.exports.serialize = serialize;
module.exports.parse = parse;

},{}]},{},[1]);
