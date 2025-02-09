const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('../utils/logger')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken) {
    res.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  req.user = user

  next()
}

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

const unknownRequest = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error)

  if (error.name === 'ValidationError') {
    if (error.message.includes('is shorter than the minimum allowed length')) {
      return res.status(400).json({
        error: 'The username length must be at least 3 characters long.',
      })
    }
    if (error.message.includes('username: Path `username` is required.')) {
      return res.status(400).json({
        error: 'The username must be provided.',
      })
    }
  } else if (error.name === 'MongoServerError') {
    if (error.message.includes('E11000 duplicate key error collection')) {
      return res.status(400).json({
        error: 'The username must be unique.',
      })
    }
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token missing' })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownRequest,
  errorHandler,
}
