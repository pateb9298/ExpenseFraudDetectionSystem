//Import dependencies
const express = require('express');
const router = express.Router();

//Route: Mock route data (temporary placeholder)
//GET /routes
router.get("/", (req, res) => {
    res.json([
        {
            from: "Library",
            to: "Cafeteria",
            path: ["PointA", "PointB", "PointC"] //mock path points
        }
    ]);
});

module.exports = router;

