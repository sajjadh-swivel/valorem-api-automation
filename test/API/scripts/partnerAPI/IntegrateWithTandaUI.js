import { expect } from "chai";
import axios from 'axios';
import randomGenerator from "../../../../utils/randomGenerator.js"
const baseUrl = process.env.base_url;
import webActions from "../../../../infrastructure/web/webActions.js";
import 'dotenv/config';
import updateEnvFile from "../../../../utils/updateEnvFile.js"
import browserManager from "../../../../infrastructure/web/browserManager.js";
import pageElement from "../../../../utils/pageElement.js";
import generateTandaData from "../../../../utils/generateTandaData.js";

/*
  UPDATE THE FOLLOWING PARAMETERS IN THE ENV FILE BEFORE EXECUTING THE SCRIPT. 
   - Bearer_Token
   - TANDA_USERNAME
   - TANDA_PASSWORD
   - APPLICATION_ID
   - APPLICATION_SECRET
   - REDIRRECT_URI
   - Also make sure to update the above values in lines number 95 & 96
   - MAKE SURE YOU CREATE A NEW ORGANIZATION
*/


describe("Verify integrating with Tanda account", () => {

  const applicationID = process.env.APPLICATION_ID;
  const applicationSecret = process.env.APPLICATION_SECRET;
  const redirectURI = process.env.REDIRRECT_URI;
  const baseURL = "https://portalapp.dev.vlrmnetworks.com.au/"
  const tandaUrl = process.env.TANDA_URL;
  const tandaUserName = process.env.TANDA_USERNAME;
  const tandaPassword = process.env.TANDA_PASSWORD;
  var redirrectURL;
  var authorizationCode;
  var tandaToken;
  var tandaLocationID;
  
  it("TC1 Verify getting authorization code redirrectURL", async () => {  
    const token = process.env.Bearer_Token;
    const url = "https://portal.dev.vlrmnetworks.com.au/wfm/oauth/setup";
    const userData = {
      "clientId": applicationID,
      "clientSecret": applicationSecret,
      "setupType": "Tanda",
      "redirectUri": redirectURI
      };

    const config = {
      headers: { "Authorization": token}
    };

    try {
      const response = await axios.patch(url, userData,config);
      expect(response.status).to.equal(200);
      expect(response.data.redirectUrl).to.be.not.empty;
      redirrectURL = response.data.redirectUrl;
      console.log("RedirrectURL = ", redirrectURL)
      console.log("Response Data = ", response.data)
      webActions.logInfo(response);
    } catch (error) {
      console.error('Axios Request Error:', error.response);
      webActions.logInfo(error.response);
      throw error;
    };
  });

  it("TC02 - Get Tanda Authorization Code", async () => {
    await browser.url(redirrectURL);
    await pageElement.inputTandaEmail.setValue(tandaUserName);
    await pageElement.inputTandaPassword.setValue(tandaPassword);
    await pageElement.btnTandaLogin.click();
    // const stat = await pageElement.btnAuthorize.isDisplayed();
    // if(stat){
    //   await pageElement.btnAuthorize.click();
    // }

    await browser.pause(2000);
    var redirectUrl =  await browser.getUrl();
    console.log("redirectUrls ",await browser.getUrl());
    expect(redirectUrl).to.match(/code=[a-f0-9]+/);
    
    // Create a URL object
    const urlObject = new URL(redirectUrl);
    // Get the search parameters
    const searchParams = urlObject.searchParams;
    // Extract the value of the 'code' parameter
    authorizationCode = searchParams.get('code');
    console.log("Code value:", authorizationCode);
  });

it("TC03 - Get Tanda Token", async () => {
  const url = "https://my.tanda.co/api/oauth/token";
  const userData = {
    "client_id": "318c1a04ada2cf660b00011c674e18953f19dba7c91e31155cd9c61b5e9a9bd1",
    "client_secret": "8288be8fe22412ed6efa11c9e930fe3c44d4390de01e2d97d5d22bdd7a77f132",
    "redirect_uri": redirectURI,
    "code": authorizationCode,
    "grant_type": "authorization_code"
    };

  try {
    const response = await axios.post(url, userData);
    expect(response.status).to.equal(200);
    expect(response.data.access_token).to.be.not.empty;
    tandaToken = response.data.access_token;
    console.log("Tanda Token = ", tandaToken)
    console.log("Response Data = ", response.data)
    webActions.logInfo(response);
  } catch (error) {
    console.error('Axios Request Error:', error.response);
    webActions.logInfo(error.response);
    throw error;
  };
  
  //Update the value according to the need
  const numberOfLocations = 3;
  const numberOfTeamsPerLocation = 1;
  const numberOfUsersPerTeam = 1;

  const Location_ID_List = await generateTandaData.createNewLocation_random_gen(tandaToken, numberOfLocations)
  console.log("LOCATION_IDS----->", Location_ID_List);

  const Team_ID_List = await generateTandaData.createNewTeams_random_gen(tandaToken,Location_ID_List, numberOfTeamsPerLocation, numberOfLocations);
  console.log("TEAM_IDS----->", Team_ID_List);

  const User_ID_List = await generateTandaData.createNewUsers_random_gen(tandaToken,Location_ID_List, Team_ID_List, numberOfUsersPerTeam, numberOfLocations);
  console.log("TEAM_IDS----->", Team_ID_List);

 });
});
