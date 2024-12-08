const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' })
  }
  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'both title and url are required' })
  }

  const user = req.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  })

  res.status(200).send(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  const user = req.user

  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken) {
    res.status(401).json({ error: 'invalid token' })
  }

  if (blog.user.toString() !== user.id) {
    return res
      .status(401)
      .json('Unauthorized request, blog was created by someone else')
  }
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter
