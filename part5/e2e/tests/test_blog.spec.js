const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { title } = require('process')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Prajwol Devkota',
        username: 'ploosond',
        password: 'apple',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await page.getByRole('button', { name: 'login' }).click()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'ploosond', 'apple')
      await expect(page.getByText('Prajwol Devkota logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'ploosond', 'ball')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'ploosond', 'apple')
      })

      test('a new blog can be created', async ({ page }) => {
        const blog = {
          title:
            'Enhancing Frontend Performance: Best Practices for Developers',
          author: 'Sarah Thompson',
          url: 'https://frontendfocus.io/performance-best-practices',
        }
        await createBlog(page, blog.title, blog.author, blog.url)
        await expect(
          page.getByText(`a  new blog ${blog.title} by ${blog.author}`)
        ).toBeVisible()
      })
    })
  })
})
