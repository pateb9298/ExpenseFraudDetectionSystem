const express = require('express');
const router = express.Router();
const Building = require('../models/Buildings');
const axios = require('axios');

// helper: straight-line interpolation
function straightLineRoute(origin, destination, steps = 20) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const lat = origin.latitude + (destination.latitude - origin.latitude) * (i / steps);
        const lng = origin.longitude + (destination.longitude - origin.longitude) * (i / steps);
        points.push({ latitude: lat, longitude: lng });
    }
    return points;
}

// In-memory storage for route history (for testing)
const routeHistory = [];

// POST /routes - get directions from origin to a building
router.post("/", async (req, res) => {
    try {
        const { from, to } = req.body;
        console.log("Request body:", req.body);

        const building = await Building.findById(to.buildingId);
        if (!building) return res.status(404).json({ error: "Building not found" });

        const dest = building.entrances?.[0] || building.centroid;

        // Try Google Directions API
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${dest.latitude},${dest.longitude}&mode=walking&key=${process.env.GOOGLE_MAPS_KEY}`;
        const response = await axios.get(url);

        let polyline;
        let source;

        if (response.data.routes && response.data.routes.length > 0) {
            polyline = response.data.routes[0].overview_polyline.points;
            source = "google";
        } else {
            polyline = straightLineRoute(from, dest);
            source = "straightLine";
        }

        // Save to in-memory history for GET testing
        routeHistory.push({ from, to: building.name, polyline, source });

        return res.json({ polyline, destination: dest, source });

    } catch (error) {
        console.error(error);
        // fallback if API fails
        try {
            const { from, to } = req.body;
            const building = await Building.findById(to.buildingId);
            const dest = building?.entrances?.[0] || building?.centroid;
            if (dest) {
                const straight = straightLineRoute(from, dest);
                routeHistory.push({ from, to: building.name, polyline: straight, source: "straightLine" });
                return res.json({ polyline: straight, destination: dest, source: "straightLine" });
            }
        } catch (_) {}

        res.status(500).json({ error: error.message });
    }
});

// GET /routes - return all previous routes (for Unity testing)
router.get("/", (req, res) => {
    if (routeHistory.length === 0) {
        return res.json({ message: "No routes requested yet." });
    }
    res.json(routeHistory);
});

module.exports = router;
