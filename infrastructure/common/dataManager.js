import fs from "fs";
import csv from "csv-parser";
import crypto from "crypto";
import moment from "moment";

export default {
  /* readCsvFile() uses the Node.js fs module and csv-parser library
   * to read and parse a CSV file asynchronously.
   * It returns a promise that resolves to an array of objects,
   * where each object represents a row in the CSV file.
   * @filepath - path of the CSV file
   */
  readCsvFile: async function (filepath) {
    return new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filepath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    });
  },

  /* readPropertiesFile() function is an asynchronous function
   * that reads and parses a properties file.
   * It returns a promise that resolves to an object
   * containing the key-value pairs parsed from the file.
   * @filepath - path of the 'property' file
   */
  readPropertiesFile: async function (filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          const result = {};
          const lines = data.split("\n");
          lines.forEach((line) => {
            if (line.trim() !== "" && line.indexOf("=") > 0) {
              const parts = line.split("=");
              const key = parts[0].trim();
              const value = parts[1].trim();
              result[key] = value;
            }
          });
          resolve(result);
        }
      });
    });
  },

  /*
  Generate random string
  */
  generateRandomString: function () {
    let length = 5;
    let chars = "abcdefghijklmnopqrstuvwxyz";
    let randomBytes = crypto.randomBytes(length);
    let randomStr = "";
    for (let i = 0; i < length; i++) {
      randomStr += chars.charAt(randomBytes[i] % chars.length);
    }
    return randomStr;
  },

  WriteProposalDataToFile: function (prm_PostValues, prm_FilePath) {
    const jsonString = JSON.stringify(prm_PostValues);
    fs.writeFile(prm_FilePath, jsonString, (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    });
  },

  readCSV: function (prm_FilePath) {
    const emails = [];
    const csv = fs.readFileSync(prm_FilePath, "utf-8");

    const rows = csv.split("\n").slice(1);

    rows.forEach((row) => {
      const columns = row.split(",");
      const email = columns[1];
      emails.push(email);
    });
    return emails;
  },

  WriteSignUpDataToFile: async function (prm_PostValues, prm_FilePath) {
    const jsonString = JSON.stringify(prm_PostValues);
    fs.writeFile(prm_FilePath, jsonString, (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    });
  },
  /*
Get the current date
*/
  getCurrentDate: function () {
    const currentDate = moment();
    return currentDate;
  },
};
