const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personSchema = new Schema({
   username: String,
   age: Number,
   gender: String,
});

const person = mongoose.model("person", personSchema);

module.exports = person;