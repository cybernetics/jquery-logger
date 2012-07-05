/**
 * Wraps event callbacks passed into jQuery so that exceptions are logged
 */
;(function($) {
  $.extend($.event, {
    /**
     * Adds an event hook, logging any errors that occur within the callback.
     */
    addWithoutLogger: $.event.add,
    add: function(elem, types, handler, data, selector) {
      var result = this.addWithoutLogger.apply(this, arguments);
      
      var events = $.data(elem, 'events');
      if (events) {
        types = types.split(' ');
        for (var i = 0; i < types.length; i++) {
          var type = types[i];
          var namespaces = type.split('.');
          type = namespaces.shift();
          var special = $.event.special[type] || {};
          type = (selector ? special.delegateType : special.bindType) || type;
          var handlers = events[type];

          for (var j = 0; j < handlers.length; j++) {
            var handlerObj = handlers[j];
            if (!handlerObj.logging) {
              $.extend(handlerObj, {
                handler: $.logger.fn(handlerObj.handler, {method: '$.event.add'}),
                logging: true
              });
            }
          }
        }
      }

      return result;
    }
  });
})(jQuery);
