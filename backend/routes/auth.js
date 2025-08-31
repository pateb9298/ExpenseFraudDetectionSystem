//Import dependencies
const express = require('express');
const User = require('../models/User'); //Our  Building model
const bcrypt = require("bcrypt.js")
const jwt = require("jsonwebtoken");

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

module.exports = router