const express = require("express");
const jwt = require("jsonwebtoken");

const { User, Account } = require("../db");
const authMiddleware = require("../middleware");
const { JWT_SECRET_TOKEN } = require("../config"); // JWT_SECRET_TOKEN is a string that you can set to anything you want. It is used to sign the JWT token.
const {
    generateHashedPassword,
    generateSalt,
    validatePassword,
} = require("../password"); // These are functions to generate salt and hashed password
const {
    signUpSchema,
    signInSchema,
    updateSchema
} = require("../schemas"); // Using ZOd Schema to validate Wrong inputs

const router = express.Router();

// Path: /user/signup
router.post("/signup", async (req, res) => {
    try {
        const body = req.body;
        const { success } = signUpSchema.safeParse(body);

        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs",
            });
        }

        const existingUser = await User.findOne({
            $or: [{
                username: body.username,
            }, {
                email: body.email
            }]
        });

        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs",
            });
        }

        const salt = await generateSalt();

        const hashedPassword = await generateHashedPassword(body.password, salt);

        //  Create User
        const user = await User.create({
            username: body.username,
            password: hashedPassword,
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            salt,
        });

        const userId = user._id;
        let randombalance = (1 + Math.random() * 10000); //Generate Random amount between 1 to 10000
        randombalance = Math.round((randombalance + Number.EPSILON) * 100) / 100
        // Create Account for the User
        await Account.create({
            userId: userId,
            balance: randombalance
        })

        const token = jwt.sign(
            {
                userId,
            },
            JWT_SECRET_TOKEN,
        );

        return res.status(200).json({
            message: "User created successfully",
            token,
        });
    } catch (error) {
        console.log("[SIGNUP_ERROR]", error);
    }
});

// Path: /user/signin
router.post("/signin", async (req, res) => {
    try {
        const body = req.body;

        const { success } = signInSchema.safeParse(body);

        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs",
            });
        }

        const user = await User.findOne({
            username: body.username,
        });

        if (!user) {
            return res.status(411).json({
                message: "No Users Found",
            });
        }

        const isValidPassword = await validatePassword(
            body.password,
            user.password,
        );

        if (!isValidPassword) {
            return res.status(411).json({
                message: "Incorrect Password",
            });
        }

        const userId = user._id;

        const token = jwt.sign(
            {
                userId,
            },
            JWT_SECRET_TOKEN,
        );

        return res.status(200).json({
            message: "User signed in successfully",
            token,
        });
    } catch (error) {
        console.log("[SIGNIN_ERROR]", error);
    }
});

// Path: /user
router.put("/", authMiddleware, async (req, res) => {
    try {
        const { userId, body } = req;

        const { success } = updateSchema.safeParse(body);

        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs",
            });
        }

        const userExist = await User.findOne({
            _id: userId
        })

        if (!userExist) {
            return res.status(400).json({
                error: "No Users Found"
            })
        }

        const user = await User.findOneAndUpdate(
            {
                _id: userId,
            },
            {
                username: body.username,
                firstName: body.firstName,
                lastName: body.lastName,
            },
            {
                new: true,
            },
        );

        return res.status(200).json({
            user,
            message: "User Updated Succesfuly",
        });
    } catch (error) {
        console.log("[UPDATE_USER_ERROR]", error);
    }
});

// Path /user/bulk?filter=Rushi
router.get("/bulk", async (req, res) => {
    try {
        let filter = req.query.filter || "";
        filter = filter.toLowerCase();

        const filteredUsers = await User.find({
            $or: [
                {
                    firstName: {
                        $regex: filter,
                    },
                },
                {
                    lastName: {
                        $regex: filter,
                    },
                },
                {
                    username: {
                        $regex: filter,
                    },
                },
            ],
        });

        res.json({
            user: filteredUsers.map((user) => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id,
            })),
        });
    } catch (error) {
        console.log("[BULK_ERROR]", error);
    }
});

module.exports = router;
