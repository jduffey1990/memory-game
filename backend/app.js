const path = require("path");
const notFound = require("./errors/notFound")
const errorHandler = require("./errors/errorHandler")

require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require('express');
const scoreRoutes = require('./scores/scores.router');


const app = express();
const cors = require('cors');
app.use(express.json());

app.use(cors({
    origin: ['https://jordans-memory-game.onrender.com', 'http://localhost:3000']  // Only allow requests from this origin
  }));

app.use('/scores', scoreRoutes);



app.use(notFound);
app.use(errorHandler);

module.exports = app;