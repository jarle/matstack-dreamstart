import { ActionFunctionArgs } from '@remix-run/node'

import { redirect } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import vine from '@vinejs/vine'
import { Button } from '~/@/components/ui/button.js'
import { intentValidation } from '~/utils/intent-validation.js'

const actionValidator = intentValidation({
  log_out: {
    noop: vine.string().optional(),
  },
})

export const action = async ({ context }: ActionFunctionArgs) => {
  const { http } = context
  const { intent } = await http.request.validateUsing(actionValidator)

  if (intent === 'log_out') {
    await http.auth.use('web').logout()
    return redirect('/login')
  }
  return null
}

export const LogOutButton = () => {
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="POST" action='/logout'>
      <input type="hidden" name="intent" value={'log_out'} />
      <Button type={'submit'}>Log out</Button>
    </fetcher.Form>
  )
}