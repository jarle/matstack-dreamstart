import fs from 'node:fs/promises'
import path from 'node:path'

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const screenshotPath = (suite: string, testTitle: string, step: string) =>
  `tmp/browser/${slug(suite)}/${slug(testTitle)}/${step}.png`

export const captureScreenshot = async (
  page: { screenshot: (options: { path: string; fullPage?: boolean }) => Promise<unknown> },
  suite: string,
  testTitle: string,
  step: string,
  options?: { fullPage?: boolean }
) => {
  const filePath = screenshotPath(suite, testTitle, step)
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await page.screenshot({ path: filePath, fullPage: true, ...options })
  return filePath
}
