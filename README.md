# jquery.logger

Provides the ability to log messages for debugging.  Features includes:

* IE support via Firebug
* Report exceptions to a web server
* Pluggable web server backends (with Airbrake support)
* Detailed reports for AJAX errors
* Logger level, environment, user agent, and message matching filters
* Global context to include with every exception report

## Requirements

* `jquery.logger` - Core logger API

Optional:

* `jquery.logger.window` - Track errors raised in `setTimeout` / `setInterval` calls
* `jquery.logger.ajax` - Tracks errors in `$.ajax` calls
* `jquery.logger.events` - Tracks errors in DOM events
* `jquery.logger.airbrake` - Provides an integration for Airbrake

## Usage

Configuration:

```javascript
$.logger.level = $.logger.LEVELS.development;
$.logger.environment = 'development';
$.logger.firebugLite.enabled = false;
$.logger.context = {
  user_id: function() { return window.user.id; },
  startTime: (new Date()).toString()
};
$.logger.onerror = function(message) {
  // Do something with the message object
};
$.logger.filters.userAgents = ['msie 6'];
$.logger.filters.messages = [
  'Permission denied to call method Location.toString',
  'Automation server can\'t create object',
  'Unspecified error',
  'Out of memory'
];
```

Logging errors:

```javascript
$.logger.debug('This is a debug message');

$.logger.info('This is an info message');

$.logger.warn('This is a warn message');

var error = new Error('This is an error message');
error.customData = {appId: 123};
$.logger.error(error);
```

Automatically reporting errors:

```javascript
var fn = $.logger.fn(function() {
  throw new Error('Something bad happened!');
});

var fnWithData = $.logger.fn(function() {
  throw new Error('Something bad happened!');
}, {method: 'fnWithData'});
```

## Airbrake integration

To use Airbrake as your web server backend:

* Add Airbrake's official javascript plugin and jquery.logger.airbrake.js to your page.
* Add the following javascript to configure Airbrake:

```javascript
Airbrake.setEnvironment('development');
Airbrake.setKey('YOUR_API_KEY');
$.extend(Airbrake, {
  // Fix parameters with null values causing issues in the Airbrake lib
  generateXMLWithoutKeys: Airbrake.generateXML,
  generateXML: function(error) {
    for (var param in error.params) {
      error.params[param] += '';
    }
    
    return this.generateXMLWithoutKeys(error);
  }
});
$.logger.developmentEnvironments = ['development', 'test'];
```
