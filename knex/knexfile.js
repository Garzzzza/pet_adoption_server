const path = require('path')
const pathToMigrations = path.resolve(__dirname, '../migrations')
require('dotenv').config()


module.exports = {
  client: 'mysql',
  connection: {
    database: process.env.DATABASE_NAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    host: process.env.MYSQL_HOST,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: pathToMigrations
  }
}
