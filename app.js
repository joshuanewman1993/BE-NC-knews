const express = require('express');
const { handle400, handle404, handle422 } = require('./errors/index');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/apiRoute');

app.use(cors())
app.use(bodyParser.json());
app.use('/api', apiRouter);

// app.use((err, req, res, next) => {
//   console.log(err);
//   next(err);
// });

app.use(handle404);
app.use(handle400);
app.use(handle422);

module.exports = app;
