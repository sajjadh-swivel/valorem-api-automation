class IFrameHelper {
  async setBrowser(browser) {
    this.browser = browser;
  }
  /*
 A Number,
 representing the index of the window object corresponding to a frame,
 */
  async switchToIFrameByIndex(index) {
    await browser.switchToFrame(index);
  }

  /*
   An Element object received using findElement,
   By providing id
  */
  async switchToIFrameByElementId(id) {
    let ele = await $(`iframe[id="${id}"]`);
    await browser.switchToFrame(ele);
  }

  /*
   An Element object received using findElement,
   By providing name
  */
  async switchToIFrameByName(name) {
    let ele = await $(`iframe[name="${name}"]`);
    await browser.switchToFrame(ele);
  }

  /*
   An Element object received using findElement,
   By providing selector
  */
  async switchToIFrameBySelector(selector) {
    let ele = await $(selector);
    await browser.switchToFrame(ele);
  }

  /*
   Switching to parent frame
  */
  async switchToParentFrame() {
    await browser.switchToParentFrame();
  }

  /*
   Switching to last frame
  */
  async switchToLastIFrame() {
    const iframes = await $$("iframe");
    const lastIframe = iframes[iframes.length - 1];
    await browser.switchToFrame(lastIframe);
  }

  /*
   Switching to default context
  */
  async switchToDefaultContent() {
    await browser.switchToFrame(null);
  }
}
export default IFrameHelper;
