const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRoute');

app.use(bodyParser.json());
app.use('/api', apiRouter);

module.exports = app;
