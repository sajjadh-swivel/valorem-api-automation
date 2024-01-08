import configs from "../config.json" assert { type: "json" };
// import timeOutManager from "../infrastructure/web/timeOutManager.js";

export function getCapabilities() {
  /*getCapabilities() function invoke the browser with the browser capabilities
   * @browsername, @maxBrowserInstance get from the config.json, set the
   * @runTimeCapabilities, @runTimeServices and return them.
   */
  let runTimeBrowser = configs.browserName;
  let maxInstance = configs.maxBrowserInstance;
  let runTimeCapabilities = null;
  let runTimeServices = null;

  // Define the common browser configuration as an object
  const commonBrowserConfig = {
    maxInstances: maxInstance,
    timeouts: {
      implicit:
        configs.implicitWait !== ""
          ? parseInt(configs.implicitWait)
          : parseInt(timeOutManager.implicitWait),
      pageLoad:
        configs.pageLoadTimeOut !== ""
          ? parseInt(configs.pageLoadTimeOut)
          : parseInt(timeOutManager.pageLoadTimeOut),
      script:
        configs.scriptTimeOut !== ""
          ? parseInt(configs.scriptTimeOut)
          : parseInt(timeOutManager.scriptTimeOut),
    },
  };

  //Set up the browser configuration based on the runTimeBrowser variable
  if (configs.headless === "false") {
    if (runTimeBrowser == "chrome") {
      runTimeServices = ["chromedriver"];
      runTimeCapabilities = [
        {
          browserName: "chrome",
          "goog:chromeOptions": {
            args: ["start-maximized", "--allow-file-access-from-files"],
          },
          ...commonBrowserConfig, // Spread the common browser config object
        },
      ];
    } else if (runTimeBrowser === "firefox") {
      runTimeServices = ["geckodriver"];
      runTimeCapabilities = [
        {
          browserName: "firefox",
          "moz:firefoxOptions": {
            args: ["--width=1920", "--height=1080"],
          },
          ...commonBrowserConfig, // Spread the common browser config object
        },
      ];
    } else if (runTimeBrowser === "microsoftEdge") {
      runTimeServices = ["edgedriver"];
      runTimeCapabilities = [
        {
          browserName: "MicrosoftEdge",
          "ms:edgeOptions": {
            args: ["--start-maximized"],
          },
          ...commonBrowserConfig, // Spread the common browser config object
        },
      ];
    } else {
      console.log(
        "Browser is undefined, using chrome browser to run the tests"
      );
      runTimeServices = ["chromedriver"];
      runTimeCapabilities = [
        {
          browserName: "chrome",
          "goog:chromeOptions": {
            args: ["start-maximized", "--allow-file-access-from-files"],
          },
          ...commonBrowserConfig, // Spread the common browser config object
        },
      ];
    }
  } else if (configs.headless === "true") {
    if (runTimeBrowser === "chrome") {
      runTimeServices = ["chromedriver"];
      runTimeCapabilities = [
        {
          browserName: "chrome",
          "goog:chromeOptions": {
            args: ["disable-gpu", "headless"],
          },
          ...commonBrowserConfig, // Spread the common browser config object
        },
      ];
    } else if (runTimeBrowser === "firefox") {
      runTimeServices = ["geckodriver"];
      runTimeCapabilities = [
        {
          browserName: "firefox",
          "moz:firefoxOptions": {
            args: ["-headless"],
          },
          ...commonBrowserConfig, // Spread the common browser config object
        },
      ];
    } else if (runTimeBrowser === "microsoftEdge") {
      runTimeServices = ["edgedriver"];
      runTimeCapabilities = [
        {
          browserName: "MicrosoftEdge",
          "ms:edgeOptions": {
            args: ["--headless"],
          },
          ...commonBrowserConfig, // Spread the common browser config object
        },
      ];
    } else {
      console.log(
        "Browser is undefined, using chrome browser to run the tests"
      );
      runTimeServices = ["chromedriver"];
      runTimeCapabilities = [
        {
          browserName: "chrome",
          "goog:chromeOptions": {
            args: ["disable-gpu", "headless"],
          },
          ...commonBrowserConfig, // Spread the common browser config object
        },
      ];
    }
  } else {
    console.log("Browser is undefined, using chrome browser to run the tests");
    runTimeServices = ["chromedriver"];
    runTimeCapabilities = [
      {
        browserName: "chrome",
        "goog:chromeOptions": {
          args: ["--start-maximized", "--allow-file-access-from-files"],
        },
        ...commonBrowserConfig, // Spread the common browser config object
      },
    ];
  }

  const runtimeData = {
    runTimeCapabilities,
    runTimeServices,
  };
  return runtimeData;
}


/* allureEnv function returns the environment details to allure report to display in allure report environment section
   */
export function allureEnv(){
let reportedEnvironmentVars;

if(configs.projectType==="web"||configs.projectType==="web-browser stack"){
  reportedEnvironmentVars ={"Project Type":configs.projectType,"Browser":configs.browserName}
}
else if(configs.projectType==="mobile-web"||configs.projectType==="mobile-web-browser stack"){
  reportedEnvironmentVars = { "Project Type": configs.projectType, "Platform": configs.platformName, "Device Name":configs.deviceName,"Platform Version": configs.platformVersion,"Browser": configs.browserName }
}
else if (configs.projectType==="mobile-native"||configs.projectType==="mobile-native-browser stack"){
  reportedEnvironmentVars = { "Project Type": configs.projectType, "Platform": configs.platformName, "Device Name":configs.deviceName,"Platform Version": configs.platformVersion}
}

return reportedEnvironmentVars
}
