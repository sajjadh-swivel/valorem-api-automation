/** *
 Impoer wrapper commands to here and define it under export package
 */

import typeFunc from "./typeFunc.js";
import clickFunc from "./clickFunc.js";
import timeoutManager from "./timeOutManager.js";
import browserManager from "./browserManager.js";
import loggerManager from "../common/loggerManager.js";
import javaScriptHelper from "./javaScriptHelper.js";
import iFrameHelper from "./IFrameHelper.js";
import CookieHandler from "./cookieHandler.js";
import checkBoxFunc from "./selectCheckBoxFunc.js";
import dropdownHandler from "./dropDownHandler.js";
import radioButtonHandler from "./radioButtonHandler.js";
import fileUpload from "./fileUploadFunc.js";

export default {
  ...clickFunc,
  ...typeFunc,
  ...timeoutManager,
  ...browserManager,
  ...loggerManager,
  ...checkBoxFunc,
  ...dropdownHandler,
  ...radioButtonHandler,
  ...fileUpload,
  iFrameHelper: new iFrameHelper(),
  javaScriptHelper: new javaScriptHelper(),
  cookieHandler: new CookieHandler(),
};
