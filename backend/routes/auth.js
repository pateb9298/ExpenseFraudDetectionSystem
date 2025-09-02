//Import dependencies
const express = require('express');
const User = require('../models/User'); //Our  Building model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Budget = require("../models/Budget");
const Transaction = require('../models/Transaction');
const axios = require("axios")

const router = express.Router();

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({error: "Unauthorized"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {_id: decoded.id};
        next();
    } catch (err){
        return res.status(401).json({error: "Invalid token"});
    }
};

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email credentials" });

    console.log("Password entered:", password);
    console.log("Password hash from DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ access_token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/register", async (req,res) => {
    try {
        const {firstName, lastName, username, email, password} = req.body;
        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({error: "Email already in use"});

        const hashedPassword = await bcrypt.hash(password, 10); // hash password

        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });
        await user.save();

        res.status(201).json({message: "User registered successfully"});
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

router.use(auth);

router.get("/fraudAlerts", async(req, res)=>{
    try{
        const fraudTransactions = await Transaction.find({isFraud: true}, "Amount Date riskScore fraudReason reviewStatus reviewNotes Merchant Group").sort({Date: -1});
        res.status(200).json(fraudTransactions);
    } catch (err){
        res.status(500).json({error: "Error while fetching fraud alerts"})
    }

})

router.get("/fraudAlertsPending", async (req, res) => {
  try {
    const alerts = await Transaction.find(
      { isFraud: true, reviewStatus: "pending" },
      "Amount Date riskScore fraudReason reviewStatus Merchant Group"
    ).sort({ Date: -1 });
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching pending fraud alerts" });
  }
});

router.get("/fraudAlertsDashboard", async (req, res) => {
  try {
    const fraudTransactions = await Transaction.find({ isFraud: true }, "Amount Date riskScore fraudReason reviewStatus reviewNotes Merchant Group").sort({ Date: -1 }).limit(3);
    res.status(200).json(fraudTransactions);
  } catch (err) {
    res.status(500).json({ error: "Error while fetching fraud alerts" });
  }
});

// Approve transaction
router.put("/fraud/approve/:id", async (req, res) => {
  const tx = await Transaction.findByIdAndUpdate(
    req.params.id,
    { reviewStatus: "approved" },
    { new: true }
  );
  res.json(tx);
});

// Reject transaction
router.put("/fraud/reject/:id", async (req, res) => {
  const { notes } = req.body;
  const tx = await Transaction.findByIdAndUpdate(
    req.params.id,
    { reviewStatus: "rejected", reviewNotes: notes },
    { new: true }
  );
  res.json(tx);
});

router.post("/addTransaction", async(req, res) => {
    try {
        const data = req.body;

        data.user = req.user._id;

        const response = await axios.post("http://localhost:5001/predict", data);
        const {fraud, riskScore, reason} = response.data;

        const transaction = new Transaction({
            user: req.user._id,
            Age: data.age,
            Gender: data.gender,
            "Type of Transaction": data.typeOfTransaction,
            "Entry Mode": data.entryMode,
            "Type of Card": data.typeOfCard,
            Bank: data.bank,
            Amount: data.amount,
            Currency: data.currency,
            Date: data.date,
            Time: data.time,
            "Merchant Group": data.merchantGroup,
            "Country of Transaction": data.countryOfTransaction,
            "Country of Residence": data.countryOfResidence,
            "Shipping Address": data.shippingAddress,

            isFraud: fraud,
            riskScore: riskScore,
            fraudReason: Array.isArray(reason) ? reason.join(", ") : reason
        });       
    
        await transaction.save()
        const budget = await Budget.findOne({
            user: req.user._id,
            category: transaction["Merchant Group"]
        });

        if (budget) {
            budget.spent += transaction.Amount;
            await budget.save();
}
    
        res.status(201).json({message: "Transaction saved successfully", fraud, riskScore, reason});
    }
    catch(err){
        console.error("❌ Error adding transaction:", err);
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
        const transactions = await Transaction.find({user: req.user._id}).sort({Date: -1});
        res.status(200).json(transactions);
    }
    catch (err){
        res.status(500).json({error: "Server error while fetching transactions"});
    }
});

router.get("/search", async(req, res)=>{
    try {
        const {merchant, description, category} = req.query

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
        const {category, limit, spent} = req.body;

        const userId = req.user._id;
        const budget = new Budget({user: userId, category, limit, spent: spent||0});
        await budget.save();
        res.status(201).json({message: "Budget added successfully", budget});
    } catch (err){
        res.status(500).json({error: "Server error while adding budgets"});
    }
})

router.post("/getAllBudgets", async(req, res)=>{
    try{
        const userId = req.user._id;

        const budgets = await Budget.find({user: userId}).sort({createdAt: -1});

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

        const item = await Model.findByIdAndUpdate(id, updates, {new:true});
        if(!item) return res.status(404).json({error: "Item not found"});

        res.status(200).json({message: `${type} updated successfully`, item})
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router

