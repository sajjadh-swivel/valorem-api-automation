export default {
  /*
   * Select dropdown value by visible text
   */
  selectByVisibleText: async function (dropdownElement, text) {
    await dropdownElement.selectByVisibleText(text);
  },

  /*
   * Select dropdown value by attribute
   */
  selectByAttribute: async function (dropdownElement, attribute, value) {
    await dropdownElement.selectByAttribute(attribute, value);
  },

  /*
   * Select dropdown value by index
   */
  selectByIndex: async function (dropdownElement, index) {
    await dropdownElement.selectByIndex(index);
  },

  /*
   * Check the dropdown element is selected
   */
  isSelected: async function (dropdownElement) {
    return await dropdownElement.isSelected();
  },

  /*
   * Get the value of dropdown element
   */
  getValue: async function (dropdownElement) {
    return await dropdownElement.getValue();
  },

  /*
   * Check the dropdown selected option
   */
  getSelectedOptions: async function (dropdownElement) {
    return await dropdownElement.getSelectedOptions();
  },

  /*
   * Expand the dropdown element
   */
  expandDropdown: async function (dropdownElement) {
    const isExpanded = await dropdownElement.isExpanded();
    if (!isExpanded) {
      await dropdownElement.click();
    }
  },

  /*
   * Collapse the dropdown element
   */
  collapseDropdown: async function (dropdownElement) {
    const isExpanded = await dropdownElement.isExpanded();
    if (isExpanded) {
      await dropdownElement.click();
    }
  },

  /*
   * Get the dropdown options
   */
  getDropdownOptions: async function (dropdownElement, optionsSelector) {
    await dropdownElement.click();
    const options = await $$(optionsSelector);
    const optionTexts = [];
    for (const option of options) {
      const text = await option.getText();
      optionTexts.push(text);
    }
    return optionTexts;
  },

  /*
   * Select dropdown options by index
   */
  selectOptionByIndex: async function (
    dropdownElement,
    optionsSelector,
    optionIndex
  ) {
    await dropdownElement.click();
    const options = await $$(optionsSelector);
    if (optionIndex >= 0 && optionIndex < options.length) {
      await options[optionIndex].click();
    } else {
      throw new Error("Invalid option index");
    }
  },

  /*
   * Select dropdown options by value
   */
  selectOptionByValue: async function (
    dropdownElement,
    optionsSelector,
    optionValue
  ) {
    await dropdownElement.click();
    const options = await $$(optionsSelector);
    for (const option of options) {
      const value = await option.getAttribute("value");
      if (value === optionValue) {
        await option.click();
        return;
      }
    }
    throw new Error(`Option with value "${optionValue}" not found`);
  },

  /*
   * Select dropdown options by text
   */
  selectOptionByText: async function (
    dropdownElement,
    optionsSelector,
    optionText
  ) {
    await dropdownElement.click();
    const options = await $$(optionsSelector);
    for (const option of options) {
      const text = await option.getText();
      if (text === optionText) {
        await option.click();
        return;
      }
    }
    throw new Error(`Option with text "${optionText}" not found`);
  },
};
