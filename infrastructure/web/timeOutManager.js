import config from "../../config.json" assert { type: "json" };

//Default timeouts
const pause = "3000";
const waitUntilClickable = "3000";
const waitUntilDisplay = "3000";
const implicitWait = "3100";
const pageLoadTimeOut = "6100";
const scriptTimeOut = "6100";
const waitforTimeout = "6000";
const connectionRetryTimeout = "2000";

/* Get the timeouts from config.json or default values from timeOuts.json */
export default {
  implicitWait,
  pageLoadTimeOut,
  scriptTimeOut,
  getPause: function () {
    return config.pause !== "" ? parseInt(config.pause) : parseInt(pause);
  },

  getClickableTimeOut: function () {
    return config.waitUntilClickable !== ""
      ? parseInt(config.waitUntilClickable)
      : parseInt(waitUntilClickable);
  },

  getDisplayTimeOut: function () {
    return config.waitUntilDisplay !== ""
      ? parseInt(config.waitUntilDisplay)
      : parseInt(waitUntilDisplay);
  },

  getimplicitWaitTimeOut: function () {
    return config.implicitWait !== ""
      ? parseInt(config.implicitWait)
      : parseInt(implicitWait);
  },

  getPageLoadTimeOut: function () {
    return config.pageLoadTimeOut !== ""
      ? parseInt(config.pageLoadTimeOut)
      : parseInt(pageLoadTimeOut);
  },

  getScriptTimeOut: function () {
    return config.scriptTimeOut !== ""
      ? parseInt(config.scriptTimeOut)
      : parseInt(scriptTimeOut);
  },

  getWaitForTimeOut: function () {
    return config.waitforTimeout !== ""
      ? parseInt(config.waitforTimeout)
      : parseInt(waitforTimeout);
  },

  getconnectionRetryTimeout: function () {
    return config.connectionRetryTimeout !== ""
      ? parseInt(config.connectionRetryTimeout)
      : parseInt(connectionRetryTimeout);
  },

  getRetryCount: function () {
    let count = config.RETRY;
    return count;
  },

  getUrlRetryCount: function () {
    let count = config.URL_RETRY;
    return count;
  },
};
