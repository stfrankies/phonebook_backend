const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide password in the command: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];

const name = process.argv[3];

const phone = process.argv[4];

const url = `mongodb+srv://stfrankies:${password}@appcluster.lccjq.mongodb.net/myFirstDatabase?authSource=admin&replicaSet=atlas-b6yk1p-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`;


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>console.log('Connected')).catch(e=>console.log(e))

const personSchema = new mongoose.Schema({
  name: String,
  phone: String
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: name,
  phone: phone
});

function getPersons() {
  try {
    Person.find({}).then(result => {
      console.log('phonebook:\n');
      result.forEach(person => {
        const output = `${person.name} ${person.phone} \n`;
        console.log(output);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function addPerson() {
  try {
    person.save().then(result => {
      console.log(`added ${result.name} number ${result.phone} to phonebook!`);
      mongoose.connection.close();
    }).catch(e=>console.log(e));
  } catch (error) {
    console.log(error);
  }
}

switch (process.argv.length) {
  case 3:
    getPersons();
    break;
  case 5:
    addPerson();
    break;
  default:
    getPersons();
    break;
}