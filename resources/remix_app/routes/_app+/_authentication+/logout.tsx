
import { Button } from '#web/components/ui/button';
import { intentValidation } from '#web/utils/intent_validation';
import { redirect, useFetcher } from 'react-router';
import { Route } from './+types/logout.js';

const actionValidator = intentValidation({
  log_out: {},
})

export const action = async ({ context }: Route.ActionArgs) => {
  const { http } = context
  const { intent } = await http.request.validateUsing(actionValidator)

  if (intent === 'log_out') {
    await http.auth.use('web').logout()
    throw redirect('/login')
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