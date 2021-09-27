require('dotenv').config();
const fetch = require('node-fetch');
const mongoose = require('mongoose');
  
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

fetch("https://docs.google.com/spreadsheets/d/1w7onDHmqgwuwIxV21Yiv2RAeOBQJegj-m6EIQFhxd2c/gviz/tq?tqx=out:json")
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2))
    const rows = json.table.rows;
    rows.forEach(element => {
      const itemIndex = element.c[1].v;
      const itemCount = element.c[2].v;
      const itemPrice = element.c[4].v;
      const itemUpdate = {
        "cost": itemPrice,
        "stock": itemCount
      }
      Item.findOneAndUpdate({id: itemIndex}, itemUpdate, {new: true}, function(error, updated) {
        if (error) return console.error(error);
      });
    });
    console.log("Updated items");
    mongoose.disconnect();
    process.exit();
  })