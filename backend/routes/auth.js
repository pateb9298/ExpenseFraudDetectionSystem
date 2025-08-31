//Import dependencies
const express = require('express');
const User = require('../models/User'); //Our  Building model
const bcrypt = require("bcrypt.js")
const jwt = require("jsonwebtoken");
const Transaction = require('../models/Transaction');

const router = express.Router();

router.post("/register", async(req,res) => {
    try {
        const {firstName, lastName, username, email, password} = req.body;
        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({error: "Email already in use"});

        const user = new User({firstName, lastName, username, email, password});
        await user.save();

        res.status(201).json({message: "User registered succesfully"});
    } catch(err){
        res.status(500).json({error: err.message});
    }
});


router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email});
        if (!user) return res.status(400).json({error: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({error: "Invalid credentials"});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.json({access_token: token});

    }
    catch(err){
        res.status(500).json({error: err.message});
    }

});

router.post("/addTransaction", async(req, res) => {
    try {
        const {merchant, amount, category, paymentMethod, date, location, description} = req.body;
        const transaction = new Transaction({merchant, amount, category, paymentMethod, date, location, description})
        await transaction.save
        res.status(201).json({message: "Transaction saved successfully"});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})


router.get("/getAllTransactions", async(req, res) => {
    try{
        const transactions = await Transaction.find().sort({date: -1});
        res.status(200).json(transactions);
    }
    catch (err){
        res.status(500).json({error: "Server error while fetching transactions"});
    }
});

router.get("/search", async(req, res)=>{
    try {
        const {merchant, description} = req.query

        let filter = {};

        if (merchant){
            filter.merchant = {$regex: merchant, $options: "i"};
        }

        if (description){
            filter.description = {$regex: description, $options: "i"};
        }

        if (category){
            filter.category = category;
        }

        const transactions = await Transaction.find(filter).sort({date: -1});
        
        if (!transactions.length){
            return res.status(200).json({message: "No transactions found"});
        }

        res.status(200).json(transactions);
    }
    catch (err){
        res.status(500).json({error: "Server error while searching transactions"});
    }

});

module.exports = router