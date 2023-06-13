const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const priceSchema = new Schema({
  type: { type: String },
  price: { type: Currency },
});

const detailSchema = new Schema({
  Publisher: {
    type: String,
    required: true,
  },
  Publication_Year: {
    type: Number,
    required: true,
  },
  "ISBN-13": {
    type: Number,
    required: true,
  },
  Language: {
    type: String,
    required: true,
  },
  Pages: {
    type: Number,
    required: true,
  },
});

const tutorialSchema = new Schema({
  Title: {
    type: String,
    required: [true, "Title required"],
  },
  Author: {
    type: String,
    required: true,
  },
  Genre: {
    type: String,
    required: true,
  },
  Detail: {
    type: detailSchema,
  },
  Price: [
    {
      type: priceSchema,
    },
  ],
});

module.exports = mongoose.model("Tutorial", tutorialSchema);
