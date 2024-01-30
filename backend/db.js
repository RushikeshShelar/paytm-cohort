const { model, Schema, connect } = require('mongoose');

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

try {
    connect(process.env.MONGO_DB_URL, clientOptions)
        .then(() => {
            console.log("Connected to database");
        })

} catch (error) {
    console.log("[CONNECTION_ERROR]", error);
};

// Schema for User
const userSchema = new Schema({
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



// Schema for Users account to store Balance
const accountSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId, //Setting Type to OBject ID of MongoDb
        ref: 'User', // Ref to User Model
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

// Creating Models
const Account = model("Account", accountSchema);
const User = model("User", userSchema);

module.exports = {
    User,
    Account,
}