import * as fs from 'fs';
import * as os from 'os';


class updateEnvFile{
// /**
//  * Update values in the .env file.
//  * @param {string} key - The key to update in the .env file.
//  * @param {string} value - The new value for the key.
//  * @returns {void}
//  */
async updateFile(key, value) {
    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
    await browser.pause(3000);
 };


 async updateAttributeEnv (attrName, newVal){
    var dataArray = fs.readFileSync("./.env",'utf8').split('\n');

    var replacedArray = dataArray.map((line) => {
        if (line.split('=')[0] == attrName){
            return attrName + "=" + String(newVal);
        } else {
            return line;
        }
    })

    fs.writeFileSync("./.env", "");
    for (let i = 0; i < replacedArray.length; i++) {
        fs.appendFileSync("./.env", replacedArray[i] + "\n"); 
    }
}
};

export default new updateEnvFile;
