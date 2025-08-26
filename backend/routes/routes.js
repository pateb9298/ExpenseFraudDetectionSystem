const express = require('express');
const router = express.Router();
const Route = require('../models/Route'); // Our Route model

// Temporary in-memory storage

// GET /routes - return all routes
router.get("/", async (req, res) => {
    try {
        //Fetch all building documents from MongoDB
        const routes = await Route.find();
        res.json(routes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

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
