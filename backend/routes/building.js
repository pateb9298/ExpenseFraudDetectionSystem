//Import dependencies
const express = require('express');
const Building = require('../models/Buildings'); //Our  Building model
const router = express.Router();

//Route: Add a new building
// POST /building
//router is a mini-app that handles routes (defines what should happen when someone makes a request to your server)
//,post(...) means the route is for HTTP Post requests (like sending data in a form) (theres also get, put, delete, etc)
// "/" means the path for the route
//async (req, res) => {...} is a callback function (req is short for request (contains info about the incoming request(body, header, params)))
//res is short for response (used to send something back to client), async means use await inside the function
router.post("/", async (req, res) => {
    try {
        const building = new Building(req.body);
        await building.save();
        res.json(building);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });


//Route: Get all buildings
//GET /building

router.get("/", async (req, res) => {
    try {
        //Fetch all building documents from MongoDB
        const buildings = await Building.find();
        res.json(buildings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

//Export router so server.js can use it
module.exports = router;