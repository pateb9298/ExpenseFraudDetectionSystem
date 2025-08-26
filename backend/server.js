//Import required packages
require("dotenv").config(); //Load environment variables from .env file
console.log("MONGO_URI:", process.env.MONGO_URI);
const express = require("express"); //Framework for building APIs
const mongoose = require("mongoose"); //Library for MongoDB object modeling

const app = express(); //Initialize Express app

app.use(express.json()); //Middleware to parse JSON request bodies

//Connect to MongoDB using the URI from .env file
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err => console.error(err));

//Test route to check if server is running
app.get("/", (req, res) => {
    res.send("Server is running");
});

//Import route handlers
app.use("/building", require("./routes/building")); //Routes for buildings
app.use("/routes", require("./routes/routes")); //Routes for routes

//Start the server on port (from env or 5000 default)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));