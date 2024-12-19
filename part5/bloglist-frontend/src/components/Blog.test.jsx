import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const mockHandler = vi.fn()

  beforeEach(() => {
    const blog = {
      title: '10 Fundaments of React',
      author: 'Don John',
      url: 'www.example101.com',
      likes: '100',
      user: {
        name: 'Super User',
      },
    }
    container = render(
      <Blog blog={blog} handleUpdateBlog={mockHandler} />
    ).container
  })

  test('render `title` and `author` without `url` and `likes` by default', () => {
    const defaultDiv = container.querySelector('.defaultDiv')
    const toggledDiv = container.querySelector('.toggledDiv')
    expect(defaultDiv).toHaveStyle('display : block')
    expect(toggledDiv).toHaveStyle('display : none')
  })

  test('render `url` and `likes` once `show` button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const defaultDiv = container.querySelector('.defaultDiv')
    const toggledDiv = container.querySelector('.toggledDiv')
    expect(defaultDiv).toHaveStyle('display : none')
    expect(toggledDiv).toHaveStyle('display : block')
  })

  test('twice `likes` button click ensures event handler received as a props twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
