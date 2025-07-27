require("dotenv").config();
const mongoose = require("mongoose");
const startServer = require("./utils/databaseBuilder");

startServer();
