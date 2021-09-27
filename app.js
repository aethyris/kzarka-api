require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}).catch(console.error);

const itemSchema = new mongoose.Schema({
    id: Number,
    name: String,
    cratelevel: String,
    rarity: String,
    required: Number,
    profit: Number,
    cost: Number,
    stock: Number
})
let Item = mongoose.model('Item', itemSchema)

app.get('/', (req, res) => {
    res.send('<h1>Kzarka API</h1>');
})

app.get('/:region/imperialcooking', (req, res) => {
    const searchParameters = {
        required: {$exists: true}
    };
    const crateLevelsToShow = req.query.cratelevel;
    if (crateLevelsToShow) {
        if (Array.isArray(crateLevelsToShow)) {
            const cratelevels = []
            crateLevelsToShow.forEach(element => {
                cratelevels.push({
                    "cratelevel": element
                });
            });
            searchParameters["$or"] = cratelevels;
        } else {
            searchParameters["cratelevel"] = crateLevelsToShow;
        }
    }
        
    Item.find(searchParameters, function(error, data) {
        if (error) return console.error(error);
        res.send(data);
    })
})

app.get('/:region/marketplace/', (req, res) => {
    Item.find({}, function(error, data) {
        if (error) return console.error(error);
        res.send(data);
    })
})

app.get('/:region/marketplace/:itemid', (req, res) => {
    const itemIndex = req.params.itemid
    Item.findOne({id: itemIndex}, function(error, data) {
        if (error) return console.error(error);
        res.send(data);
    })
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is running");
})