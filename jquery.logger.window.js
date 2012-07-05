/**
 * Wraps window callbacks passed into jQuery so that exceptions are logged
 */
;(function($) {
  var originalSetTimeout = setTimeout;
  setTimeout = function(code, delay) {
    return originalSetTimeout($.logger.fn(code, {method: 'setTimeout'}), delay);
  };
  
  var originalSetInterval = setInterval;
  setInterval = function(code, delay) {
    return originalSetInterval($.logger.fn(code, {method: 'setInterval'}), delay);
  };
})(jQuery);
