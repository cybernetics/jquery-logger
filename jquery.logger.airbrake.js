;(function($) {
  $.logger.service.url = location.protocol + '//airbrake.io/notifier_api/v2/notices';

  /**
   * Extends the jquery.logger plugin to support writing to Airbrake
   */
  $.extend($.logger, {
    /**
     * Formats the given message for being written to Airbrake.
     *
     * @param {String} severity The severity level of the message
     * @param message The content to log
     * @return {Object} A hash of query parameters
     */
    formatMessageForURL: function(severity, message) {
      var messageData = this.messageToObject(severity, message);
      var customData = messageData.customData;
      delete messageData.customData;

      var method = customData.method || 'unknown';
      var methodParts = method.match(/^(?:(.*)\.)?(.*)$/);

      $.extend(messageData, {
        params: customData,
        component: methodParts[1] || 'window',
        action: methodParts[2] || 'unknown',
        url: customData.url || (window.location ? window.location.href : 'unknown'),
        type: messageData.message
      });

      delete customData.method;
      delete customData.url;

      // Generate the airbrake xml
      return {data: Airbrake.generateXML(messageData), message: messageData.message};
    }
  });
})(jQuery);
