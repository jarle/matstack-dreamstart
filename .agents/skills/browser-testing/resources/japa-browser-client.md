# Browser client (Plugins) | Japa Documentation


# [Browser client](#browser-client)

The browser client of Japa is built on top of [Playwright library](https://playwright.dev/docs/library) and integrates seamlessly with the Japa test runner. Following are some reasons to use this plugin over manually interacting with the Playwright API.

-   Automatic management of browsers and browser contexts.
-   Built-in assertions.
-   Ability to extend the `browser`, `context`, and `page` objects using [decorators](#decorators).
-   Class-based pages and interactions to de-compose the page under test into smaller and reusable components.
-   Toggle headless mode, tracing, and browsers using CLI flags.

## [](#installation)Installation

The browser client plugin has peer dependencies on the [`@japa/assert`](/docs/plugins/assert) plugin and the [`playwright`](https://playwright.dev/docs/library) library. Make sure to install them before installing this plugin.

Peer dependencies

Copy code to clipboard

```
npm i -D @japa/assert playwright
```

Copy code to clipboard

```
npm i -D @japa/browser-client
```

And register it as a plugin within the entry point file, i.e. (`bin/test.js`)

Copy code to clipboard

```
import { assert } from '@japa/assert'
import { configure } from '@japa/runner'
import { browserClient } from '@japa/browser-client'

configure({
  plugins: [
    assert(),
    browserClient({
      runInSuites: ['browser']
    })
  ]
})
```

### [](#configuring-browser-suite)Configuring browser suite

You must configure a separate suite for browser tests. This ensures the rest of your tests do not get slow, as this plugin will create a new [browser context](https://playwright.dev/docs/api/class-browsercontext) for each test.

In the following example, we create two test suites, one for running browser tests and another for running unit tests. Also, we tell the `browserClient` plugin to create a new browser context only in the `browser` suite.

Copy code to clipboard

```
configure({
  suites: [
    {
      name: 'browser',
      timeout: 30 * 1000,
      files: ['tests/browser/**/*.spec.js'],
    },
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.js'],
    }
  ],
  plugins: [
    assert(),
    browserClient({
      runInSuites: ['browser']
    })
  ]
})
```

## [](#basic-example)Basic example

Once the setup is completed, you can write tests inside the `tests/browser` directory.

tests/browser/visit\_japa.spec.js

Copy code to clipboard

```
import { test } from '@japa/runner'

test('has docs for browser client', async ({ visit }) => {
  const page = await visit('https://japa.dev/docs')
  await page.getByRole('link', { name: 'Browser client' }).click()

  /**
   * Assertions
   */
  await page.assertPath('/docs/plugins/browser-client')
  await page.assertTextContains('body', 'Browser client')
})
```

Let's run the test using the `node bin/test.js` file.

Copy code to clipboard

```
node bin/test.js

# Run tests for browser suite
node bin/test.js browser

# Launch browser
node bin/test.js browser --headed

# Run in slow motion
node bin/test.js browser --headed --slow
```

## [](#browser-api)Browser API

Since the browser client plugin uses Playwright under the hood, you can access all the Playwright library methods. Refer to the following example for more information.

Copy code to clipboard

```
test('has docs for browser client', async ({
  browser,
  browserContext,
  visit
}) => {
  // Create new page
  const page = await browserContext.newPage()
  await page.goto(url)

  // Or use visit helper
  const page = await visit(url)

  // Create multiple contexts
  const context1 = await browser.newContext()
  const context2 = await browser.newContext()
})
```

page

Reference to the [Playwright's Page class](https://playwright.dev/docs/api/class-page). You can get an instance of it either using the `visit` method or the `browserContext.newPage` method.

browserContext

Reference to the [Playwright's Context class](https://playwright.dev/docs/api/class-browsercontext). An isolated instance of `browserContext` is shared with every test.

browser

Reference to the [Playwright's Browser class](https://playwright.dev/docs/api/class-browser).

visit

A helper method to create a new page and visit a URL in a single step. The browser client plugin adds the `visit` helper.

## [](#configuration)Configuration

You can configure the plugin when registering it inside the `plugins` array. Following is the list of available options.

Copy code to clipboard

```
plugins: [
  browserClient({
    runInSuites: ['browser'],
    contextOptions: {},
    tracing: {
      enabled: false,
      event: 'onError',
      cleanOutputDirectory: true,
      outputDirectory: join(__dirname, '..')
    }
  })
]
```

runInSuites

Configure the plugin to run for selected test suites.

Copy code to clipboard

```
browserClient({
  runInSuites: ['browser'],
})
```

launcher

An optional function to manually launch a playwright browser. By default, we launch the chromium browser, and you can choose other browsers using the `--browser` flag.

You might want to implement this function if you need more control over launching a new browser with [custom options](https://playwright.dev/docs/api/class-browsertype#browser-type-launch).

Copy code to clipboard

```
import { firefox } from 'playwright'

browserClient({
  async launcher(options) {
    return firefox.launch({
      ...options,
      ...customOptionsToMerge
    })
  }
})
```

contextOptions

Configuration options to use when creating a new browser context behind the scenes. The `contextOptions` are given to the [`browser.newContext`](https://playwright.dev/docs/api/class-browser#browser-new-context) method as it is.

Copy code to clipboard

```
browserClient({
  contextOptions: {
    baseURL: 'http://localhost:3333',
    colorScheme: 'dark',
  }
})
```

tracing

The `tracing` property allows you to control the tracing event and options for generating test traces.

See also: [Tracing](#tracing-1)

Copy code to clipboard

```
import { join } from 'path'

browserClient({
  tracing: {
    enabled: false, // can be enabled using --trace flag
    event: 'onError',
    cleanOutputDirectory: true,
    outputDirectory: join(__dirname, '../tests/traces')
  }
})
```

## [](#cli-flags)CLI flags

You can use the following CLI flags to control the behavior of tests.

### [](#browser)browser

The `--browser` flag allows you to switch between browsers at runtime. This flag is only used when a custom [`launcher`](#launcher) method is not defined.

Copy code to clipboard

```
node bin/test.js --browser=chromium

node bin/test.js --browser=webkit

node bin/test.js --browser=firefox
```

### [](#trace)trace

The `--trace` flag allows you to enable the automatic tracing of tests. You must pass the event for tracing as the flag value.

Copy code to clipboard

```
# Generate trace file when a test fails
node bin/test.js --trace=onError

# Generate trace file for all tests
node bin/test.js --trace=onTest
```

### [](#slow)slow

The `--slow` flag allows you to enable slow mode. In slow mode, all operations will be slowed down by a specified amount of milliseconds.

Copy code to clipboard

```
# Slow operations by 100ms
node bin/test.js --slow

# Slow operations by 500ms
node bin/test.js --slow=500
```

### [](#devtools)devtools

Open the browser devtools automatically after launching the browser. The `--devtools` flag will disable the headless mode.

Copy code to clipboard

```
node bin/test.js --devtools
```

### [](#headed)headed

The `--headed` flag disables the headless mode.

Copy code to clipboard

```
node bin/test.js --headed
```

## [](#class-based-pages)Class-based pages

Pages serve as an organization layer for your tests. Instead of writing all the operations inline inside the test callback, you can use dedicated page classes to encapsulate the logic for a page or an interaction.

For example, if you are writing tests for a blog, you may create test pages for listing all posts, creating a post, viewing a post, and so on.

Let's create a page class for testing the posts list view. You can organize your tests and pages as you like, but we will keep the pages next within the test directory for this example.

Copy code to clipboard

```
tests/
├── browser
│   └── posts
│       ├── list.spec.js
│       └── pages
│           └── listing_page.js
```

### [](#create-the-listing-page)Create the listing page

A page must extend the `BasePage` class and define the URL to visit during the test. The primary goal of a page class is to encapsulate the testing behavior and expose a declarative API.

Copy code to clipboard

```
import { BasePage } from '@japa/browser-client'

export class PostsListingPage extends BasePage {
  url = '/posts'

  async assertHasEmptyList() {
    await this.page.assertTextContains('.posts_list', 'No posts found. Check back later')
  }

  async assertPostsCount(count: number) {
    await this.page.assertElementsCount('.post', count)
  }

  async assertHasPost(title: string) {
    await this.page.assertExists(
      this.page.locator('.post h2', { hasText: title })
    )
  }

  async paginateTo(page: number) {
    await this.page.locator('.pagination_links a', { hasText: String(page) }).click()
  }
}
```

Once you have created a page, you can import it inside a test and use its public API to test an endpoint behavior expressively.

Copy code to clipboard

```
import { test } from '@japa/runner'
import { PostsListingPage } from './pages/listing_page.js'

test.group('Posts | list', () => {
  test('see an empty list, when posts does not exists', async ({ visit }) => {
    const page = await visit(PostsListingPage)
    await page.assertHasEmptyList()
  })

  test('see first 10 posts', async ({ visit }) => {
    await PostsFactory.createMany(10)
    const page = await visit(PostsListingPage)
    await page.assertPostsCount(10)
  })

  test('navigate using pagination', async ({ visit }) => {
    const posts = await PostsFactory.createMany(20)

    const page = await visit(PostsListingPage)
    await page.paginateTo(2)
    await page.assertHasPost(posts[10].title)
  })
})
```

### [](#using-page-class-with-an-existing-page)Using page class with an existing page

You can use the Page classes with an existing page object using the `page.use` method. For example, you can create a page for viewing a single blog post and mount it inside an existing **CreatePostPage** or **UpdatePostPage**.

Copy code to clipboard

```
import { BasePage } from '@japa/browser-client'

export class ViewPostPage extends BasePage {
  async assertViewingPost(title: string) {
    await this.page.assertPathMatches(/\/posts\/[0-9]+/)

    await this.page.assertExists(
      this.page.locator('.post h1', { hasText: title })
    )
  }
}
```

Copy code to clipboard

```
import { ViewPostPage } from './pages/view_post_page.js'

test.group('Posts | create', () => {
  test('create post and redirect to single post view', async ({ visit }) => {
    const page = await visit('/posts/create')
    const post = await getPostData()
    await page.submitForm(post)

    await page
      .use(ViewPostPage)
      .assertViewingPost(post.title)
  })
})
```

## [](#debugging)Debugging

You can debug your tests using the `PWDEBUG` environment variable or by pausing the test using the `page.pause` method.

Copy code to clipboard

```
PWDEBUG=console node bin/test.js
```

Alongside the `page.pause` method, you can use the `page.pauseIf` and `page.pauseUnless` methods to pause the script conditionally.

Copy code to clipboard

```
test('visit home page', async ({ visit }) => {
  const page = await visit('/')
  await page.pauseIf(process.env.DEBUG_TEST)
  await page.pauseUnless(process.env.NO_DEBUG)
})
```

## [](#tracing)Tracing

Playwright supports generating traces for actions performed using the Playwright's API. Traces are stored as zip files on your computer, and you can view them using either [trace.playwright.dev](https://trace.playwright.dev/) or the `npx playwright show-trace trace-file.zip` command.

Using the `@japa/browser-client` plugin, you can automatically generate traces using the `--trace` CLI flag. The `--trace` flag accepts the event at which to create the trace file.

-   The `onError` event will generate trace files for failing tests.
-   The `onTest` event will generate trace files for all the tests.

Copy code to clipboard

```
node bin/test.js --trace=onError
```

You can control the output directory for trace files using the `tracing.outputDirectory` config option.

Copy code to clipboard

```
browserClient({
  tracing: {
    enabled: false, // will be enabled using the --trace flag
    event: 'onError',
    cleanOutputDirectory: true,
    outputDirectory: join(__dirname, '../tests/traces')
  }
})
```

## [](#switching-between-browsers)Switching between browsers

You can run your tests against different browsers using the `--browser` flag. Following is the list of valid browser options.

-   chromium
-   firefox
-   webkit

Copy code to clipboard

```
node bin/test.js --browser=firefox
node bin/test.js --browser=chromium
```

You may add the above commands as npm scripts and run them together if needed.

Copy code to clipboard

```
{
  "test:firefox": "node bin/test.js --browser=firefox",
  "test:chromium": "node bin/test.js --browser=chromium",
  "test": "npm run test:firefox && npm run test:chromium"
}
```

## [](#decorators)Decorators

The browser client plugin allows you to extend the [browser context](https://playwright.dev/docs/api/class-browsercontext) object, the [page](https://playwright.dev/docs/api/class-page) object, and the [response](https://playwright.dev/docs/api/class-response) object using decorators. You can create a custom decorator can register it with the `decoratorsCollection`.

Copy code to clipboard

```
import { decoratorsCollection } from '@japa/browser-client'

decoratorsCollection.register({
  /**
   * Extend page
   */
  page(page) {
    page.getWidth = function () {
      return this.viewportSize().width
    }
  },

  /**
   * Extend context
   */
  context(context) {
    context.injectShaHash = function () {
      this.exposeFunction('sha256', (text) => {
        return crypto.createHash('sha256').update(text).digest('hex')
      })
    }
  },
  
  /**
   * Extend response
   */
  response(response) {
    response.getResponseTime = function () {
      return this.headers()['x-response-time']
    }
  },
})
```

If you use TypeScript, you must use [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) to define types for the added properties and methods.

Copy code to clipboard

```
declare module 'playwright' {
  export interface Page {
    getWidth(): number
  }

  export interface BrowserContext {
    injectShaHash(): void
  }

  export interface Response {
    getResponseTime(): String | undefined
  }
}
```

## [](#assertions)Assertions

You can write assertions for a page using the `page.assert*` methods. All assertion methods are asynchronous, so `await` them.

### [](#assertexists)assertExists

Assert an element to exist. The method accepts either a string selector or the locator object.

Copy code to clipboard

```
const page = visit('/')

await page.assertExists('h2')
await page.assertExists(page.locator('h2', { hasText: 'It works!' }))
```

### [](#assertnotexists)assertNotExists

Assert an element not to exist. The method accepts either a string selector or the locator object.

Copy code to clipboard

```
const page = visit('/')

await page.assertNotExists('input[type="email"] + p')
await page.assertNotExists(page.getByRole('alert'))
```

### [](#assertelementscount)assertElementsCount

Assert an element to exist and have a matching count. The method accepts either a string selector or the locator object.

Copy code to clipboard

```
const page = visit('/')

await page.assertElementsCount('.posts', 10)
await page.assertElementsCount(page.locator('.posts'))
```

### [](#assertvisible)assertVisible

Assert an element to be visible. Elements with `display:none` and `visibility:hidden` are invisible.

Copy code to clipboard

```
const page = visit('/')
await page.getByText('Delete post').click()

await page.assertVisible('.confirmation-modal')
await page.assertVisible(
  page.getByText('Are you sure, you want to delete this post?')
)
```

### [](#assertnotvisible)assertNotVisible

Assert an element to be not visible. Elements with `display:none` and `visibility:hidden` are invisible.

Copy code to clipboard

```
const page = visit('/')

await page.assertNotVisible('.confirmation-modal')
await page.assertNotVisible(
  page.getByText('Are you sure, you want to delete this post?')
)
```

### [](#asserttitle)assertTitle

Assert the page title to match the expected value.

Copy code to clipboard

```
const page = visit('/')

await page.assertTitle('Home page')
```

### [](#asserttitlecontains)assertTitleContains

Assert the page title to include a substring value.

Copy code to clipboard

```
const page = visit('/posts/1')

await page.assertTitleContains('Post - ')
```

### [](#asserturl)assertUrl

Assert the page URL to match the expected value. The assertion is performed against the complete URL, including the domain and query string values.

Copy code to clipboard

```
const page = visit('/posts')

await page.assertUrl('https://foo.com/posts?order_by=popular')
```

### [](#asserturlcontains)assertUrlContains

Assert the page URL to contain the expected substring. The assertion is performed against the complete URL, including the domain and query string values.

Copy code to clipboard

```
const page = visit('/posts')

await page.assertUrlContains('/posts?')
```

### [](#asserturlmatches)assertUrlMatches

Assert the page URL to match the given regular expression.

Copy code to clipboard

```
const page = visit('/posts')

await page.assertUrlMatches(/posts(\?)?/)
```

### [](#assertpath)assertPath

Assert the page path to match the expected value. The URL is parsed using the Node.js URL parser, and the pathname value is used for assertion.

Copy code to clipboard

```
const page = visit('/posts/1')

await page.assertPath('/posts/1')
```

### [](#assertpathcontains)assertPathContains

Assert the page path to contain the expected substring. The URL is parsed using the Node.js URL parser, and the pathname value is used for assertion.

Copy code to clipboard

```
const page = visit('/posts/1')

await page.assertPathContains('/posts/')
```

### [](#assertpathmatches)assertPathMatches

Assert the page path to match the expected regex. The URL is parsed using the Node.js URL parser, and the pathname value is used for assertion.

Copy code to clipboard

```
const page = visit('/posts/1')

await page.assertPathMatches(/\/posts\/[0-9]+/)
```

### [](#assertquerystring)assertQueryString

Asserts the page URL querystring to contain values for the expected object.

Copy code to clipboard

```
const page = visit('/posts')
await page
  .locator('.pagination_links a', { hasText: '2' })
  .click()

await page.assertQueryString({ page: '2' })
```

### [](#assertcookie)assertCookie

Assert the cookie to exist and optionally match the expected value.

Copy code to clipboard

```
const page = visit('/')

await page.assertCookie('cart_items')
await page.assertCookie('cart_total', 80)
```

### [](#assertcookiemissing)assertCookieMissing

Assert cookie to be missing.

Copy code to clipboard

```
const page = visit('/')
await page.assertCookieMissing('cart_items')
```

### [](#asserttext)assertText

Assert the inner text of an element to match the expected value.

Copy code to clipboard

```
const page = visit('/')
await page.assertText('span.issues_count', '25 issues')

await page.assertText(
  page.getByTitle('Issues count'),
  '25 Issues'
)
```

### [](#asserttextcontains)assertTextContains

Assert the inner text of an element to include the expected substring.

Copy code to clipboard

```
const page = visit('/')
await page.assertTextContains('body', 'It works')
```

### [](#assertelementstext)assertElementsText

Assert the inner text of multiple elements to match the expected value.

Copy code to clipboard

```
const page = visit('/')
await page.assertElementsText('ul.todos > li', [
  'Buy groceries',
  'Publish browser client plugin',
])

const pendingTodos = page
  .locator('ul.todos > li')
  .filter({ has: await page.getByRole('checkbox').isChecked() })

await page.assertElementsText(
  pendingTodos,
  [
    'Buy groceries',
    'Publish browser client plugin',
  ]
)
```

### [](#assertchecked)assertChecked

Assert a checkbox to be checked.

Copy code to clipboard

```
const page = visit('/')

await page.assertChecked('input[name="terms"]')
```

### [](#assertnotchecked)assertNotChecked

Assert a checkbox not to be checked.

Copy code to clipboard

```
const page = visit('/')

await page.assertNotChecked('input[name="newsletter"]')
```

### [](#assertdisabled)assertDisabled

Assert an element to be disabled. All elements are enabled unless it is a `button`, `select`, `input`, or a `textarea` with a **disabled attribute**.

Copy code to clipboard

```
const page = visit('/')
await page.assertDisabled('button[type="submit"]')
```

### [](#assertnotdisabled)assertNotDisabled

Assert an element to be not disabled. All elements are enabled unless it is a `button`, `select`, `input`, or a `textarea` with a **disabled attribute**.

Copy code to clipboard

```
const page = visit('/')
await page.assertNotDisabled('button[type="submit"]')
```

### [](#assertinputvalue)assertInputValue

Assert the input value to match the expected value. The assertion must be performed against an `input`, `textarea`, or a `select` box.

Copy code to clipboard

```
const page = visit('/')
await page.assertInputValue('input[name="username"]', 'virk')
```

### [](#assertselectedoptions)assertSelectedOptions

Assert the select box selected options to match the expected values.

Copy code to clipboard

```
const page = visit('/')
await page.assertSelectedOptions('select[name="tags"]', [
  'js',
  'css',
  'html'
])
```

© 2026 Japa.dev [Edit this page](https://github.com/japa/japa.dev/blob/next/content/docs/plugins/browser_client.md)

### On this page
