import { test } from '@japa/runner'
import { captureScreenshot } from './utils.js'

const suite = 'smoketest'

test('loads the landing page', async ({ visit }) => {
  const page = await visit('/')

  await page.waitForLoadState('networkidle')
  const loginHeading = page.getByRole('heading', { name: 'Login' })
  const homeHeading = page.getByText('Welcome to Dreamstart').first()
  await Promise.race([
    loginHeading.waitFor({ timeout: 30000 }),
    homeHeading.waitFor({ timeout: 30000 }),
  ])

  const pathname = new URL(page.url()).pathname
  if (!['/', '/login'].includes(pathname)) {
    throw new Error(`Unexpected smoke test path: ${pathname}`)
  }

  await captureScreenshot(page, suite, 'loads the landing page', '01-home')
})
