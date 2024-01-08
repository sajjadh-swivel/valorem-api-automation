import { expect } from "chai";
import axios from 'axios';
import randomGenerator from "../../../utils/randomGenerator.js"
// require('dotenv').config();

const ACCESS_TOKEN="924c884626325dcb7e34b7c6d3e8d74311e2f3285aae0935ed8c0448c2e94208";
const api_root = "https://admin.dev.vlrmnetworks.com.au";
import webActions from "../../../infrastructure/web/webActions.js";
import post_action from "../api_actions/post_action.js";


/* TODO
  - Need to fix the Auth for the below APIs
  - X-api-key no longer valid as its part of the legacy api key and removed.
*/




describe("Client Onboarding APIs", () => {

  it("TC001 Verify Creating an organization successfully", async () => {
    const userData = {
      "name": await randomGenerator.generateRandomName("Organization"),
      "address": {
        "formattedAddress": "Queen Street, Brisbane, QLD, 4001",
        "addressComponents": {
          "streetName": "Queen Street",
          "suburb":"Brisbane",
          "state": "QLD",
          "postalCode": "4001"
        }
      },    
      "lowFundsThreshold": 5000
    };
    const config = {
      headers: { "x-api-key": "01H9FG211C9KVPPDANYX414SZP"}
    };
    await post_action.send_Post_Request("organisations", userData, config, 200)
  }); 

  it("TC002 Verify Creating Organization with duplicate Name", async () => {
    const userData = {
      "name": "API_Automation_Organization_99muso",
      "address": {
        "formattedAddress": "Queen Street, Brisbane, QLD, 4001",
        "addressComponents": {
          "streetName": "Queen Street",
          "suburb":"Brisbane",
          "state": "QLD",
          "postalCode": "4001"
        }
      },    
      "lowFundsThreshold": 5000
    };
    const config = {
      headers: { "x-api-key": "01H9FG211C9KVPPDANYX414SZP"}
    };
    await post_action.send_Post_Request("organisations", userData, config, 409)
  });
  
  it("TC003 Verify Creating Organization without Name", async () => {
    const userData = {
      "name": await randomGenerator.generateRandomOrganizationName(),
      "address": {
        "formattedAddress": "Queen Street, Brisbane, QLD, 4001",
        "addressComponents": {
          "streetName": "Queen Street",
          "suburb":"Brisbane",
          "state": "QLD",
          "postalCode": "4001"
        }
      },    
      "lowFundsThreshold": 5000
    };
    const config = {
      headers: { "x-api-key": "01H9FG211C9KVPPDANYX414SZP"}
    };
    await post_action.send_Post_Request("organisations", userData, config, 409)
  }); 

  it("TC004 Verify Creating Organization without address", async () => {
    const userData = {
      "name": await randomGenerator.generateRandomName("Organization"),
      "address": {
        "formattedAddress": "",
        "addressComponents": {
          "streetName": "Queen Street",
          "suburb":"Brisbane",
          "state": "QLD",
          "postalCode": "4001"
        }
      },    
      "lowFundsThreshold": 5000
    };
    const config = {
      headers: { "x-api-key": "01H9FG211C9KVPPDANYX414SZP"}
    };
    await post_action.send_Post_Request("organisations", userData, config, 409)
  }); 

  it.only("TC005 Verify Creating Organization without postal code", async () => {
    const userData = {
      "name": await randomGenerator.generateRandomName("Organization"),
      "address": {
        "formattedAddress": "Queen Street, Brisbane, QLD, 4001",
        "addressComponents": {
          "streetName": "Queen Street",
          "suburb":"Brisbane",
          "state": "QLD",
          "postalCode": ""
        }
      },    
      "lowFundsThreshold": 5000
    };
    const config = {
      headers: { "x-api-key": "01H9FG211C9KVPPDANYX414SZP"}
    };
    await post_action.send_Post_Request("organisations", userData, config, 409)
  }); 

  it("TC005 Verify Creating organization admin successfully", async () => {
    
    function callBack(response){
      if (response.data && response.data.userId) {
        const userId = response.data.userId;
        console.log('Captured Ticket Value:', userId);
        return userId;
      } else {
        console.log('Response does not contain a relevant userId value.');
        throw error;
      };
    };

    const randNum = await randomGenerator.getRandomInt();
    const randEmail = `sajjadh+${randNum}@swivelgroup.com.au`
    const userData = {
      "firstName": "test",
      "lastName": "Sajjadh",
      "email": randEmail,
      "verifyEmail": true,
      "emailVerified": true,
      "mobileNumber":"+61499570199",
      "role": "Organisation Administrator"
    };

    const config = {
      headers: { "x-api-key": "01H9FG211C9KVPPDANYX414SZP"}
    };
    try {
      const returnValue = await post_action.send_Post_Request("organisations/01HB0TKX7JA8YEE7ZSV559VHR7/users",userData, config,200, callBack)
      console.log("Returned Value: " + returnValue);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    };
  }); 

  it("TC006 Verify inviting the organization admin successfully", async () => {

    // function callBack(response){
    //   if (response.data && response.data.ticket) {
    //     const ticket = response.data.ticket;
    //     console.log('Captured Ticket Value:', ticket);
    //     return ticket;
    //   } else {
    //     console.log('Response does not contain a relevant ticket value.');
    //     return null;
    //   };
    // };
  
    const userData = {
      "userId": process.env.ORGANIZATION_ADMIN_ID,
      "email": process.env.ORGANIZATION_ADMIN_EMAIL
    };
    const config = {
      headers: { "x-api-key": "01H9FG211C9KVPPDANYX414SZP"}
    };

    try {
      const returnValue = await post_action.send_Post_Request("organisations/01HA7Z6Y81KT8NH0DWCC4HC813/users/invite",userData, config,200)
      console.log("Returned Value: " + returnValue.data.ticket);
      await browser.url(returnValue);
      const element1 = await $('//input[@placeholder="your new password"]');
      const element2 = await $('//input[@placeholder="confirm your new password"]');
      const element3 = await $('//button[@type="submit"]');
      await element1.setValue("Asd@1234")
      await element2.setValue("Asd@1234")
      await element3.click();
      await browser.pause(5000);
    } catch (error) {
      console.error('Error:', error);
      if(error.response.status == 400){
        console.log("Error is 400")
      } else {
        throw error;
      }
      
    };
  }); 
});
