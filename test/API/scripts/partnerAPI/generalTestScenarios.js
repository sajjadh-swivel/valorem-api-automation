import { expect } from "chai";
import axios from 'axios';
import randomGenerator from "../../../../utils/randomGenerator.js"
const baseUrl = process.env.base_url;
import webActions from "../../../../infrastructure/web/webActions.js";
import 'dotenv/config';
import updateEnvFile from "../../../../utils/updateEnvFile.js"


/*
  UPDATE THE FOLLOWING PARAMETERS IN THE ENV FILE BEFORE EXECUTING THE SCRIPT. 
   - Bearer_Token_Manual
   - ORGANIZATION_ID
   - YOU CAN USE EITHER AN EXISTING ORGANIZATION OR A NEW ORGANIZATION
*/

//This test suit contains general and negative test scenarios for Partner APIs 
describe("Partner APIs Happy Path & Negative Scenarios", () => {
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
  let tipSheetID
  let allocationId_01;
  let allocationId_02;
  let allocationId_03;
  const token = process.env.Bearer_Token_Manual;

  //the below script will only require to run when a new organization is created, otherwise can skip it
  it("TC001 Verify adding organization setup Successfully", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"organisations"
    const userData = {
      "setupType":"Manual",
      "setupStatus":"PendingLocationSetup"
      }

    const config = {
      headers: { "Authorization": token}
    };
    
    try {
      const response = await axios.patch(url, userData, config);
      console.log("response Data = ", response)
      expect(response.status).to.equal(200);
      webActions.logInfo(response.data);
      return response;
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });

  it("TC002 Verify adding organization setup - Invalid request body", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"organisations"
    const userData = {
      "setupType":"",
      "setupStatus":"PendingLocationSetup"
      }

    const config = {
      headers: { "Authorization": token}
    };
    
    try {
      const response = await axios.patch(url, userData, config);
      console.log("response Data = ", response)
      expect(response.status).to.equal(400);
      webActions.logInfo(response.data);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });

  it("TC003 Verify Get Organization Details", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"organisations"
    const config = {
      headers: { "Authorization": token}
    };
    try {
      const response = await axios.get(url, config);
      console.log("response Data = ", response.data);
      expect(response.status).to.equal(200);
      webActions.logInfo(response.data);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });
  
  it("TC003 Verify creating location successfully", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations";
    const randLocationName = await randomGenerator.generateRandomName("Location");
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

  it("TC004 Verify creating location - without location name", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations";
    const randLocationName = await randomGenerator.generateRandomName("Location");
    const userData = {
      "name": "",
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
      expect(response.status).to.equal(400); 
      webActions.logInfo(response.data);
      console.log("Response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });


  it("TC005 Verify creating location - without Address", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations";
    const randLocationName = await randomGenerator.generateRandomName("Location");
    const userData = {
      "name": randLocationName,
      "address": {
        "formattedAddress": "",
        "addressComponents": {
          "streetName": "",
          "suburb":"",
          "state": "",
          "postalCode": ""
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
      expect(response.status).to.equal(400); 
      webActions.logInfo(response.data);
      console.log("Response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });


  it("TC006 Verify Updating the created location", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID;
    const randLocationName = await randomGenerator.generateRandomName("Location");
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
      const response = await axios.patch(url, userData, config);
      expect(response.data.name).to.equal(randLocationName); //asserting the response
      expect(response.status).to.equal(200);
      updateEnvFile.updateFile("LOCATION_NAME", randLocationName);  // update location name
      locationName = randLocationName
      console.log("Response Data = ", response.data);
      webActions.logInfo(response.data);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });

  it("TC007 Verify Updating the created location - without loc name", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID;
    const randLocationName = await randomGenerator.generateRandomName("Location");
    const userData = {
      "name": "",
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
      expect(response.status).to.equal(400); 
      webActions.logInfo(response.data);
      console.log("Response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });

  it("TC008 Verify Updating the created location - without loc address", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID;
    const randLocationName = await randomGenerator.generateRandomName("Location");
    const userData = {
      "name": randLocationName,
      "address": {
        "formattedAddress": "",
        "addressComponents": {
          "streetName": "",
          "suburb":"",
          "state": "",
          "postalCode": ""
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
      expect(response.status).to.equal(400); 
      webActions.logInfo(response.data);
      console.log("Response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });


//adding opening days
it("TC009 Verify adding opening days successfully", async () => {  
//  const token = process.env.Bearer_Token;
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

it("TC009 Verify adding opening days - without openDays", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
      "openingDays": "",
      "setupStatus": "PendingPayRunSettings"
  
    };
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("Response Data = ", response.data)
    webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});

it("TC010 Verify adding opening days - Invalid openDays", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
      "openingDays": "456456456456546",
      "setupStatus": "PendingPayRunSettings"
  
    };
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("Response Data = ", response.data)
    webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});


it("TC011 Verify adding Pay Run Setting successfully", async () => {  
//  const token = process.env.Bearer_Token;
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

it("TC012 Verify adding Pay Run Setting - without frequency", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;

  const userData = {
    "setupStatus": "PendingTipSettings",
    "tipRunSettings": {
      "frequency": ""
    }
  };
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("Response Data = ", response.data)
    webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});

it("TC013 Verify adding Pay Run Setting - Invalid frequency", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;

  const userData = {
    "setupStatus": "PendingTipSettings",
    "tipRunSettings": {
      "frequency": "THISISINVALID123"
    }
  };
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("Response Data = ", response.data)
    webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});

it("TC014 Verify adding Tip Setting Successfully", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
    "setupStatus": "PendingShifts",
    "tipSettings": {
      "calculationMethod": "byShift",
      "calculationPooling":"percentBased",
      "pointAllocation": "individual",
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

it("TC015 Verify adding Tip Setting - Without calculationMethod", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
    "setupStatus": "PendingShifts",
    "tipSettings": {
      "calculationMethod": "",
      "calculationPooling":"percentBased",
      "pointAllocation": "individual",
      "splitByTipMethod": false    
    }
  };
  
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("Response Data = ", response.data)
    webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});

it("TC015 Verify adding Tip Setting - Invalid calculationMethod", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
    "setupStatus": "PendingShifts",
    "tipSettings": {
      "calculationMethod": 123,
      "calculationPooling":"percentBased",
      "pointAllocation": "individual",
      "splitByTipMethod": false    
    }
  };
  
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("Response Data = ", response.data)
    webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});

it("TC015 Verify adding Tip Setting - Without calculationPooling", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
    "setupStatus": "PendingShifts",
    "tipSettings": {
      "calculationMethod": "byShift",
      "calculationPooling":"",
      "pointAllocation": "individual",
      "splitByTipMethod": false    
    }
  };
  
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.data.id).to.be.empty();
    console.log("Response Data = ", response.data)
  } catch (error) {
      throw error;
  };
});

it("TC015 Verify adding Tip Setting - Invalid calculationPooling", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID;
  const userData = {
    "setupStatus": "PendingShifts",
    "tipSettings": {
      "calculationMethod": "byShift",
      "calculationPooling":234234,
      "pointAllocation": "individual",
      "splitByTipMethod": false    
    }
  };
  
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("Response Data = ", response.data)
    webActions.logInfo(response.data);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});


  it("TC0016 Verify getting all locations", async () => {  
  //  const token = process.env.Bearer_Token;
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


  it("TC0017 Verify Creating shift without shift name", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts";
    const userData = {
      "name": "",
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
      console.log("Response Datas = ", response.data)
      expect(response.status).to.equal(400);
    } catch (error) {
      throw error;
    };
  });

  it("TC018 Verify Creating shift with Invalid start/end time", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts";
    const userData = {
      "name": "Breakfast",
      "startTime": 1234,
      "endTime": "Time",
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
      expect(response.status).to.equal(400); //assertions
      console.log("Response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });

  it("TC019 Verify Creating shift without start/end time", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts";
    const randShiftName = await randomGenerator.generateRandomName("Shift");
    const userData = {
      "name": "Breakfast",
      "startTime": "04:00",
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
      expect(response.status).to.equal(400); //assertions
      console.log("Response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });

  it("TC0020 Verify Creating shift 1", async () => {  
  //  const token = process.env.Bearer_Token;
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

  it("TC0020_B Verify Creating shift 2", async () => {  
  //  const token = process.env.Bearer_Token;
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

  it("TC0020_C Verify Creating shift 3", async () => {  
  //  const token = process.env.Bearer_Token;
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
  
  it("TC021 Verify update shifts", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts/" + shiftID_01;
    const randShiftName = await randomGenerator.generateRandomName("Shift");
    const userData = {
      "name": randShiftName,
      "startTime": "16:00",
      "endTime": "22:00",
      "daysOfWeek": "127",
      "metadata": {
          "colour": "#0000FF"
       }
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      expect(response.status).to.equal(200);
      expect(response.data.id).to.be.not.empty;
      expect(response.data.name).to.equal(randShiftName);

      updateEnvFile.updateFile("SHIFT_NAME", randShiftName); 

      console.log("Response Data = ", response.data)
      webActions.logInfo(response.data);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });

  it("TC022 Verify get all shifts", async () => {  
  //  const token = process.env.Bearer_Token;
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

  //>>>>>>>>>>>>>>> Shift Days Of Week <<<<<<<<<<<<<<<<<<<<<<<
  
  it("TC024 Verify adding Shift Days with empty data", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts/" + shiftID_01;
    const daysOfWeek = 127;
    const userData = {
      "daysOfWeek": ""
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      webActions.logInfo("URL => ", url)
      expect(response.status).to.equal(400);
      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });

  it("TC025 Verify adding Shift Days with invalid data type", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts/" + shiftID_01;
    const daysOfWeek = 127;
    const userData = {
      "daysOfWeek": "127"
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      webActions.logInfo("URL => ", url)
      expect(response.data.id).to.be.empty();
      console.log("response Data = ", response.data)
    } catch (error) {
        throw error;
    };
  });


  it("TC026_A Verify adding Shift_1 Days", async () => {
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts/" + shiftID_01;
    const daysOfWeek = 127;
    const userData = {
      "daysOfWeek": daysOfWeek
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      webActions.logInfo("URL => ", url)
      expect(response.status).to.equal(200);
      expect(response.data.daysOfWeek).to.equal(daysOfWeek);
      console.log("response Data = ", response.data)
  
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response.data);
      throw error;
    };
  });

  it("TC026_B Verify adding Shift_2 Days", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts/" + shiftID_02;

    const daysOfWeek = 127;
    const userData = {
      "daysOfWeek": daysOfWeek
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      webActions.logInfo("URL => ", url)
      expect(response.status).to.equal(200);
      expect(response.data.daysOfWeek).to.equal(daysOfWeek);
      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response.data);
      throw error;
    };
  });

  it("TC026_C Verify adding Shift_3 Days", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/shifts/" + shiftID_03;
    const daysOfWeek = 127;
    const userData = {
      "daysOfWeek": daysOfWeek
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      webActions.logInfo("URL => ", url)
      expect(response.status).to.equal(200);
      expect(response.data.daysOfWeek).to.equal(daysOfWeek);
      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response.data);
      throw error;
    };
  });

  
  it("TC026_D Update the setup status", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID;
    const userData = {
      "SETUP_STATUS": "PendingWorkAreas"
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      expect(response.status).to.equal(200);
  
      updateEnvFile.updateFile("SETUP_STATUS", response.data.setupStatus); 

      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response.data);
      throw error;
    };
  });

  it("TC027 Verify create work area with empty name", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/workareas";
    const randWorkAreaName = await randomGenerator.generateRandomName("WA");
    const userData = {
      "name": "", 
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      expect(response.status).to.equal(400);
      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });

  it("TC028 Verify create work area with integer work area name", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/workareas";
    const randWorkAreaName = await randomGenerator.generateRandomName("WA");
    const userData = {
      "name":1234, 
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      expect(response.status).to.equal(400);
      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });


  it("TC029_A Verify create Work_Area_1", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/workareas";
    const randWorkAreaName = await randomGenerator.generateRandomName("WA");
    const userData = {
      "name": randWorkAreaName
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

  it("TC029_B Verify create WorkArea_2", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/workareas";
    const randWorkAreaName = await randomGenerator.generateRandomName("WA");
    const userData = {
      "name": randWorkAreaName
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.post(url, userData, config);
      expect(response.data.id).to.be.not.empty;
      expect(response.status).to.equal(200);
      expect(response.data.name).to.equal(randWorkAreaName);
      
      updateEnvFile.updateFile("WORK_AREA_ID_2", response.data.id); //update the location id & name
      updateEnvFile.updateFile("WORK_AREA_NAME_2", response.data.name); 
      workAreaID_02 = response.data.id

      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response.data);
      throw error;
    };
  });

  it("TC029_C Verify create WorkArea_3", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/workareas";
    const randWorkAreaName = await randomGenerator.generateRandomName("WA");
    const userData = {
      "name": randWorkAreaName
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.post(url, userData, config);
      expect(response.data.id).to.be.not.empty;
      expect(response.status).to.equal(200);
      expect(response.data.name).to.equal(randWorkAreaName);
      
      updateEnvFile.updateFile("WORK_AREA_ID_3", response.data.id); //update the location id & name
      updateEnvFile.updateFile("WORK_AREA_NAME_3", response.data.name); 
      workAreaID_03 = response.data.id
      
      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response.data);
      throw error;
    };
  });

  it("TC029_D Update the setup status", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID;
    const userData = {
      "setupStatus": "PendingWorkAreaPools"
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

  it("TC030 Verify get all Work Area", async () => {  
  //  const token = process.env.Bearer_Token;
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


  it("TC031 Verify adding Percentage Split", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID ;
    const randWorkAreaName = await randomGenerator.generateRandomName("WA");
    const userData = {
      "tipSettings": {
          "calculationPooling": "percentBased",
          "calculationMethod": "byShift",
          "pointAllocation": "individual",
          "splitByTipMethod": true,
          "pools": [
              {
                  "name": "Group 1",
                  "percent": 80,
                  "workAreas": [
                    workAreaID_01
                  ]
              },
              {   
                  "name": "Remaining group",
                  "workAreas": [
                    workAreaID_02,
                    workAreaID_03
                  ]
              }
          ]
      }
    };
    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData, config);
      expect(response.status).to.equal(200);//assertion
      expect(response.data.id).to.be.not.empty;
      console.log("response Data = ", response.data)
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });

  it("TC032_A Update the setup status", async () => {  
  //  const token = process.env.Bearer_Token;
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


  // it("TC033 Verify delete Work Area", async () => {  
  // //  const token = process.env.Bearer_Token;
  //   const url = baseUrl+"locations/" + locationID + "/workareas/API_Automation_WA_02yktn";
  //   const config = {
  //     headers: { "Authorization": token}
  //   };

  //   try {
  //     const response = await axios.delete(url, config);
  //     expect(response.status).to.equal(200);
  //     console.log("response Data = ", response.data)
  //   } catch (error) {
  //     console.error('Axios Request Error:', error.response);
  //     webActions.logInfo(error.response.data);
  //     throw error;
  //   };
  // });


//>>>>>>>>>>>>>>>> EMPLOYEE <<<<<<<<<<<<<<<<<<<
it("TC034 Verify Creating employee", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"employees";
  const randDigits = await randomGenerator.getRandomInt();
  const randNumber = "+614992013" + randDigits ;
  const fName = "Sajja" + randDigits;
  const userData = {
    "mobileNumber": randNumber,
    "email": "sajjadh103@swivelgroup.com.au",
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

it("TC035 Verify Creating employee without name", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"employees";
  const randDigits = await randomGenerator.getRandomInt();
  const randNumber = "+614992113" + randDigits ;
  const fName = "Sajja" + randDigits;
  const userData = {
    "mobileNumber": randNumber,
    "email": "sajjadh13@swivelgroup.com.au",
    "firstName": "",
    "lastName": "",
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
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});

it("TC036 Verify Creating employee without email", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"employees";
  const randDigits = await randomGenerator.getRandomInt();
  const randNumber = "+614992113" + randDigits ;
  const fName = "Sajja" + randDigits;
  const userData = {
    "mobileNumber": randNumber,
    "email": "",
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
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});

it("TC037 Verify Creating employee without location details", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"employees";
  const randDigits = await randomGenerator.getRandomInt();
  const randNumber = "+614992113" + randDigits ;
  const fName = "Sajja" + randDigits;
  const userData = {
    "mobileNumber": randNumber,
    "email": "sajjadh13@swivelgroup.com.au",
    "firstName": fName,
    "lastName": "Doe",
    "isEligibleForTips" : true,
    "locations": [
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
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(400);
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    expect(error.response.status).to.equal(400);
    if(error.response.status !== 400){
      throw error;
    };  
  };
});

  it("TC038 Verify delete Work Area when employee exist", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"locations/" + locationID + "/workareas/" +workAreaID_01;
    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.delete(url, config);
      expect(response.status).to.equal(400);
      console.log("response Data = ", response.data)
    }  catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });

  it("TC039 Verify invite employee without employee ID", async () => {  
  //  const token = process.env.Bearer_Token;
    const url = baseUrl+"employees/invitations";
  
    const userData = {
      "employeeIds": []
      };
  
    const config = {
      headers: { "Authorization": token}
    };
  
    try {
      const response = await axios.delete(url, config);
      expect(response.status).to.equal(400);
      console.log("response Data = ", response.data)
    }  catch (error) {
      console.error('Axios Request Error:', error.response);
      expect(error.response.status).to.equal(400);
      if(error.response.status !== 400){
        throw error;
      };  
    };
  });

it("TC040 Verify invite employee successfully", async () => {  
//  const token = process.env.Bearer_Token;
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


it("TC018_A Update the setup status", async () => {  
//  const token = process.env.Bearer_Token;
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

it("TC018_B Update the setup status", async () => {  
//  const token = process.env.Bearer_Token;
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


it("TC041 Verify Create Tip Sheet Successfully", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/"+ locationID +"/tips";
  const userData = {
  };
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.post(url,userData, config);
    expect(response.status).to.equal(200);//assertion
    // updateEnvFile.updateFile("TIP_ID", response.data.allocations[0].tipsId); //update the env file 
    console.log("response Data = ", response.data)
    tipSheetID = response.data.allocations[0].tipsId;

    console.log("response Data = ", response.data)
    console.log("Allocation = --> ", response.data.allocations)
    allocationId_01 = response.data.allocations[0].allocationId;
    allocationId_02 = response.data.allocations[1].allocationId;
    allocationId_03 = response.data.allocations[2].allocationId;

  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});


it("TC042 Verify add Employee to tip sheet", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID+"/tips/"+ tipSheetID+ "/employees";
  const userData = [employeeID];
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.post(url, userData, config);
    expect(response.status).to.equal(200);//assertion

  } catch (error) {
    console.error('Axios Request Error:', error.response);
    throw error;
  };
});

//check the test case name
it("TC043 Verify Add tips amount", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/"+ locationID +"/tips/" + tipSheetID;
  const userData = {
    "totalTips": [
        {
            "tipMethod": "cash",
            "amount": 18
        },
        {
            "tipMethod": "card",
            "amount": 18
        },
        {
            "tipMethod": "external",
            "amount": 0
        }
    ]
  };

  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url,userData, config);
    expect(response.status).to.equal(200);//assertion
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});


it("TC044 Verify tip allocation", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID+"/tips/"+ tipSheetID + "/allocations";
  const userData = [
    {
      "allocationId" : allocationId_01,
      "isOpen": true,
      "tips":[
        {
          "amount": 5,
          "tipMethod": "cash"
        },
        {
          "amount": 5,
          "tipMethod": "card"
        },
        {
          "amount": 0,
          "tipMethod": "external"
        }
      ]
    },
    {
      "allocationId" : allocationId_02,
      "isOpen": true,
      "tips":[
        {
          "amount": 6,
          "tipMethod": "cash"
        },
        {
          "amount": 6,
          "tipMethod": "card"
        },
        {
          "amount": 0,
          "tipMethod": "external"
        }
      ]
    },
    {
      "allocationId" : allocationId_03,
      "isOpen": true,
      "tips":[
        {
          "amount": 7,
          "tipMethod": "cash"
        },
        {
          "amount": 7,
          "tipMethod": "card"
        },
        {
          "amount": 0,
          "tipMethod": "external"
        }
      ]
    }
  ]

  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.patch(url, userData, config);
    expect(response.status).to.equal(200);//assertion
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});


it("TC045 Verify Employee allocation 2", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"locations/" + locationID+"/tips/"+ tipSheetID + "/allocations/employees";
  const userData = [
      {
          "allocationId": allocationId_01,
          "employeeId": employeeID,
          "amount": 7.5,
          "startTime": "02:00",
          "endTime": "08:30"
      },
      {
          "allocationId": allocationId_02,
          "employeeId": employeeID,
          "amount": 7.5,
          "startTime": "10:00",
          "endTime": "19:00"
      },
      {
          "allocationId": allocationId_03,
          "employeeId": employeeID,
          "amount": 7.5,
          "startTime": "19:30",
          "endTime": "23:30"
      }
  
  ];
  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.put(url, userData, config);
    expect(response.status).to.equal(200);//assertion
    // updateEnvFile.updateFile("TIP_ID", response.data.allocations[0].tipsId); //update the env file 
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});


it("TC046 Verify Add Funds", async () => {  
//  const token = process.env.Bearer_Token;
  const url = "https://e2e.dev.vlrmnetworks.com.au/organisations/" + process.env.ORGANIZATION_ID+"/locations/" + locationID+"/funds/topup";
  const userData = 
  {
    "amount":300
  };

  const config = {
    headers: { 
      "x-api-key": "01H94ZGDKHT2C0BVZ1PWHVQKY4",
    }
  };

  try {
    const response = await axios.post(url, userData, config);
    expect(response.status).to.equal(200);//assertion
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});

it("TC047 Verify Process Disbursement successfully", async () => {
//  const token = process.env.Bearer_Token;
  const url = "https://e2e.dev.vlrmnetworks.com.au/organisations/" + process.env.ORGANIZATION_ID+"/locations/" + locationID+"/funds/topup";
  const userData = 
  {
    "amount":300
  };

  const config = {
    headers: { 
      "x-api-key": "01H94ZGDKHT2C0BVZ1PWHVQKY4",
    }
  };

  try {
    const response = await axios.post(url, userData, config);
    expect(response.status).to.equal(200);//assertion
    // updateEnvFile.updateFile("TIP_ID", response.data.allocations[0].tipsId); //update the env file 
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
});

it.skip("TC048 Verify updating employee details successfully", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"employees/" + employeeID;
  const randDigits = await randomGenerator.getRandomInt();
  const randNumber = "+614331112" + randDigits 
  const userData = {
    "mobileNumber": randNumber,
    "email": "sajjadh@swivelgroup.com.au",
    "firstName": "John",
    "lastName": "Doe",
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
    const response = await axios.patch(url, userData, config);
    expect(response.data.id).to.be.not.empty;
    expect(response.status).to.equal(200);
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    throw error;
  };
 });


 it("TC049 Verify Get employee details by ID", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"employees/" + employeeID;

  const config = {
    headers: { "Authorization": token}
  };

  try {
    const response = await axios.get(url, config);
    expect(response.data.id).to.be.not.empty;
    expect(response.status).to.equal(200);
    console.log("response Data = ", response.data)
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response.data);
    throw error;
  };
 });

 it("TC050 Verify Get all employee", async () => {  
//  const token = process.env.Bearer_Token;
  const url = baseUrl+"employees";

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

});
