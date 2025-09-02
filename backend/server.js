// server.js

require("dotenv").config(); // Load environment variables from .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());

// Enable CORS for your frontend
app.use(cors({
  origin: ["http://localhost:3000","https://financeguardai.netlify.app"],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
// Make sure your routes export a router, e.g., router = express.Router()
app.use("/api/auth", require("./routes/auth"));

console.log("MONGO_URI:", process.env.MONGO_URI);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

