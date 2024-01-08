import { expect } from "chai";
import axios from 'axios';
import randomGenerator from "../../../../utils/randomGenerator.js"
const baseUrl = process.env.base_url;
import webActions from "../../../../infrastructure/web/webActions.js";
import 'dotenv/config';
import updateEnvFile from "../../../../utils/updateEnvFile.js"

//Partner API complex scenario
describe("Verify creating location with tip setting combination 02", () => {

/*
  "calculationMethod": "byHourlyRate",
  "calculationPooling":"global",
  "pointAllocation": "workArea",
  "splitByTipMethod": true
 */ 
 
  let locationID;
  let locationName;
  let setupStatus;
  let shiftID_01;
  let shiftID_02;
  let shiftID_03;
  let workAreaID_01;
  let workAreaID_02;
  let workAreaID_03;
  let employeeID;
  let tipSheetID;
  let allocationId_01;
  let allocationId_02;
  let allocationId_03;

  
  it("TestStep001 Verify creating a new location successfully", async () => {
    const token = process.env.Bearer_Token;
    const url = baseUrl+"locations";
    const randLocationName = await randomGenerator.generateRandomName("Location02");
    const userData = {
      "name": randLocationName,
      "address": {
        "formattedAddress": "Queen Street, Brisbane, QLD, 4001",
        "addressComponents": {
          "streetName": "Queen Street",
          "suburb":"Brisbane",
          "state": "QLD",
          "postalCode": "4001"
        } 
      },    
        "setupStatus": "PendingOpenDays",
        "lowFundsThreshold": 300
    };

    const config = {
      headers: { "Authorization": token}
    };
    
    try {
      const response = await axios.post(url, userData, config);
      expect(response.data.id).to.be.not.empty; //assert the response
      expect(response.status).to.equal(200);
      
      const id = response.data.id;
      console.log("Location ID: " + id)
      updateEnvFile.updateFile("LOCATION_ID", id); //update the location id & name
      updateEnvFile.updateFile("LOCATION_NAME", randLocationName);
      locationID = id;
      webActions.logInfo(response.data);
      console.log("Response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });

//adding opening days
it("TestStep002 Verify adding opening days successfully", async () => {  
  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
      "openingDays": "127",
      "setupStatus": "PendingPayRunSettings"
  
    };
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(200);
    expect(response.data.setupStatus).to.equal("PendingPayRunSettings");

    const status = response.data.setupStatus;
    updateEnvFile.updateFile("SETUP_STATUS", status); 
    setupStatus = status;

    console.log("Response Data = ", response.data)
    webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    throw error;
  };
});


it("TestStep003 Verify adding Pay Run Setting successfully", async () => {  
  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;

  const userData = {
    "setupStatus": "PendingTipSettings",
    "tipRunSettings": {
      "frequency": "daily"
    }
  };
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.data.tipRunSettings).to.be.not.empty;
    expect(response.status).to.equal(200);

    const status = response.data.setupStatus;
    const test = response.data.tipRunSettings.frequency;
    console.log("STATUS :", status);
    updateEnvFile.updateFile("SETUP_STATUS", status);
    console.log("TEST :", test);
    updateEnvFile.updateFile("TIP_RUN_FREQUENCY", test);

    console.log("Response Data = ", response.data)
    // webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    throw error;
  };
});

it("TestStep004 Verify adding Tip Setting Successfully", async () => {  
  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
    "setupStatus": "PendingShifts",
    "tipSettings": {
      "calculationMethod": "byHourlyRate",
      "calculationPooling":"global",
      "pointAllocation": "workArea",
      "splitByTipMethod": true
      
    }
  };
  
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.data.tipSettings.calculationMethod).to.be.not.empty;
    expect(response.status).to.equal(200);
    
    const calculatedMethod = response.data.tipSettings.calculationMethod;
    const pointAllocation = response.data.tipSettings.pointAllocation;
    const calculationPooling = response.data.tipSettings.calculationPooling;

    console.log("calculatedMethod " , calculatedMethod);
    console.log("pointAllocation " , pointAllocation);
    updateEnvFile.updateFile("TIP_CALCULATED_METHOD", calculatedMethod); 
    updateEnvFile.updateFile("TIP_POINT_ALLOCATION", pointAllocation); 
    updateEnvFile.updateFile("SETUP_STATUS", response.data.setupStatus); 
    updateEnvFile.updateFile("TIP_CALCULATION_POOLING", calculationPooling);
    setupStatus = response.data.setupStatus;

    console.log("Response Data = ", response.data)
    webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    throw error;
  };
});

  it("TestStep005 Verify getting all locations", async () => {  
    const token = process.env.Bearer_Token;
    const url = baseUrl+"locations";
    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.get(url, config);
      expect(response.status).to.equal(200);
      expect(response.data[0].id).to.be.not.empty;
      expect(response.data[0].name).to.be.not.empty;
      expect(response.data[0].organisationId).to.be.not.empty;
      console.log("Response Data = ", response.data)
      webActions.logInfo(response.data);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });


  it("TestStep006_A Verify Creating shift 1", async () => {  
    const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts";
    const randShiftName = await randomGenerator.generateRandomName("Shift");
    const userData = {
      "name": "Breakfast",
      "startTime": "04:00",
      "endTime": "11:00",
      "daysOfWeek": "2",
      "metadata": {
          "BackgroundColour": "#000000",
          "TextColour": "#FFFFFF"
       }
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.post(url, userData, config);
      console.log("URL => ", url)
      expect(response.status).to.equal(200); //assertions
      expect(response.data.id).to.be.not.empty;
      expect(response.data.name).to.equal("Breakfast");
      
      const id = response.data.id;
      console.log("Shift ID: " + id)
      updateEnvFile.updateFile("SHIFT_ID_1", id); //update the location id & name
      updateEnvFile.updateFile("SHIFT_NAME_1", "Breakfast"); 
      shiftID_01 = id;

      console.log("Response Data = ", response.data)
      webActions.logInfo(response.data);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });

  it("TestStep006_B Verify Creating shift 2", async () => {  
    const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts";
    const randShiftName = await randomGenerator.generateRandomName("Shift");
    const userData = {
      "name": "Lunch",
      "startTime": "11:30",
      "endTime": "16:00",
      "daysOfWeek": "2",
      "metadata": {
          "BackgroundColour": "#036E45",
          "TextColour": "#FFFFFF"
       }
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.post(url, userData, config);
      console.log("URL => ", url)
      expect(response.status).to.equal(200); //assertions
      expect(response.data.id).to.be.not.empty;
      expect(response.data.name).to.equal("Lunch");
      
      const id = response.data.id;
      console.log("Shift ID: " + id)
      updateEnvFile.updateFile("SHIFT_ID_2", id); //update the location id & name
      updateEnvFile.updateFile("SHIFT_NAME_2", "Lunch"); 
      shiftID_02 = id;

      console.log("Response Status = ", response.status)
      webActions.logInfo(response.data);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });

  it("TestStep006_C Verify Creating shift 3", async () => {  
    const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts";
    const url2 = baseUrl+"locations/" + locationID;
    const userData = {
      "name": "Dinner",
      "startTime": "16:30",
      "endTime": "23:30",
      "daysOfWeek": "2",
      "metadata": {
          "BackgroundColour": "#F5E842",
          "TextColour": "#FFFFFF"
       }
      };

      const userData2 = {
        "setupStatus": "PendingShiftDaysOfWeek"
      }

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.post(url, userData, config);
      console.log("URL => ", url)
      expect(response.status).to.equal(200); //assertions
      expect(response.data.id).to.be.not.empty;
      expect(response.data.name).to.equal("Dinner");
      
      const id = response.data.id;
      console.log("Shift ID: " + id)
      updateEnvFile.updateFile("SHIFT_ID_3", id); //update the location id & name
      updateEnvFile.updateFile("SHIFT_NAME_3", "Dinner"); 
      shiftID_03 = id; 

      console.log("Response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
    
    //update the location setup status
    try {
      const response = await axios.patch(url2, userData2, config);
      expect(response.status).to.equal(200); //assertions
      updateEnvFile.updateFile("SETUP_STATUS", response.data.setupStatus); 
      webActions.logInfo(response.status);
      webActions.logInfo(response.data);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };

  });
  

  it("TestStep007 Get all shifts", async () => {  
    const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts";
    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.get(url, config);
      expect(response.status).to.equal(200);
      webActions.logInfo(response.data);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });


  

  it("TestStep008 Verify create Work_Area_1", async () => {  
    const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/workareas";
    const randWorkAreaName = await randomGenerator.generateRandomName("WA");
    const userData = {
      "name": randWorkAreaName,
      "weightingPoints": 60
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.post(url, userData, config);
      expect(response.data.id).to.be.not.empty;
      expect(response.status).to.equal(200);
      expect(response.data.name).to.equal(randWorkAreaName);
      
      updateEnvFile.updateFile("WORK_AREA_ID_1", response.data.id); //update the location id & name
      updateEnvFile.updateFile("WORK_AREA_NAME_1", response.data.name); 
      workAreaID_01 = response.data.id

      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response.data);
      throw error;
    };
  });



  it("TestStep009 Verify get all Work Area", async () => {  
    const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/workareas";
    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.get(url, config);
      expect(response.data[0].id).to.be.not.empty;
      expect(response.status).to.equal(200);
      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response.data);
      throw error;
    };
  });



  it("TestStep010 Update the setup status", async () => {  
    const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID;
    const userData = {
      "setupStatus": "PendingEmployees"
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      expect(response.status).to.equal(200);//assertion
      updateEnvFile.updateFile("SETUP_STATUS", response.data.setupStatus); //update the env file 
      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response.data);
      throw error;
    };
  });

