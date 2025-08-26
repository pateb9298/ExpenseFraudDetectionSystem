//Import dependencies
const express = require('express');
const router = express.Router();

//Temporary in-memory storage for testing
let routesData = [
  {
    from: "Library",
    to: "Cafeteria",
    path: ["PointA", "PointB", "PointC"]
  }
];

//GET /routes - return all routes
router.get("/", (req, res) => {
    res.json(routesData);
});

//POST /routes - add a new route
router.post("/", (req, res) => {
    const newRoute = req.body; // expects JSON like {from, to, path}
    routesData.push(newRoute);
    res.json(newRoute);
});

module.exports = router;
