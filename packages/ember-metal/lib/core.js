/*globals Em:true ENV */

/**
@module ember
@submodule ember-metal
*/

/**
  All Ember methods and functions are defined inside of this namespace.
  You generally should not add new properties to this namespace as it may be
  overwritten by future versions of Ember.

  You can also use the shorthand "Em" instead of "Ember".

  Ember-Runtime is a framework that provides core functions for
  Ember including cross-platform functions, support for property
  observing and objects. Its focus is on small size and performance. You can
  use this in place of or along-side other cross-platform libraries such as
  jQuery.

  The core Runtime framework is based on the jQuery API with a number of
  performance optimizations.

  @class Ember
  @static
  @version 1.0.pre
*/

if ('undefined' === typeof Ember) {
  // Create core object. Make it act like an instance of Ember.Namespace so that
  // objects assigned to it are given a sane string representation.
  Ember = {};
}

// Default imports, exports and lookup to the global object;
var imports = Ember.imports = Ember.imports || this;
var exports = Ember.exports = Ember.exports || this;
var lookup  = Ember.lookup  = Ember.lookup  || this;

// aliases needed to keep minifiers from removing the global context
exports.Em = exports.Ember = Em = Ember;

// Make sure these are set whether Ember was already defined or not

Ember.isNamespace = true;

Ember.toString = function() { return "Ember"; };


/**
  @property VERSION
  @type String
  @default '1.0.pre'
  @final
*/
Ember.VERSION = '1.0.pre';

/**
  Standard environmental variables.  You can define these in a global `ENV`
  variable before loading Ember to control various configuration
  settings.

  @property ENV
  @type Hash
*/
Ember.ENV = Ember.ENV || ('undefined' === typeof ENV ? {} : ENV);

Ember.config = Ember.config || {};

// ..........................................................
// BOOTSTRAP
//

/**
  Determines whether Ember should enhances some built-in object
  prototypes to provide a more friendly API.  If enabled, a few methods
  will be added to Function, String, and Array.  Object.prototype will not be
  enhanced, which is the one that causes most trouble for people.

  In general we recommend leaving this option set to true since it rarely
  conflicts with other code.  If you need to turn it off however, you can
  define an ENV.EXTEND_PROTOTYPES config to disable it.

  @property EXTEND_PROTOTYPES
  @type Boolean
  @default true
*/
Ember.EXTEND_PROTOTYPES = Ember.ENV.EXTEND_PROTOTYPES;

if (typeof Ember.EXTEND_PROTOTYPES === 'undefined') {
  Ember.EXTEND_PROTOTYPES = true;
}

/**
  Determines whether Ember logs a full stack trace during deprecation warnings

  @property LOG_STACKTRACE_ON_DEPRECATION
  @type Boolean
  @default true
*/
Ember.LOG_STACKTRACE_ON_DEPRECATION = (Ember.ENV.LOG_STACKTRACE_ON_DEPRECATION !== false);

/**
  Determines whether Ember should add ECMAScript 5 shims to older browsers.

  @property SHIM_ES5
  @type Boolean
  @default Ember.EXTEND_PROTOTYPES
*/
Ember.SHIM_ES5 = (Ember.ENV.SHIM_ES5 === false) ? false : Ember.EXTEND_PROTOTYPES;


/**
  Determines whether computed properties are cacheable by default.
  This option will be removed for the 1.1 release.

  When caching is enabled by default, you can use `volatile()` to disable
  caching on individual computed properties.

  @property CP_DEFAULT_CACHEABLE
  @type Boolean
  @default true
*/
Ember.CP_DEFAULT_CACHEABLE = (Ember.ENV.CP_DEFAULT_CACHEABLE !== false);

/**
  Determines whether views render their templates using themselves
  as the context, or whether it is inherited from the parent. This option
  will be removed in the 1.1 release.

  If you need to update your application to use the new context rules, simply
  prefix property access with `view.`:

  Before:

  ``` handlebars
  {{#each App.photosController}}
    Photo Title: {{title}}
    {{#view App.InfoView contentBinding="this"}}
      {{content.date}}
      {{content.cameraType}}
      {{otherViewProperty}}
    {{/view}}
  {{/each}}
  ```

  After:

  ``` handlebars
  {{#each App.photosController}}
    Photo Title: {{title}}
    {{#view App.InfoView}}
      {{date}}
      {{cameraType}}
      {{view.otherViewProperty}}
    {{/view}}
  {{/each}}
  ```

  @property VIEW_PRESERVES_CONTEXT
  @type Boolean
  @default true
*/
Ember.VIEW_PRESERVES_CONTEXT = (Ember.ENV.VIEW_PRESERVES_CONTEXT !== false);

/**
  Empty function.  Useful for some operations.

  @method K
  @private
  @return {Object}
*/
Ember.K = function() { return this; };


// Stub out the methods defined by the ember-debug package in case it's not loaded

if ('undefined' === typeof Ember.assert) { Ember.assert = Ember.K; }
if ('undefined' === typeof Ember.warn) { Ember.warn = Ember.K; }
if ('undefined' === typeof Ember.deprecate) { Ember.deprecate = Ember.K; }
if ('undefined' === typeof Ember.deprecateFunc) {
  Ember.deprecateFunc = function(_, func) { return func; };
}

// These are deprecated but still supported

if ('undefined' === typeof ember_assert) { exports.ember_assert = Ember.K; }
if ('undefined' === typeof ember_warn) { exports.ember_warn = Ember.K; }
if ('undefined' === typeof ember_deprecate) { exports.ember_deprecate = Ember.K; }
if ('undefined' === typeof ember_deprecateFunc) {
  exports.ember_deprecateFunc = function(_, func) { return func; };
}


// ..........................................................
// LOGGER
//

/**
  Inside Ember-Metal, simply uses the imports.console object.
  Override this to provide more robust logging functionality.

  @class Logger
  @namespace Ember
*/
Ember.Logger = imports.console || { log: Ember.K, warn: Ember.K, error: Ember.K, info: Ember.K, debug: Ember.K };


// ..........................................................
// ERROR HANDLING
//

/**
  A function may be assigned to `Ember.onerror` to be called when Ember internals encounter an error.
  This is useful for specialized error handling and reporting code.

  @event onerror
  @for Ember
  @param {Exception} error the error object
*/
Ember.onerror = null;

/**
  @private

  Wrap code block in a try/catch if {{#crossLink "Ember/onerror"}}{{/crossLink}} is set.

  @method handleErrors
  @for Ember
  @param {Function} func
  @param [context]
*/
Ember.handleErrors = function(func, context) {
  // Unfortunately in some browsers we lose the backtrace if we rethrow the existing error,
  // so in the event that we don't have an `onerror` handler we don't wrap in a try/catch
  if ('function' === typeof Ember.onerror) {
    try {
      return func.apply(context || this);
    } catch (error) {
      Ember.onerror(error);
    }
  } else {
    return func.apply(context || this);
  }
};
