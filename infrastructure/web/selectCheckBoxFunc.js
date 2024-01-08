import timeOutManager from "./timeOutManager.js";
import webActions from "./webActions.js";

export default {
  /**
   * Click Checkbox
   *   - Wait for element to display
   *   - Click on checkbox
   */
  SelectCheckBox: async function (element) {
    let retryCount = timeOutManager.getRetryCount();   
    try {
      let ele= await element.waitForDisplayed(1000);
      if(ele){
        try{
          while (retryCount > 0) {
            try {
              retryCount--;
              await webActions.doClick(element);
              break;
            } catch (error) {
              if (!retryCount > 0) {
                console.error("Exception thrown:", error);
                throw error;
              }
            }
          }
        }catch (error) {
              console.error("Exception thrown:", error);
              throw error;
           }   
          
          } 
    }catch (error) {
      console.error("Exception thrown:", error);
      throw error;
   }  
  }
  
}
