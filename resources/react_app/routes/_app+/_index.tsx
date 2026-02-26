import { Container } from '#web/components/Container'
import { Link } from '#web/components/Link'
import { type MetaFunction } from 'react-router'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Dreamstart App' },
    { name: 'description', content: 'Welcome to Dreamstart!' },
  ]
}

export default function Index() {
  return (
    <Container
      title={<span>Welcome to Dreamstart</span>}
      subtitle={
        <div>
          by <Link to="https://matstack.dev">matstack.dev</Link>
        </div>
      }
    >
      <div>This is the start of something great!</div>
      <div>With dreamstart you can build anything.</div>
    </Container>
  )
}
