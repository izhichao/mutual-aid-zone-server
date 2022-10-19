const mongoose = require('mongoose');
const config = require('config');
let url = 'mongodb://localhost:27017';
const dnName = 'zone';
if (process.env.NODE_ENV === 'production') {
  url = `mongodb://${config.get(db.username)}:${config.get(db.password)}@localhost:27017`;
}
mongoose.connect(`${url}/${dnName}`);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

module.exports = mongoose;
