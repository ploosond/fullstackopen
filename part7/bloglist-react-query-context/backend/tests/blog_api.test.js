const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are some blogs initially', () => {
  let token
  beforeEach(async () => {
    await Blog.deleteMany({})
    let newBlog = new Blog(helper.initialBlogs[0])
    await newBlog.save()
    newBlog = new Blog(helper.initialBlogs[1])
    await newBlog.save()

    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'apple' })

    token = response.body.token

    await api
      .post('/api/blogs')
      .send({
        title: 'Another top 3 blogs that deals with React',
        author: 'Prajwol Devkota',
        url: 'https://example.com/10-tips-scalable-ecommerce',
        likes: 100,
      })
      .set('Authorization', `Bearer ${token}`)
  })

  test('all blogs are retunred in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  })

  test('blog post unique identifier is named id, not _id', async () => {
    const response = await api.get('/api/blogs/')
    const blogs = response.body
    assert(blogs.every((blog) => Object.hasOwn(blog, 'id')))
    assert(!blogs.every((blog) => Object.hasOwn(blog, '_id')))
  })

  test('POST request creates a new blog post', async () => {
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
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map((blog) => blog.title)

    assert.strictEqual(response.body.length, blogs.length + 1)
    assert(contents.includes(blog.title))
  })

  describe('when dealing with specific blog', () => {
    test('if likes is missing default value is 0', async () => {
      const blog = {
        title: 'Blog without likes',
        author: 'John Smith',
        url: 'John Smith',
      }

      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const blogWithOutLikes = response.body.find(
        (blog) => blog.title === 'Blog without likes'
      )
      assert.strictEqual(blogWithOutLikes.likes, 0)
    })

    test('if title or url is missing, backend responds 400 Bad Request', async () => {
      const blog = {
        title: '10 Tips for Building a Scalable E-commerce Platform',
        author: 'John Smith',
        // url: 'John Smith',
        likes: 857,
      }

      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    describe('when updating or deleting a blog', () => {
      test('single blog post delete', async () => {
        const blogsAtStart = await helper.BlogsInDb()
        const blogToDelete = blogsAtStart[2]

        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204)
        const blogsAtEnd = await api.get('/api/blogs')
        const contents = blogsAtEnd.body.map((blog) => blog)
        assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.body.length)
        assert(!contents.includes(blogToDelete.title))
      })
      test('update the information of an individual blog post', async () => {
        const blogsAtStart = await helper.BlogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const blog = {
          title: '10 Tips for Building a Scalable E-commerce Platform',
          author: 'John Smith',
          url: 'Prajwol',
          likes: 100,
        }
        const updatedBlog = await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(blog)
          .expect(200)
          .expect('Content-Type', /application\/json/)
        assert.strictEqual(blog.title, updatedBlog.body.title)
        assert.strictEqual(blog.author, updatedBlog.body.author)
        assert.strictEqual(blog.url, updatedBlog.body.url)
        assert.strictEqual(blog.likes, updatedBlog.body.likes)
      })
      test('adding blog fails when token is missing', async () => {
        await api
          .post('/api/blogs')
          .send({
            title: '10 Tips for Building a Scalable E-commerce Platform',
            author: 'John Smith',
            url: 'Prajwol',
            likes: 100,
          })
          .expect(401)
      })
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
