const express = require('express');
const router = express.Router();
const Building = require('../models/Buildings'); // Our Route model
const axios = require('axios');


// Temporary in-memory storage

// POST /routes - add one or multiple routes
router.post("/", async (req, res) => {
    try {
        const routes = new Route(req.body);
        await routes.save();
        res.json(routes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        });


router.delete("/", (req, res) => {
    Route.deleteMany
    res.json({ message: "All routes deleted" });
});

module.exports = router;
