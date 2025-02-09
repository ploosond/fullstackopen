const { describe, beforeEach, test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper.js')

const User = require('../models/user')

const api = supertest(app)

describe('User login api test', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    await User.insertMany(helper.initialUsers)

    // const userObject = helper.initialUsers.map((user) => new User(user))
    // const promiseArray = userObject.map((user) => user.save())
    // await Promise.all(promiseArray)
  })

  describe('username is required, should be unique and  be at least 3 characters long', () => {
    test('username must be provided', async () => {
      const newUser = {
        username: '',
        name: 'Prajwol Devkota',
        password: 'apple',
      }

      const response = await api.post('/api/users').send(newUser).expect(400)
      assert(response.body.error.includes('The username must be provided'))
    })

    test('username must be unique', async () => {
      const newUser = {
        username: 'root',
        name: 'Prajwol Devkota',
        password: 'apple',
      }

      const response = await api.post('/api/users').send(newUser).expect(400)
      assert(response.body.error.includes('The username must be unique'))
    })

    test('username must be at least 3 characters long', async () => {
      const newUser = {
        username: 'aa',
        name: 'Prajwol Devkota',
        password: 'apple',
      }

      const response = await api.post('/api/users').send(newUser).expect(400)
      assert(
        response.body.error.includes(
          'The username length must be at least 3 characters long'
        )
      )
    })
  })

  describe('password is required and should be at least 3 characters long', () => {
    test('password must be provided', async () => {
      const newUser = {
        username: 'ploosond',
        name: 'Prajwol Devkota',
        password: '',
      }

      const response = await api.post('/api/users').send(newUser).expect(400)
      assert(response.body.error.includes('The password must be provided'))
    })

    test('password must be at least 3 characters long', async () => {
      const newUser = {
        username: 'ploosond',
        name: 'Prajwol Devkota',
        password: 'ap',
      }

      const response = await api.post('/api/users').send(newUser).expect(400)
      assert(
        response.body.error.includes(
          'The password must be provided and must be at least 3 characters long'
        )
      )
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
