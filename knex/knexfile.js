const path = require('path')
const pathToMigrations = path.resolve(__dirname, '../migrations')
require('dotenv').config()


module.exports = {
  client: 'pg',
  connection: {
    database: process.env.DATABASE_NAME,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    host: process.env.PG_HOST,
    // ssl: { rejectUnauthorized: false },
  },

  migrations: {
    tableName: 'knex_migrations',
    directory: pathToMigrations
  }
}
