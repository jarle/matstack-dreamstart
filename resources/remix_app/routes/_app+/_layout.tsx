import { Outlet, useLoaderData } from 'react-router';
import { Container } from '~/components/Container.js';
import { Header } from '~/components/Header.js';

import type { LoaderFunctionArgs } from 'react-router';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { http } = context
  const user = http.auth.user

  return {
    user: user ? {
      email: user.email
    } : undefined
  }
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
