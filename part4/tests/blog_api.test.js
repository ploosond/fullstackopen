const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let newBlog = new Blog(helper.initialBlogs[0])
  await newBlog.save()
  newBlog = new Blog(helper.initialBlogs[1])
  await newBlog.save()
})

test.only('all blogs are retunred in JSON format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('blog post unique identifier is named id, not _id', async () => {
  const response = await api.get(`/api/blogs/`)
  const blogs = response.body
  assert(blogs.every((blog) => blog.hasOwnProperty('id')))
  assert(!blogs.every((blog) => blog.hasOwnProperty('_id')))
})

test.only('POST request creates a new blog post', async () => {
  const blogs = await helper.BlogsInDb()

  const blog = {
    title: 'Tips for developing E-commerce With NextJS',
    author: 'Doe Rogue',
    url: 'John Smith',
    likes: 500,
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map((blog) => blog.title)

  assert.strictEqual(response.body.length, blogs.length + 1)
  assert(contents.includes(blog.title))
})

test.only('if likes is missing default value is 0', async () => {
  const blog = {
    title: 'Blog without likes',
    author: 'John Smith',
    url: 'John Smith',
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogWithOutLikes = response.body.find(
    (blog) => blog.title === 'Blog without likes'
  )
  assert.strictEqual(blogWithOutLikes.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})
