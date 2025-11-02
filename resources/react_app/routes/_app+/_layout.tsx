import { Container } from '#web/components/Container';
import { Header } from '#web/components/Header';
import { Outlet } from 'react-router';
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

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <Header user={loaderData.user} />
      <Container>
        <Outlet />
      </Container>
    </div>
  )
}
