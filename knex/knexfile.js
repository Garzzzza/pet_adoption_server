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
    ssl: process.env.DATABASE_NAME === "pet_adoption_db" ?null: { rejectUnauthorized: false }  ,
  },

  migrations: {
    tableName: 'knex_migrations',
    directory: pathToMigrations
  }
}
