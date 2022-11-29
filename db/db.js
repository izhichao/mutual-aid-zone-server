const mongoose = require('mongoose');
require('dotenv').config();
let url = 'mongodb://localhost:27017';
const dbName = 'zone';

if (process.env.NODE_ENV === 'production') {
  const dbUsername = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  url = `mongodb://${dbUsername}:${dbPassword}@localhost:27017`;
}
console.log(url);
mongoose.connect(`${url}/${dbName}`);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

module.exports = mongoose;
