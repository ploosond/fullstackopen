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

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const totalLikesByAuthor = _.map(groupedByAuthor, (blogsByAuthor, author) => {
    const totalLikes = _.sumBy(blogsByAuthor, 'likes')
    return { author, likes: totalLikes }
  })

  return _.maxBy(totalLikesByAuthor, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
