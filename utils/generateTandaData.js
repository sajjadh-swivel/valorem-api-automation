import axios from 'axios';
import * as fs from 'fs';
import { expect } from "chai";
import randomGenerator from './randomGenerator.js'

//This class is used to generate the random data required

// RandomGenerator.js
class generateTandaData {
   
    async createNewLocation_random_gen(tandaToken, numberOfLocations) {
        const url = "https://my.tanda.co/api/v2/locations";
        const locationIds = [];
        const config = {
            headers: { "Authorization": "Bearer "+tandaToken, 'Content-Type': 'application/json'}
          };
          
        for (let index = 0; index < numberOfLocations; index++) {
            const locName = await randomGenerator.generateRandomName("Tanda_Location");  
            const locationCode = await randomGenerator.generateShortCode();
            const locationData =  {
                "name": locName,
                "short_name": locationCode,
                "latitude": 52.5200,
                "longitude": 13.4050,
                "address": "707 Pine Drive"
            }
            console.log("Location Data ------------> ", locationData);
            
            try {
                const response = await axios.post(url, locationData, config);
                console.log('Location created:', response.data);
                expect(response.status).to.equal(201);
                console.log(response.data.id);
                locationIds.push(response.data.id);
                // return response.data.id; // Return the location ID
            } catch (error) {
                console.error('Error creating location:', error);
                throw error;
            }
        };
        return locationIds;
    };

    async createNewTeams_random_gen(tandaToken, locationID, teamsPerLocation, numberOfLocations) {
        const url = "https://my.tanda.co/api/v2/departments";
        const teamIds = [];
        const config = {
            headers: { "Authorization": "Bearer "+tandaToken, 'Content-Type': 'application/json'}
          };
        
          for (let j = 0; j < teamsPerLocation; j++) {

            for (let i = 0; i < numberOfLocations; i++) {
                const teamName = await randomGenerator.generateRandomName("Tanda_Teams");  
                
                const teamData =  {
                    "name": teamName,
                    "location_id": locationID[i],
                    "export_name": "export_"+teamName,
                    "colour": "#FF5733"
                }
                console.log("Team Data ------------> ", teamData);
                try {
                    const response = await axios.post(url, teamData, config);
                    console.log('Team created:', response.data);
                    expect(response.status).to.equal(201);
                    console.log(response.data.id);
                    teamIds.push(response.data.id);
                } catch (error) {
                    console.error('Error creating teams:', error.data);
                    throw error;
                }
            };
          };
        return teamIds;
    };

    async createNewUsers_random_gen(tandaToken, locationsID, teamsID, usersPerTeam, numberOfLocations) {
        const url = "https://my.tanda.co/api/v2/users";
        const userIDs = [];
        const config = {
            headers: { "Authorization": "Bearer "+tandaToken, 'Content-Type': 'application/json'}
          };

          for (let j = 0; j < usersPerTeam; j++) {

            for (let i = 0; i < numberOfLocations; i++) {
                const userName = await randomGenerator.generateRandomName("Tanda_User");  
            
                const userData =  {
                    "name": userName,
                    "export_name": "WGB-1003",
                    "colour": "#FBB830",
                    "location_id": locationsID[i],
                    "department_ids": [
                    teamsID[i]
                    ]
                }
                console.log("User Data ------------> ", userData);
                
                try {
                    const response = await axios.post(url, userData, config);
                    console.log('User created:', response.data);
                    expect(response.status).to.equal(201);
                    console.log(response.data.id);
                    userIDs.push(response.data.id);
                } catch (error) {
                    console.error('Error creating User:', error);
                    throw error;
                }
            };
        };
        return userIDs;
    };
}
  
  export default new generateTandaData;
  