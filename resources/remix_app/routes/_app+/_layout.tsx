import { Outlet, json, useLoaderData } from '@remix-run/react'
import { Container } from '~/components/Container.js'
import { Header } from '~/components/Header.js'

import type { LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { http } = context
  const user = http.auth.user

  return json({
    user: user ? {
      email: user.email
    } : undefined
  })
}

export default function Page() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <Header user={data.user} />
      <Container>
        <Outlet />
      </Container>
    </>
  )
}
