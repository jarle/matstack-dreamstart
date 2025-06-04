import { adonisContext } from '@matstack/remix-adonisjs';
import { redirect, type MetaFunction } from 'react-router';
import { Container } from '~/components/Container.js';
import { Link } from '~/components/Link.js';
import { Route } from './+types/_index.js';


const serverAuth: Route.unstable_MiddlewareFunction = (
  { context },
  next
) => {
  console.log("Hello")
  const { http } = context.get(adonisContext);
  let user = http.auth.user
  console.log({ user })
  if (!user) {
    throw redirect("/login", 302);
  }
  next()
};

export const unstable_middleware = [serverAuth]

export const meta: MetaFunction = () => {
  return [{ title: 'New Dreamstart App' }, { name: 'description', content: 'Welcome to Dreamstart!' }]
}

export default function Index() {

  return (
    <Container
      title={<span>Welcome to Dreamstart</span>}
      subtitle={<div>by <Link to="https://matstack.dev">matstack.dev</Link></div>}
    >
      <div>This is the start of something great!</div>
      <div>With dreamstart you can build anything.</div>
    </Container>
  )
}
