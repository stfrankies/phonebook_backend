const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const Person = require('./models/person')
const { response } = require('express')

const jsonParser = bodyParser.json()
app.use(jsonParser);
app.use(cors())
app.use(express.static('build'))


// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const errorHandler = (error, req, res, next) =>{
  console.error(error.Message)
  
  if(error.name === 'CastError'){
    return response.status(4)
  }
  next(error)
}

app.use(errorHandler);

const currentdate = new Date();

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {res.json(persons)})
    .catch(err => console.log(err))
})

app.get('/api/persons/:id', (req, res) => {

  Person.findById(req.params.id).then(person => res.json(person))
    .catch(err => console.log(err))
  // const id = Number(req.params.id)
  // const person = persons.find(person => person.id === id);

  // if (!person) {
  //   res.status(404).end()
  //   return
  // }

  // res.json(person);
})

app.post('/api/persons', (req, res) =>{
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })
  
  person.save().then(savedPerson => {
    res.json(savedPerson);
  }).catch(error => {
    console.log(error.message)
    if(error.name === 'ValidationError'){
      res.status(400).json(error)
    }
  })
  // const checkname = persons.filter(person => new RegExp(`^${req.body.name}$`, "i").test(person.name));

  // if(checkname.length > 0){
  //   res.status(400).json({error:'name already exists'});
  //   return;
  // }

  // const person = {
  //   id: Math.random(),
  //   name: req.body.name,
  //   number: req.body.number
  // };
  
  // const newpersons = persons.concat(person);
  // res.json(newpersons);
})

app.put('/api/persons/:id', errorHandler, (req, res)=>{
  const body = req.body 
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findOneAndUpdate({_id: req.params.id}, person, {new: true, runValidators: true}).then(
    personUpdate => {
      if(personUpdate === null){
        res.status(404).json({message: 'Item not found in db'})
      }
      console.log(personUpdate)
      res.status(201).json(personUpdate)
    }
  ).catch(error =>{
    console.log(error.message)
    if(error.name === 'ValidationError'){
      res.status(400).json(error)
    }
  })
}) 

app.delete('/api/persons/:id', (req, res) => {
  //const id = Number(req.params.id)
  // const person = persons.find(person => person.id === id);
  // const filterperson = persons.filter(person => person.id !== id)

  Person.findByIdAndRemove(req.params.id).then(result => {
    if(result === null){
      res.status(404).json({message: 'Item not found in db'})
    }
    res.status(204).end()
  }).catch(err => console.log(err))
  // if (!person) {
  //   res.status(404).end()
  //   return
  // }
  // res.send(filterperson).status(204).end()
})


app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people </p> ${currentdate}`)
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`Server running on port ${PORT}`)