const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


const DB_URI = process.env.MONGO_ATLAS_URI;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
   if(err) throw new Error(err.message)
});

const connection = mongoose.connection;
connection.once("open", () => {
   console.log(`Connected to MongoDB`);
});


const routes = require('./routes/router');
app.use('/person', routes);


app.listen(PORT, () => {
   console.log(`Server started at port ${PORT}`);
})