//>>>>>>>>>>>>>>>> EMPLOYEE <<<<<<<<<<<<<<<<<<<
it("TestStep011 Verify Creating employee", async () => {  
  const token = process.env.Bearer_Token;
  const url = baseUrl+"employees";
  const randDigits = await randomGenerator.getRandomInt();
  const randNumber = "+614992223" + randDigits ;
  const fName = "Saaj" + randDigits;
  const userData = {
    "mobileNumber": randNumber,
    "email": "sajjadh130@swivelgroup.com.au",
    "firstName": fName,
    "lastName": "Doe",
    "isEligibleForTips" : true,
    "locations": [
        {
            "locationId": locationID,
            "workAreaId": workAreaID_01,
            "weightingPoints": 50
        }
    ],
    "address": {
      "formattedAddress": "Queen Street, Brisbane, QLD, 4001",
      "addressComponents": {
        "streetName": "Queen Street",
        "suburb":"Brisbane",
        "state": "QLD",
        "postalCode": "4001"
      }
     }
   };

  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.post(url, userData, config);
    expect(response.data.id).to.be.not.empty;
    expect(response.status).to.equal(200);

    updateEnvFile.updateFile("EMPLOYEE_ID", response.data.id); 
    updateEnvFile.updateFile("EMPLOYEE_MOBILE", response.data.mobileNumber); 
    updateEnvFile.updateFile("SETUP_STATUS", response.data.setupStatus); 
    employeeID = response.data.id;

    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});


it("TestStep00112 invite employee", async () => {  
  const token = process.env.Bearer_Token;
  const url = baseUrl+"employees/invitations";

  const userData = {
    "employeeIds": [employeeID]
    };

  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(200);//assertion
    updateEnvFile.updateFile("SETUP_STATUS", response.data.setupStatus); //update the env file 
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});


it("TestStep013 Update the setup status", async () => {  
  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
    "setupStatus": "PendingEmployeeTipWeighting"
    };

  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(200);//assertion
    updateEnvFile.updateFile("SETUP_STATUS", response.data.setupStatus); //update the env file 
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});

it("TestStep014 Update the setup status", async () => {  
  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
    "setupStatus": "Complete"
    };

  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(200);//assertion
    updateEnvFile.updateFile("SETUP_STATUS", response.data.setupStatus); //update the env file 
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});

// <<<<<<<<<<<<<<<<<<< TIP SHEET >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


it("TestStep015 Create Tip Sheet", async () => {  
  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/"+ locationID +"/tips";
  const userData = {
  };
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.post(url,userData, config);
    expect(response.status).to.equal(200);//assertion
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    throw error;
  };
});

});
