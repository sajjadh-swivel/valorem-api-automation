import timeOutManager from "./timeOutManager.js";
import webActions from "./webActions.js";
import path from 'node:path'


export default {
    /**
     * File upload
     *   - Wait for element to display
     * - Get the file path and input the file path
     */
    FileUpload: async function (element, filePath) {
        let retryCount = timeOutManager.getRetryCount();
        const fileLocation = path.join(filePath);
        const remoteFilePath = await browser.uploadFile(fileLocation)
        try {
            let ele = await element.waitForDisplayed(1000);
            if (ele) {
                try {
                    while (retryCount > 0) {
                        try {
                            retryCount--;
                            await webActions.type(element, remoteFilePath);
                            break;
                        } catch (error) {
                            if (!retryCount > 0) {
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
    }

}