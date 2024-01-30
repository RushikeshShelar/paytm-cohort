const express = require('express');
const authMiddleware = require('../middleware');
const { Account, User } = require('../db');
const { transferBody } = require('../schemas/zodAccountSchema');
const { default: mongoose } = require('mongoose');

const router = express.Router();

// Path: GET /account/balance
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const { userId } = req;

        const account = await Account.findOne({
            userId
        });

        res.json({
            balance: account.balance
        })
    } catch (error) {
        console.log("[BALANCE_ERROR]", error);
        res.status(400).json({
            error: "Something went wrong"
        })
    }
});

// Path: POST /account/transfer
router.post("/transfer", authMiddleware, async (req, res) => {
    const { userId } = req;
    const { amount, to } = req.body

    const { success } = transferBody.safeParse(req.body);

    if (!success) {
        return res.json({
            error: "Invalid Inputs"
        })
    };

    try {

        // Using Transactions in MONGODM using Mongoose

        // Create a Session
        const session = await mongoose.startSession();

        // Start Transaction
        await session.startTransaction();

        const account = await Account.findOne({
            userId
        }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                error: "Insufficient balance"
            });
        };

        const toAccount = await Account.findOne({
            userId: to
        }).session(session);

        if (!toAccount) {
            return res.status(400).json({
                message: "Invalid account"
            });
        }
        // Perform the Transfer
        await Account.updateOne({
            userId: userId
        }, {
            $inc: {
                balance: -amount
            }
        }).session(session);

        await Account.updateOne({
            userId: to,
        }, {
            $inc: {
                balance: amount
            }
        }).session(session);

        // Commit the transaction
        await session.commitTransaction();


        return res.json({
            message: "Transfer Succesful"
        });

    } catch (error) {
        console.log("[TRANSFER_ERROR]", error);
    }


})

module.exports = router;