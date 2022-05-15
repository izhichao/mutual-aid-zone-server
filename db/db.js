const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/';
const dnName = 'zone';

mongoose.connect(`${url}/${dnName}`);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

module.exports = mongoose;
