const bcrypt = require('bcrypt');

const saltRounds = process.env.SALT_ROUNDS || 10;

const generateSalt = async () => {
    try {
        return await bcrypt.genSalt(saltRounds);
    } catch (error) {
        console.log("[SALT_GENERATION_ERROR]", error);
    }

}

const generateHashedPassword = async (password, salt) => {
    try {
        return await bcrypt.hash(password, salt);

    } catch (error) {
        console.log("[PASSWORD_HASH_ERROR]", error);
    }
}

const validatePassword = async function (inputPassword, hashedPassword) {
    try {
        const result = await bcrypt.compare(inputPassword, hashedPassword)
        return result;

    } catch (error) {
        console.log("[PASSWORD_VALIDATION_ERROR]", error);
    }
}

module.exports = {
    generateSalt,
    generateHashedPassword,
    validatePassword,
}