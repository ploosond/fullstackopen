import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let container
  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(<BlogForm handleNewBlog={mockHandler} />).container
  })

  test('form calls the event handler with the right details', async () => {
    const blog = {
      title: '10 Fundaments of React',
      author: 'Don John',
      url: 'www.example101.com',
    }
    const user = userEvent.setup()
    const title = screen.getByPlaceholderText('title')
    const author = screen.getByPlaceholderText('author')
    const url = screen.getByPlaceholderText('url')
    const button = screen.getByText('create')

    await user.type(title, blog.title)
    await user.type(author, blog.author)
    await user.type(url, blog.url)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toStrictEqual(blog.title)
    expect(mockHandler.mock.calls[0][0].author).toStrictEqual(blog.author)
    expect(mockHandler.mock.calls[0][0].url).toStrictEqual(blog.url)
  })
})
