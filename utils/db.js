const mongoose = require('mongoose');
let url = 'mongodb://127.0.0.1:27017';
const dbName = 'zone';

if (process.env.NODE_ENV === 'production') {
  const dbUsername = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  url = `mongodb://${dbUsername}:${dbPassword}@127.0.0.1:27017`;
}
mongoose.connect(`${url}/${dbName}`);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

module.exports = mongoose;
