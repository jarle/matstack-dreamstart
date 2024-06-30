import { LinkProps, Link as RLink } from '@remix-run/react'
import { twMerge } from 'tailwind-merge'

export function Link(props: LinkProps) {
  const className = props.className || ''
  const merged = twMerge('no-underline hover:underline', className)
  return <RLink {...props} className={merged} />
}
