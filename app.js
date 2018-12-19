const express = require('express');

process.env.NODE_ENV = 'test';

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRoute');

app.use(bodyParser.json());
app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
