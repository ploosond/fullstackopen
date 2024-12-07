const logger = require('../utils/logger')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    return null
  }

  next()
}

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:', req.path)
  logger.info('Body:', req.body)
  logger.info('---')
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
  }

  next(error)
}

module.exports = { tokenExtractor, requestLogger, unknownRequest, errorHandler }
