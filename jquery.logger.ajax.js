/**
 * Wraps ajax callbacks passed into jQuery so that exceptions are logged
 */
;(function($) {
  // Important that we add this prefilter last so that we get the benefit of
  // logging all the settings that might be munged by other prefilters
  $.ajaxPrefilter('*', function(s, originalSettings, jqXHR) {
    var callbacks = ['error', 'complete', 'success'];
    for (var i = 0; i < callbacks.length; i++) {
      var callback = callbacks[i];

      if (s[callback]) {
        s[callback] = $.logger.fn(s[callback], {
          filter: s.filter,
          method: '$.ajax#' + callback,
          url: s.url,
          data: s.filter ? undefined : s.data,
          headers: s.headers,
          success: s.success
        });
      }
    }
  });
})(jQuery);
