import timeOutManager from "./timeOutManager.js";
import webActions from "./webActions.js";
export default {
  /* Click on the given element
   * @element - element type parameter
   * @button - string (default - "left") | "middle", "right"
   */
  doClick: async function (element, button = "left") {
    const retries = timeOutManager.getRetryCount();
    let attempt = 0;

    const isDisplayed = await element.isDisplayed();
    if (isDisplayed) {
      while (attempt < retries) {
        const isClickable = await element.waitForClickable();
        if (isClickable) {
          try {
            await element.click({ button });
            console.log("performed click after clickable");
            break;
          } catch (err) {
            console.error("Exception thrown:", err);
          }
        } else {
          await scrollToElement(element);
        }
        attempt++;
      }
      console.log("Retried attempt count: " + attempt);
      if (attempt === retries) {
        console.log("Element is not clickable");
        throw new Error("Element is not clickable");
      }
    } else {
      throw new Error("Element is not displayed");
    }
  },

  scrollToElement: async function (element) {
    try {
      console.warn(
        "WARN: Element",
        element,
        "is not clickable.",
        "Scrolling to it before clicking again."
      );
      await element.scrollIntoView({
        block: "center",
        inline: "center",
      });
      console.log("Scrolled into view");
    } catch (err) {
      console.error("Exception thrown:", err);
    }
  },

  /* Click on the given element by javascript execute
   * @selector - selector type parameter(css)
   */
  jsClick: async function (selector) {
    try {
      console.log("JS funtion execution started");
      await browser.execute((selector) => {
        let ele = document.querySelector(selector);
        ele.click();
      }, selector);
      console.log("jsClick performed");
    } catch (error) {
      console.log("Error: " + error);
      throw error;
    }
  },

  /* Double click on the given element by movith the xOffset and yOffset
   * @element - element type parameter
   */
  doubleClick: async function (element) {
    let retries = timeOutManager.getRetryCount;
    let attempt = 0;

    let isDisplayed = await element.isDisplayed();
    if (!isDisplayed) {
      await element.waitForDisplayed({
        timeout: timeOutManager.getDisplayTimeOut(),
      });
    }

    do {
      try {
        await element.doubleClick();
        console.log("Performed doubleClick");
        break;
      } catch (err) {
        console.error("Exception thrown:", err);
        if (err.message.includes("is not clickable at this point")) {
          console.warn(
            "WARN: Element",
            this.element,
            "is not clickable.",
            "Scrolling to it before double clicking again."
          );

          await element.scrollIntoView({ block: "center", inline: "center" });
        } else {
          attempt++;
          if (attempt >= retries) {
            console.log("Element is not clickable");
            throw err;
          }
        }
      }
    } while (attempt < retries);
    console.log("Retried attempt count: " + attempt);
  },

  /* Click mouse left/middle/right button on the given element by given pixels
     away horizontally(x) and vertically(y) from location of the element(from center point of element)
     and ignore unexpected alert open
   * @element - element type parameter
   * @mouseButton - [0, "left", 1, "middle", 2, "right"]
   * @xoffset - X offset
   * @yoffset - Y offset
   * @skip - skipRelease [true/false} true: stayAlert false:DismissAlert
   */
  clickOffsetBySkipRelease: async function (
    element,
    mouseButton,
    xOffset,
    yOffset,
    skip = true
  ) {
    let retries = timeOutManager.getRetryCount();
    let attempt = 0;

    while (attempt < retries) {
      try {
        await element.click({
          button: mouseButton,
          x: xOffset,
          y: yOffset,
          skipRelease: skip,
        });
        console.log(
          `${mouseButton} mouse click performed at X: ${xOffset}, Y: ${yOffset}`
        );
        return;
      } catch (err) {
        console.error("Exception thrown:", err);
        if (err.message.includes("is not clickable at this point")) {
          console.warn(
            `WARN: Element ${element} is not clickable. Scrolling to it before clicking again.`
          );

          try {
            await element.scrollIntoView({
              block: "center",
              inline: "center",
            });
          } catch (err) {
            console.error("Error scrolling to element:", err);
          }
        }
      }

      attempt++;
    }

    console.log("Element is not clickable");
    throw new Error("Element is not clickable");
  },
  /* clicks on element hozontally away by given pixels 
     from location of the element(from center point of element)
   * @element - element type parameter
   * @xoffset - how many pixels away from the element horizontally
   */
  horizontalAwayClick: async function (element, xOffset) {
    const retries = timeOutManager.getRetryCount;
    let attempt = 0;

    while (attempt < retries) {
      try {
        await element.click({ x: xOffset });
        console.log("perform horizontalAwayClick after clickable");
        return;
      } catch (err) {
        console.error("Exception thrown:", err);

        if (!err.message.includes("is not clickable at this point")) {
          throw err;
        }

        console.warn(
          "WARN: Element",
          this.element,
          "is not clickable.",
          "Scrolling to it before clicking again."
        );

        try {
          await element.scrollIntoView({
            block: "center",
            inline: "center",
          });
          await element.click({ x: xOffset });
          console.log("Scroll in to view and horizontalAwayClick performed");
          return;
        } catch (err) {
          attempt++;
          continue;
        }
      }
    }

    try {
      await element.waitForDisplayed({
        timeout: webActions.getDisplayTimeOut(),
      });
      await element.click({ x: xOffset });
      console.log("Wait for displayed and horizontalAwayClick performed");
    } catch (error) {
      console.error("Exception thrown:", error);

      if (!error.message.includes("is not displayed")) {
        throw error;
      }
    }
  },

  /* clicks on element vertically away by given pixels
     from location of the element(from center point of element)
   * @element - element type parameter
   * @yoffset - how many pixels away from the element vertically
   */
  verticalAwayClick: async function (element, yOffset) {
    const retries = timeOutManager.getRetryCount;
    let attempt = 0;

    while (attempt < retries) {
      try {
        await element.click({ y: yOffset });
        console.log("perform verticalAwayClick after clickable");
        return;
      } catch (err) {
        console.error("Exception thrown:", err);

        if (!err.message.includes("is not clickable at this point")) {
          throw err;
        }

        console.warn(
          "WARN: Element",
          this.element,
          "is not clickable.",
          "Scrolling to it before clicking again."
        );

        try {
          await element.scrollIntoView({
            block: "center",
            inline: "center",
          });
          await element.click({ y: yOffset });
          console.log("Scroll in to view and verticalAwayClick performed");
          return;
        } catch (err) {
          attempt++;
          continue;
        }
      }
    }

    try {
      await element.waitForDisplayed({
        timeout: webActions.getDisplayTimeOut(),
      });
      await element.click({ y: yOffset });
      console.log("Wait for displayed and verticalAwayClick performed");
    } catch (err) {
      console.error("Exception thrown:", err);

      if (!err.message.includes("is not displayed")) {
        throw err;
      }
    }
  },
};
