const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");

const { User } = require("../db");
const authMiddleware = require("../middleware");
const { generateHashedPassword, generateSalt, validatePassword } = require("../password"); // These are functions to generate salt and hashed password
const { JWT_SECRET_TOKEN } = require("../config"); // JWT_SECRET_TOKEN is a string that you can set to anything you want. It is used to sign the JWT token.

const router = express.Router();


const signUpSchema = zod.object({
    username: zod.string().min(6).max(30),
    password: zod.string().min(8),
    email: zod.string().email(),
    firstName: zod.string().max(50),
    lastName: zod.string().max(50),
})

// Path: /user/signup
router.post("/signup", async (req, res) => {
    try {
        const body = req.body;
        const { success} = signUpSchema.safeParse(body);

        if(!success){
            return res.status(411).json({
                message: "Incorrect inputs",
            });
        };

        const existingUser = await User.findOne({
            username: body.username,
        });

        if(existingUser){
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            });
        }

        const salt = await generateSalt();

        const hashedPassword = await generateHashedPassword(body.password, salt);

        const user = await User.create({
            username: body.username,
            password: hashedPassword,
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            salt,
        });

        const userId = user._id;

        const token = jwt.sign({
            userId,
        }, JWT_SECRET_TOKEN);

        return res.status(200).json({
            message: "User created successfully",
            token,
        });


    } catch (error) {
        console.log("[SIGNUP_ERROR]", error);
    }
});

const signInSchema = zod.object({
    username: zod.string().min(6).max(30),
    password: zod.string().min(8),
});

// Path: /user/signin
router.post("/signin", async (req, res) => {
    try {
        

        const body = req.body;

        const { success} = signInSchema.safeParse(body);

        if(!success){
            return res.status(411).json({
                message: "Incorrect inputs",
            });
        }

        const user = await User.findOne({
            username: body.username,
        });

        if(!user){
            return res.status(411).json({
                message: "No Users Found",
            });
        }

        const isValidPassword = await validatePassword(body.password, user.password);

        if(!isValidPassword){
            return res.status(411).json({
                message: "Incorrect Password",
            });
        }

        const userId = user._id;

        const token = jwt.sign({
            userId,
        }, JWT_SECRET_TOKEN);

        return res.status(200).json({
            message: "User signed in successfully",
            token,
        });


    } catch (error) {
        log.error("[SIGNIN_ERROR]", error);
    }
});

const updateSchema = zod.object({
    username: zod.string().min(6).max(30).optional(),
    firstName: zod.string().max(50).optional(),
    lastName: zod.string().max(50).optional(),
})
// Path: /user
router.put("/" , authMiddleware ,async (req, res) => {
    try {
        
        const { userId, body} = req;
        
        const { success } = updateSchema.safeParse(body);

        if(!success){
            return res.status(411).json({
                message: "Incorrect inputs",
            });
        }

        const user = await User.findOneAndUpdate({
            _id: userId
        }, {
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName
        }, {
            new: true
        })

        return res.status(200).json({
            user,
            message: "User Updated Succesfuly"
        })

    } catch (error) {
        console.log("[UPDATE_USER_ERROR]", error);
    }
});

module.exports = router;