import { Link } from './Link.js'

export function Header(props: { user?: { email: string } }) {
  return (
    <header className="flex items-center w-full px-12 border-b min-h-12 ">
      <div className="w-full mx-auto prose max-w-8xl">
        <Link to={props.user ? '/' : '/login'} className="text-2xl font-black hover:no-underline">
          dreamstart
        </Link>
      </div>
    </header>
  )
}
