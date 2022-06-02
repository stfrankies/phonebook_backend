const mongoose = require('mongoose');

const dotenv = require('dotenv');


dotenv.config({ path: ".env" });

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(res => console.log('connect to DB on ', res.connections[0].port))
    .catch(err => console.log(err.message));

personSchema = new mongoose.Schema({
    name: String,
    number: String
})

module.exports = mongoose.model('Person', personSchema)