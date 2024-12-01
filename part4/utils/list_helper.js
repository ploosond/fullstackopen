const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map((b) => b.likes)
  const withMostLikes = Math.max(...likes)
  return blogs.find((b) => b.likes === withMostLikes)
}

const mostBlogs = (blogs) => {
  const authorsAndCount = _.countBy(_.map(blogs, (o) => o.author))
  const maxBlogs = _.max(_.values(authorsAndCount))
  const authorWithMaxBlogs = _.findKey(authorsAndCount, (o) => o === maxBlogs)
  return { author: authorWithMaxBlogs, blogs: maxBlogs }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }
