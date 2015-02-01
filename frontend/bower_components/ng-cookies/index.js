var angular = require('angular'),
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
    this.$get = /* @ngInject */ function($document) {
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
    };

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
