const express = require("express");
const mongoose = require("mongoose");
const bodyparse = require("body-parser");
const SERVER_PORT = process.env.PORT || 8080;
const app = express();
const userRoutes = require("../live-ops-engine-backend/routes/user");
const offerRoutes = require("../live-ops-engine-backend/routes/offer");

mongoose.connect("mongodb://localhost:27017/user").then(() =>{
    console.log("successfully connected to be db");
}).catch(() =>{
    console.log("failed to connect to database");
})

app.use(bodyparse.json());

app.listen(SERVER_PORT, () =>{
    console.log("Server started at" + " " + SERVER_PORT);
})

app.use("/user", userRoutes);
app.use("/offer", offerRoutes);