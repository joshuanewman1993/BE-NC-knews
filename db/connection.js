const knex = require('knex');

const ENV = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[ENV];

const connection = knex(config);
module.exports = connection;
