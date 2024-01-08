
// RandomGenerator.js
class RandomGenerator {
    
    async generateRandomName(name) {
        const prefix = "API_Aut_" + name;
        const randomString = Math.random().toString(36).substring(7); // Generates a random string
        const randomName = (`${prefix}_${randomString}`).toString();
        return randomName;
    };

    async generateShortCode() {
        const randomString = Math.random().toString(36).substring(2,8); // Generates a random string
        const randomName = (`${randomString}`).toString();
        return randomName;
    };

    async getRandomInt() {
        return Math.floor(Math.random() * 90 + 10); // Generates a number between 10 and 99
    };
  };
  
  export default new RandomGenerator;
  