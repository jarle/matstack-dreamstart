import { Outlet, useLoaderData } from 'react-router';
import { Container } from '~/components/container.js';
import { Header } from '~/components/header.js';
import { Route } from './+types/_layout.js';

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { http } = context
  const user = http.auth.user

  return {
    user: user ? {
      email: user.email
    } : undefined,
  }
}

export default function Page() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <Header user={data.user} />
      <Container>
        <Outlet />
      </Container>
    </div>
  )
}
