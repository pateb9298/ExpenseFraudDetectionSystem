const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    Age: {type: Number, required: true},
    Amount: {type: Number, required: true},
    Currency: {type: String, required: true},
    "Shipping Address": {type: String, required: true},
    Gender: {type: String, required: true},
    "Type of Card": {type: String, required: true},
    "Entry Mode": {type: String, required: true},
    "Type of Transaction": {type: String, required: true},
    "Merchant Group": {type: String, required: true},
    "Country of Transaction": {type: String, required: true},
    "Country of Residence": {type: String, required: true},
    Bank: {type: String, required: true},
    Date: {type: Date, required: true},
    Time: {type: String, required: true},
    Description: {type: String},
    isFraud: {type: Boolean, default: false},
    riskScore: {type: Number, default: 0},
    fraudReason: {type: String},
    reviewStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
