require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const phonebook = require('./phonebook')
const Contact = require('./models/contact')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body),
    ].join(' ')
  })
)

app.get('/api/persons', (req, res, next) => {
  Contact.find({})
    .then((contacts) => {
      res.json(contacts)
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res, next) => {
  Contact.countDocuments({})
    .then((count) => {
      const currentDate = new Date()
      res.send(
        `<p>Phonebook has ${count} info for  people</p><p>${currentDate}</p>`
      )
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const duplicateEntry = phonebook.find(
    (e) => e.name?.toLowerCase() === body.name?.toLowerCase()
  )

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name and number are mandatory' })
  }

  if (duplicateEntry) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact
    .save()
    .then((savedContacts) => {
      res.json(savedContacts)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(req.params.id, contact, {
    new: true,
    runValidators: true,
  })
    .then((updatedContact) => {
      res.json(updatedContact)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server is running on port http://localhost:${PORT}`)
