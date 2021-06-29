require("dotenv").config();
// dependancies==============================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
// create app object==============================
const app = express();
// get values from .env================================
const {PORT = 5000, MONGODB_URL} = process.env;
// database connection config=======================
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// connection events--
mongoose.connection
.on("open", () => console.log("You are connected to mongodb"))
.on("close", () => console.log("You are disconnected from mongodb"))
.on("error", (error) => console.log(error));
// models============================================
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);
// middleware=======================================
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// routes- - - - - - - - - - - - - -- - - - - - - 
// test route==============================
app.get('/', (req, res) => {
    res.send('hello')
})
// index cheese route=======================
app.get('/cheese', async (req, res) => {
    try {
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});
// create cheese route======================
app.post("/cheese", async (req, res) => {
    try {
        res.json(await Cheese.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});
// listener===================================
app.listen(PORT, () => console.log('express is listening on port:', PORT));