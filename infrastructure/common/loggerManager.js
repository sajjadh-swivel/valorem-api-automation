import log4js from "log4js";

export default {
  /* this will create log4js loggers
   * to a file, console and allure report
   */
  createLog: function () {
    log4js.configure({
      appenders: {
        console: { type: "console" },
        allure: {
          type: "file",
          filename: "logs/allure-log.log",
          layout: { type: "basic" },
        },
      },
      categories: {
        default: { appenders: ["console", "allure"], level: "info" },
      },
    });
  },

  /* info type logger
   * @message - logger message
   */
  logInfo: function (message) {
    const logger = log4js.getLogger("default");
    logger.info(message);
  },

  /* debug type logger
   * @message - logger message
   */
  logDebug: function (message) {
    const logger = log4js.getLogger("default");
    logger.debug(message);
  },

  /* error type logger
   * @message - logger message
   */
  logError: function (message) {
    const logger = log4js.getLogger("default");
    logger.error(message);
  },

  /* warn type logger
   * @message - logger message
   */
  logWarn: function (message) {
    const logger = log4js.getLogger("default");
    logger.warn(message);
  },
};
