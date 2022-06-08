const mongoose = require('mongoose');

const dotenv = require('dotenv');


dotenv.config({ path: ".env" });

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(res => console.log('connected to DB on ', res.connections[0].port))
  .catch(err => console.log(err.message));

mongoose.personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "Name must be more than 3 letters"]
  },
  number: {
    type: String,
    minlength: [8, 'Phone numbers must be more than 8 digits'],
    validate: {
      validator: function(value) {
        if(value.includes('-')){
          return /^\d{2}-\d{7}$/.test(value) || /^\d{3}-\d{8}$/.test(value);
        }
        return (value.length >= 8);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

module.exports = mongoose.model('Person', mongoose.personSchema)