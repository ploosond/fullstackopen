import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

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
    container = render(<Blog blog={blog} />).container
  })

  test('render `title` and `author` without `url` and `likes` by default', () => {
    const defaultDiv = container.querySelector('.defaultDiv')
    const toggledDiv = container.querySelector('.toggledDiv')
    expect(defaultDiv).toHaveStyle(`display : block`)
    expect(toggledDiv).toHaveStyle(`display : none`)
    expect(defaultDiv).toHaveTextContent('10 Fundaments of React')
    expect(defaultDiv).toHaveTextContent('Don John')
    expect(defaultDiv).not.toHaveTextContent('100')
    expect(defaultDiv).not.toHaveTextContent('Super User')
  })
})
