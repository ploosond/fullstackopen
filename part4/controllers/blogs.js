const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)
  if (!blog.likes) {
    blog.likes = 0
  }

  if (!blog.title || !blog.url) {
    return res.status(400).end()
  }

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter
