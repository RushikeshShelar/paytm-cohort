const mongoose = require('mongoose');

try {
    mongoose.connect("mongodb://127.0.0.1:27017/paytm")
        .then(() => {
            console.log("Connected to database");
        })

} catch (error) {
    console.log("[CONNECTION_ERROR]", error);
};

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 6,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLenght: 8,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    salt: {
        type: String,
        required: true,
    },
})

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
}