require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL,
  DEBUG,
} = process.env;

module.exports = {
  production: {
    client: "pg", // recommended name for the PostgreSQL client
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: { min: 1, max: 5 },
    migrations: {
      directory: path.join(__dirname, "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};