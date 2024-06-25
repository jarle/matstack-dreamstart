import { type MetaFunction } from '@remix-run/node'
import { Container } from '~/components/Container.js'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export default function Index() {

  return (
    <Container
      title='Welcome to Dreamstart'
      subtitle='by @matstack'
    >
      <div>This is the start of something great!</div>
      <div>With dreamstart you can build anything.</div>
    </Container>
  )
}
