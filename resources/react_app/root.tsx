import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router'

import { Route } from './+types/root.js'
import { themeCookie } from './routes/resources+/theme.js'
import './tailwind.css'

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { http } = context
  let theme = http.request.cookie(themeCookie, 'system')
  if (!theme) {
    const prefersDarkMode = http.request.cookie('prefers-dark-mode', 'system')
    if (prefersDarkMode) {
      theme = 'dark'
    } else {
      theme = 'light'
    }
  }

  return {
    theme,
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useLoaderData()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={theme}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
