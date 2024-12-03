const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')

const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error(error.message)
  })

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(middleware.requestLogger)
app.use(middleware.unknownRequest)
app.use(middleware.errorHandler)

module.exports = app
