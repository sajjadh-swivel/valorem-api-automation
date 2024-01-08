class cookieHandler {
  async setBrowser(browser) {
    this.browser = browser;
  }
  // Get all cookies
  async getAllCookies() {
    return browser.getCookies();
  }

  // Get a specific cookie by name
  async getCookie(name) {
    const cookies = await browser.getCookies();
    return cookies.find((cookie) => cookie.name === name);
  }

  // Set a cookie
  async setCookie(cookie) {
    await browser.setCookies([cookie]);
  }

  // Delete a specific cookie by name
  //options are optinal > domain: '.example.com', path: '/',
  async deleteCookie(name, options) {
    await browser.deleteCookies(name, options);
  }

  // Delete all cookies
  async deleteAllCookies() {
    await browser.deleteCookies();
  }

  // Preserve cookies
  async preserveCookies() {
    await browser.presetCookies();
  }

  // Check if a specific cookie exists
  async doesCookieExist(name) {
    const cookies = await browser.getCookies();
    return cookies.some((cookie) => cookie.name === name);
  }
}
export default cookieHandler;
