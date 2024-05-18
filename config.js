require('dotenv').config();

module.exports = {
  postgresUrl: process.env.POSTGRES_URL,
  jwtSecret: process.env.JWT_SECRET,
};
