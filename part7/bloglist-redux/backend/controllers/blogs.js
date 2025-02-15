const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body;
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken) {
    return res.status(401).json({ error: 'invalid token' });
  }
  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'both title and url are required' });
  }

  const user = req.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    comments: [],
    user: user,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.post('/:id/comments', async (req, res) => {
  const { comment } = req.body;
  console.log(comment);

  if (!comment) {
    return res.status(400).json({ error: 'comment is missing' });
  }

  const blog = await Blog.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
  });
  blog.comments = blog.comments.concat(comment);
  const updatedBlog = await blog.save();
  res.status(201).json(updatedBlog);
});

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  }).populate('user', { username: 1, name: 1 });

  res.status(200).json(updatedBlog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const user = req.user;

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken) {
    res.status(401).json({ error: 'invalid token' });
  }

  if (blog.user.toString() !== user.id) {
    return res
      .status(401)
      .json('Unauthorized request, blog was created by someone else');
  }
  const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
  res.status(200).json(deletedBlog);
});

module.exports = blogsRouter;
