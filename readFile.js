const fs = require('fs');
const endpoints = require('./routes/index.json');

module.exports = (req, res, next) => {
  res.send(endpoints);
};
