const mongoose = require("mongoose");


const RouteSchema = new mongoose.Schema({
    from: String, // Route name or identifier
    to: String,
    path: [String]
});

module.exports = mongoose.model("Route", RouteSchema);

