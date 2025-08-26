const mongoose = require('mongoose');

const BuildingSchema = new mongoose.Schema({
    name: String, // Building name (e.g., "Library")
    code: String, // Short code (e.g., "LIB")
    latitude: Number, // GPS latitude
    longitude: Number // GPS longitude
});

//Create a Building model from the schema and export it
module.exports = mongoose.model("Building", BuildingSchema);

