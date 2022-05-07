const express = require('express');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const mongo = require('./database/mongo');
const io = require('./socket.io/index');
const cors = require("cors");
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: [
      "http://localhost:3000"
    ],
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
  }));


app.use('/', indexRouter);


module.exports = app;
