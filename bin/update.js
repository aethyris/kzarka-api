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

let rows = [];

fetch("https://docs.google.com/spreadsheets/d/1w7onDHmqgwuwIxV21Yiv2RAeOBQJegj-m6EIQFhxd2c/gviz/tq?tqx=out:json")
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2))
    const data = json.table.rows;
    data.forEach(element => {
      const itemUpdate = {
        "id": element.c[1].v,
        "cost": element.c[4].v,
        "stock": element.c[2].v
      }
      rows.push(itemUpdate);
    });

    const bulkUpdateCallback = function(error, result) {
      console.log(result);
      mongoose.disconnect();
      process.exit();
    }
    
    const bulkOps = rows.map(function(item) {
      return {
        "updateOne": {
          "filter": { "id": item.id },
          "update": { "$set": { "cost": item.cost, "stock": item.stock } }
        }
      }
    });
    
    Item.collection.bulkWrite(bulkOps, { "ordered": true, w: 1 }, bulkUpdateCallback);
  });