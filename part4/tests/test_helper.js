const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Mastering the Art of Backend Deployment with Node.js',
    author: 'Jane Doe',
    url: 'www.techjourneyblog.com/backend-nodejs-deployment',
    likes: 10,
  },
  {
    title: '10 Tips for Building a Scalable E-commerce Platform',
    author: 'John Smith',
    url: 'John Smith',
    likes: 857,
  },
]

const BlogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = { initialBlogs, BlogsInDb }
