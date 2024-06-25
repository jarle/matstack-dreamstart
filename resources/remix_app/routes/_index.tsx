import { type MetaFunction } from '@remix-run/node'
import { Container } from '~/components/Container.js'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {

  return (
    <Container
      title={<span>Welcome to Dreamstart</span>}
      subtitle={<div>by @matstack</div>}
    >
      <div>This is the start of something great!</div>
      <div>With dreamstart you can build anything.</div>
    </Container>
  )
}
