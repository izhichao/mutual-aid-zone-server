const mongoose = require('mongoose');
const dbIp = process.env.DB_IP || '127.0.0.1';
const dbPort = process.env.DB_PORT || '27017';
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME || 'zone';
const dbAuthSource = process.env.DB_AUTHSOURCE || 'zone';

let url = `mongodb://${dbIp}:${dbPort}`;
if (dbUsername && dbPassword) {
  url = `mongodb://${dbUsername}:${dbPassword}@${dbIp}:${dbPort}`;
}

mongoose.connect(`${url}/${dbName}?authSource=${dbAuthSource}`);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

module.exports = mongoose;
