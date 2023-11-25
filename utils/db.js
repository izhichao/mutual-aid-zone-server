const mongoose = require('mongoose');
const dbIp = process.env.DB_IP || '127.0.0.1';
const dbPort = process.env.DB_PORT || '27017';
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

let url = `mongodb://${dbIp}:${dbPort}`;
if (dbUsername && dbPassword) {
  url = `mongodb://${dbUsername}:${dbPassword}@${dbIp}:${dbPort}`;
}
console.log(url);
const dbName = 'zone';
mongoose.connect(`${url}/${dbName}`);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

module.exports = mongoose;
