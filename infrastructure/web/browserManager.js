import configs from "../../config.json" assert { type: "json" };
import timeOutManager from "./timeOutManager.js";

export default {
  /**
   * navigate to the particular url
   * @param url path of the page
   */
  openUrl: async function (url) {
    const ENV = process.env.ENV;
    const confUrl = configs.URLS;
    const defaultUrl = configs.DEFAULT_URL;
    const retries = timeOutManager.getUrlRetryCount();
    const retryInterval = configs.URL_RETRY_INTERVAL;
    let attempt = 0;
    let urlObj;
    let fullUrl;

    if (ENV && confUrl[ENV.trim()]) {
      urlObj = new URL(confUrl[ENV.trim()].toLowerCase());
    } else if (url !== "/" && url !== "") {
      try {
        urlObj = new URL(url);
      } catch (error) {
        urlObj = new URL(url, defaultUrl);
      }
    } else {
      urlObj = new URL(defaultUrl);
    }
    fullUrl = urlObj.toString();

    while (attempt < retries) {
      try {
        const isValidUrl = Boolean(new URL(fullUrl));
        if (isValidUrl) {
          await browser.url(fullUrl);
          console.log("Navigate to Url:", fullUrl);
          break;
        }
      } catch (error) {
        console.log("Link is broken, Enter correct url", error);
      }
      if (attempt < retries - 1) {
        await browser.pause(retryInterval);
      }
      attempt++;
    }

    console.log("info", "Retried attempt count:", attempt);
  },

  /*
   *navigate to another Url in current window
   */
  navigateToUrl: async function (url) {
    const retries = timeOutManager.getUrlRetryCount();
    const retryInterval = configs.URL_RETRY_INTERVAL;
    let attempt = 0;

    while (attempt < retries) {
      attempt++;

      try {
        if (url === "" || url === "/") {
          throw new Error("Url is not defined");
        }

        const isValidUrl = Boolean(new URL(url));

        if (!isValidUrl) {
          throw new Error("Link is broken, Enter correct url");
        }

        await browser.navigateTo(url);
        console.log("Navigated to URL:", url);
        break;
      } catch (error) {
        console.log(error.message);

        if (attempt < retries) {
          await browser.pause(retryInterval);
          continue;
        }

        throw error;
      }
    }

    console.log("Retried attempt count:", attempt);
  },

  /*
   *get the current window size
   */
  getWindowSize: async function () {
    await browser.getWindowSize();
  },

  /*
   *Set the size of current window
   *@width - Width of window
   *@height - Height of window
   */
  setWindowSize: async function (width, height) {
    await browser.setWindowSize(width, height);
  },

  /* Open new window
   *@url - new window Url
   *@newWindowName - new window name
   *@newWindowFeatures -  [width,height,resizable,scrollabars,status]
   */
  openNewWindow: async function (url, newWindowName, newWindowFeatures) {
    await browser.newWindow(url, newWindowName, newWindowFeatures);
  },

  /*
   *close the current window
   */
  closeWindow: async function () {
    await browser.closeWindow();
  },

  /*
   * switch to the perticular window
   *@windowTitleOrUrl - Title or Url of the to be switched window
   */
  switchTheWindow: async function (windowTitleOrUrl) {
    await browser.switchWindow(windowTitleOrUrl);
  },

  /*
   * maximize the current window
   */
  maximizeWindow: async function () {
    await browser.maximizeWindow();
  },

  /*
   *minimize the current window
   */
  minimizeWindow: async function () {
    await browser.minimizeWindow();
  },

  /*
   * set the current window as full screen
   */
  fullScreenWindow: async function () {
    await browser.fullscreenWindow();
  },

  /*
   * navigate to previous page
   */
  navigateBack: async function () {
    await browser.back();
  },

  /*
   * navigate forward
   */
  navigateForward: async function () {
    await browser.forward();
  },

  /*
   * refresh the current window
   */
  refreshWindow: async function () {
    await browser.refresh();
  },

  /* Set the timeouts for browser object
   *@implicitWait
   *@pageLoadTimeOut
   *@scriptTimeOut
   */
  setTimeOuts: async function ({
    implicitWait,
    pageLoadTimeOut,
    scriptTimeOut,
  }) {
    await browser.setTimeout({
      implicit: implicitWait,
      pageLoad: pageLoadTimeOut,
      script: scriptTimeOut,
    });
  },

  /*
   * get the current window page title
   */
  getTheTitle: async function () {
    await browser.getTitle();
  },

  /*
   * delete cookie
   *@cookieName - name of the cookie that want to delete
   */
  deleteCookie: async function (cookieName) {
    await browser.deleteCookie(cookieName);
  },

  /*
   * delete all cookies
   */
  deleteAllCookies: async function () {
    await browser.deleteAllCookies();
  },
};
