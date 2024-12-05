const logger = require('../utils/logger')

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

  // if (
  //   error.code === 11000 &&
  //   error.message.includes('E11000 duplicate key error')
  // ) {
  //   return res.status(400).json({
  //     error: `The username ${error.keyValue.username} already exists.`,
  //   })
  // }

  next(error)
}

module.exports = { requestLogger, unknownRequest, errorHandler }
