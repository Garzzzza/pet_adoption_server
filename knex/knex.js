const knexConfig = require('./knexfile')
const knex = require('knex')

const dbConnection = knex(knexConfig)

module.exports = dbConnection
