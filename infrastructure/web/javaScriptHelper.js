class javaScriptHelper {
  setBrowser(browser) {
    this.browser = browser;
  }
  executeScript(script, ...args) {
    return this.browser.execute(script, ...args);
  }
  scrollToElement(element) {
    console.log("Scroll to WebElement");
    const { x, y } = element.getLocation();
    this.executeScript("window.scrollTo(arguments[0],arguments[1])", x, y);
  }

  scrollToElementAndClick(element) {
    this.scrollToElement(element);
    element.click();
    console.log("Element is clicked:", element.toString());
  }

  scrollIntoView(element) {
    console.log("Scroll till WebElement");
    this.executeScript("arguments[0].scrollIntoView()", element);
  }

  scrollIntoViewAndClick(element) {
    this.scrollIntoView(element);
    element.click();
    this.executeScript("arguments[0].scrollIntoView()", element);
  }

  scrollDownVertically() {
    console.log("Scrolling down vertically...");
    this.executeScript("window.scrollTo(0,document.body.scrollHeight)");
  }

  scrollUpVertically() {
    console.log("Scrolling up vertically...");
    this.executeScript("window.scrollTo(0,-document.body.scrollHeight)");
  }

  scrollDownByPixel(pixel) {
    this.executeScript(`window.scrollBy(0, ${pixel})`);
  }

  scrollUpByPixel(pixel) {
    this.executeScript(`window.scrollBy(0, -${pixel})`);
  }

  zoomInBy200Percentage() {
    this.executeScript("document.body.style.zoom='200%'");
  }

  zoomInBy150Percentage() {
    this.executeScript("document.body.style.zoom='60%'");
  }

  clickElement(element) {
    this.executeScript("arguments[0].click();", element);
  }
}
export default javaScriptHelper;
