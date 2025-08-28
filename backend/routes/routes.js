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

router.post("/", async (req, res) => {
    try {
        const { from, to } = req.body;
        console.log("Request body:", req.body);

        const building = await Building.findById(to.buildingId);
        if (!building) return res.status(404).json({ error: "Building not found" });

        const dest = building.entrances?.[0] || building.centroid;

        // try Google Directions API
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${dest.latitude},${dest.longitude}&mode=walking&key=${process.env.GOOGLE_MAPS_KEY}`;
        const response = await axios.get(url);

        if (response.data.routes && response.data.routes.length > 0) {
            const steps = response.data.routes[0].overview_polyline.points;
            return res.json({ polyline: steps, destination: dest, source: "google" });
        }

        // fallback to straight line if Google returned no routes
        const straight = straightLineRoute(from, dest);
        return res.json({ polyline: straight, destination: dest, source: "straightLine" });

    } catch (error) {
        // also fallback if API call fails
        try {
            const { from, to } = req.body;
            const building = await Building.findById(to.buildingId);
            const dest = building?.entrances?.[0] || building?.centroid;
            if (dest) {
                const straight = straightLineRoute(from, dest);
                return res.json({ polyline: straight, destination: dest, source: "straightLine" });
            }
        } catch (_) {}
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

