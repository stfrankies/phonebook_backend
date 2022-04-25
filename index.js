const express = require('express')
const app = express()

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

const currentdate = new Date();


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id);

  if (!person) {
    res.status(404).end()
    return
  }

  res.json(person);
})

app.post('/api/persons', (req, res) => {
  console.log(req.body)

  const person = {
    id: Math.random(),
    name: req.body.name,
    number: req.body.number
  }

  const newpersons = persons.concat(person)
  res.json(newpersons)
})


app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id);
  const filterperson = persons.filter(person => person.id !== id)
  if (!person) {
    res.status(404).end()
    return
  }
  res.send(filterperson).status(204).end()
})


app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people </p> ${currentdate}`)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)