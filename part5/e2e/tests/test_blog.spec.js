const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { title } = require('process')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Super User',
        username: 'root',
        password: 'apple',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await page.getByRole('button', { name: 'login' }).click()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'apple')
      await expect(page.getByText('Super User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'ball')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'root', 'apple')
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

      describe('When a blog is created', () => {
        beforeEach(async ({ page }) => {
          const blog1 = {
            title: 'Blog1 By Super User',
            author: 'Don Joe',
            url: 'https://example101.react',
          }
          // const blog2 = {
          //   title: 'Blog2 By Super User',
          //   author: 'Don Joe',
          //   url: 'https://example101.react',
          // }
          await createBlog(page, blog1.title, blog1.author, blog1.url)
          // await createBlog(page, blog2.title, blog2.author, blog2.url)
        })

        test('and a blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('and user who added blog can delete it', async ({ page }) => {
          await expect(
            page.getByText('Blog1 By Super User Don Joe view')
          ).toBeVisible()
          await page.getByRole('button', { name: 'view' }).click()
          await expect(
            page.getByRole('button', { name: 'remove' })
          ).toBeVisible()
          page.on('dialog', (dialog) => dialog.accept())
          await page.getByRole('button', { name: 'remove' }).click()
          await expect(
            page.getByText('Blog1 By Super User Don Joe view')
          ).not.toBeVisible()
        })

        test('and only user who added blog sees delete button', async ({
          page,
          request,
        }) => {
          await request.post('/api/users', {
            data: {
              name: 'Prajwol Devkota',
              username: 'ploosond',
              password: 'apple',
            },
          })

          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, 'ploosond', 'apple')
          const blog2 = {
            title: 'Blog2 By Prajwol Devkota',
            author: 'Don Joe',
            url: 'https://example101.react',
          }

          await createBlog(page, blog2.title, blog2.author, blog2.url)
          const blogByPloosondText = await page.getByText(
            'Blog2 By Prajwol Devkota Don Joe view'
          )

          const blogByPloosondElement = await blogByPloosondText.locator('..')
          await blogByPloosondElement
            .getByRole('button', { name: 'view' })
            .click()
          await expect(
            blogByPloosondElement.getByRole('button', { name: 'remove' })
          ).toBeVisible()

          const blogByRootText = await page.getByText(
            'Blog1 By Super User Don Joe view'
          )

          const blogByRootElement = await blogByRootText.locator('..')
          await blogByRootElement.getByRole('button', { name: 'view' }).click()
          await expect(
            blogByRootElement.getByRole('button', { name: 'remove' })
          ).not.toBeVisible()
        })

        describe('when several blogs are added', () => {
          beforeEach(async ({ page, request }) => {
            await page.getByRole('button', { name: 'logout' }).click()
            await request.post('/api/testing/reset')
            await request.post('/api/users', {
              data: {
                name: 'Super User',
                username: 'root',
                password: 'apple',
              },
            })

            await page.goto('/')
            await page.getByTestId('username').fill('root')
            await page.getByTestId('password').fill('apple')
            await page.getByRole('button', { name: 'login' }).click()

            await createBlog(page, 'Blog1', 'Prajwol', 'www.example.com')
            await createBlog(page, 'Blog2', 'Prajwol', 'www.example.com')
            await createBlog(page, 'Blog3', 'Prajwol', 'www.example.com')
          })

          test('blogs are arranged in the order according to the likes, the blog with the most likes first', async ({
            page,
          }) => {
            // blog 3
            const blogThree = await page.getByText('Blog3 Prajwol view')
            const blogThreeElement = await blogThree.locator('..')
            await blogThreeElement.getByRole('button', { name: 'view' }).click()
            await blogThreeElement.getByRole('button', { name: 'like' }).click()
            await blogThreeElement.getByRole('button', { name: 'like' }).click()
            await blogThreeElement.getByRole('button', { name: 'like' }).click()
            await expect(blogThreeElement.getByText('likes 3')).toBeVisible()
            // blog 2
            const blogTwo = await page.getByText('Blog2 Prajwol view')
            const blogTwoElement = await blogTwo.locator('..')
            await blogTwoElement.getByRole('button', { name: 'view' }).click()
            await blogTwoElement.getByRole('button', { name: 'like' }).click()
            await blogTwoElement.getByRole('button', { name: 'like' }).click()
            await expect(blogTwoElement.getByText('likes 2')).toBeVisible()
            // blog 1
            const blogOne = await page.getByText('Blog1 Prajwol view')
            const blogOneElement = await blogOne.locator('..')
            await blogOneElement.getByRole('button', { name: 'view' }).click()
            await blogOneElement.getByRole('button', { name: 'like' }).click()
            await expect(blogOneElement.getByText('likes 1')).toBeVisible()

            await expect(blogThreeElement).toContainText('Blog3')
            await expect(blogTwoElement).toContainText('Blog2')
            await expect(blogOneElement).toContainText('Blog1')
          })
        })
      })
    })
  })
})
