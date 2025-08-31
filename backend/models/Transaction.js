const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    merchant:  {type: String, required: true},
    amount: {type: Number, required: true},
    category: {type: String, required: true},
    paymentMethod: {type: String, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: true},
    description: {type: String}
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
