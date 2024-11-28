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

module.exports = { dummy, totalLikes, favoriteBlog }
