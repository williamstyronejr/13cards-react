require("dotenv").config();
const { startServer } = require("./server");

const { IP, PORT } = process.env;

startServer(IP, PORT);
