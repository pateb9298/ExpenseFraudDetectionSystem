//Import dependencies
const express = require('express');
const User = require('../models/User'); //Our  Building model
const bcrypt = require("bcrypt.js")
const jwt = require("jsonwebtoken");
const Transaction = require('../models/Transaction');
const axios = require("axios")

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

router.get("/fraudAlerts", async(req, res)=>{
    try{
        const fraudTransactions = await Transaction.find({isFraud: true}).sort({date: -1}).limit(3);
        res.status(200).json(fraudTransactions);
    } catch (err){
        res.status(500).json({error: "Error while fetching fraud alerts"})
    }

})
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
        const transactionData = req.body;

        transactionData.user = req.user._id;

        const transaction = new Transaction(transactionData);
        await transaction.save()

        const response = await axios.post("http://localhost:5001/predict", transactionData);
        const isFraud = response.data.fraud
        res.status(201).json({message: "Transaction saved successfully", fraud: isFraud});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get("/recentTransactions", async(req, res)=> {
    try{
        const userId = req.user._id;
        const recentTransactions = await Transaction.find({user:userId}).sort({date:-1}).limit(6);
        res.status(200).json(recentTransactions);
    } catch (err){
        res.status(500).json({error: "Error while fetching recent transactions"})

}
});

router.get("/getAllTransactions", async(req, res) => {
    try{

        const userId = req.user._id;
        const transactions = await Transaction.find({user: userId}).sort({date: -1});
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

router.post("/addBudget", async(req, res)=>{
    try{
        const {userId, category, limit, spent} = req.body;
        const budget = new Budget({user: userId, category, limit, spent: spent||0});
        await budget.save();
        res.status(200).json({message: "Budget added successfully", budget});
    } catch (err){
        res.status(500).json({error: "Server error while adding budgets"});
    }
})

router.post("/getAllBudgets", async(req, res)=>{
    try{
        const userId = req.user._id;

        const budgets = await Budget.find({user: userId}).sort({createdAt: -1});

        if (!budgets.length){
            return res.status(200).json({message: "No budgets found"});
        }

        res.status(200).json(budgets);
    }catch (err){
        res.status(500).json({error: "Server error while fetching budgets"});
    }
})

router.delete("/delete/:type/:id", async(req, res) =>{
    try {
        const {type, id} = req.params;
        
        let Model;
        if (type === "transaction") Model = Transaction;
        else if (type === "budget") Model = Budget;
        else return res.status(400).json({error: "Invalid type"});

        const item = await Model.findByIdAndDelete(id);
        if (!item) return res.status(404).json({error: "Item not found"});

        res.status(200).json({message: `${type} deleted successfully`})
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.put("/edit/:type/:id", async(req, res) => {
    try{
        const {type, id} = req.params;
        const updates = req.body;

        let Model;
        if (type === "transaction") Model = Transaction;
        else if (type === "budget") Model = Budget;
        else return res.status(400).json({error: "Invalid type"});

        const item = await Model.findByIdAndDelete(id, updates, {new:true});
        if(!item) return res.status(404).json({error: "Item not found"});

        res.status(200).json({message: `${type} updated successfully`, item})
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router

