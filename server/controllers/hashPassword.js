const bcrypt = require("bcrypt");
require('dotenv').config();

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return{hash, salt};
    } catch (error) {
        console.error("Error while hasing password: ", error);
    }
};
module.exports = { hashPassword };