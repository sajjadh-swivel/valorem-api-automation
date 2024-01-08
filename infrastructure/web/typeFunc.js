
import configs from "../../config.json" assert { type: "json" };
import timeOutManager from "./timeOutManager.js";



export default {

     /**
   * Type command
   *   - Wait for element to display
   *    -Clear the value
   *    - Add value
   */
    
     type :async function(element, value) {
        let count = timeOutManager.getRetryCount();
        //console.log(count)
        let retryInterval = configs.RETRY_INTERVAL
        try {
            await element.waitForDisplayed(1000);
            try {
                element.clearValue();
            } 
            catch (err) {
                console.error("Exception thrown:", err + this.element, "not visible");
                              } 
    
            while (count > 0) {
                try {
                    count--;
                    let ele = await element.isDisplayed();
                    if (ele) {
                        try {
                            await element.addValue(value);
                            break;
                        } catch (err) {
                            console.error("Exception thrown:", err + " object is display but it is disable");
                            throw err
                        }
                    }
                    else {
                        browser.pause(retryInterval);
                    }
                }
                catch (err) {
                    if (!count > 0) {
                        throw err
                    }
                }
            }
        }
        catch (err) {
            console.error("Exception thrown:", err + this.element + "not loaded");
            throw err;
        }
    }
}