// db/index.js

const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const { POSTGRES_URL } = process.env;

const client = new Client({
  connectionString: POSTGRES_URL,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = { client };
