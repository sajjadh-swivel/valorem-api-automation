import timeOutManager from "./timeOutManager.js";
import webActions from "./webActions.js";

export default {
  /**
   * Selects the radio button with the given value.
   * @param {Element} element - The radio button element.   *
   */
  selectRadioButton: async function (element) {
    let retryCount = timeOutManager.getRetryCount();
    try {
      const ele = await element.waitForDisplayed(1000);
      if (ele) {
        try {
          while (retryCount > 0) {
            try {
              retryCount--;
              await webActions.doClick(element);
              break;
            } catch (error) {
              if (retryCount === 0) {
                console.error("Exception thrown:", error);
                throw error;
              }
            }
          }
        } catch (error) {
          console.error("Exception thrown:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Exception thrown:", error);
      throw error;
    }
  },

  /**
   * Selects the radio button with the given value.
   * @param {string} selector - The selector for the radio button elements.
   * @param {string} value - The value of the radio button to select.
   */
  selectRadioButtonByValue: async function (selector, value) {
    const radioButton = await $(`${selector}[value="${value}"]`);
    await radioButton.click();
  },

  /**
   * Selects the radio button with the given index (zero-based).
   * @param {string} selector - The selector for the radio button elements.
   * @param {number} index - The index of the radio button to select.
   */
  selectRadioButtonByIndex: async function (selector, index) {
    const radioButton = await $$(selector)[index];
    await radioButton.click();
  },

  /**
   * Returns the value of the selected radio button.
   * @param// {string} selector - The selector for the radio button elements.
   * @returns// {string} - The value of the selected radio button.
   */
  getSelectedRadioButtonValue: async function (selector) {
     const radioButtons = await $$(selector);
     let selectedValue = null;

     for (const radioButton of radioButtons) {
       const isSelected = await radioButton.isSelected();
       if (isSelected) {
         selectedValue = await radioButton.getAttribute("value");
         break;
       }
     }

     return selectedValue;
  },

  /**
   * Checks if the radio button with the given value is selected.
   * @param //{string} selector - The selector for the radio button elements.
   * @param// {string} value - The value of the radio button to check.
   * @returns// {boolean} - True if the radio button is selected, false otherwise.
   */
  isRadioButtonSelectedByValue: async function (selector, value) {
    const radioButton = await $(`${selector}[value="${value}"]`);
    return radioButton.isSelected();
  },

  /**
   * Checks if the radio button with the given index (zero-based) is selected.
   * @param// {string} selector - The selector for the radio button elements.
   * @param// {number} index - The index of the radio button to check.
   * @returns// {boolean} - True if the radio button is selected, false otherwise.
   */
  isRadioButtonSelectedByIndex: async function (selector, index) {
    const radioButton = await $$(selector)[index];
    return await radioButton.isSelected();
  },
};
