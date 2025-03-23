import { isRouteErrorResponse, useRouteError } from 'react-router';

import vine from '@vinejs/vine';
import { redirect } from 'react-router';
import { intentValidation } from '~/utils/intent-validation.js';
import { Route } from './+types/_route.js';
import { LoginForm } from './login-form.js';

const actionValidator = intentValidation({
  login: {
    email: vine.string().email().toLowerCase(),
  },
})

export const action = async ({ context }: Route.ActionArgs) => {
  const { http, make } = context
  const { intent, email } = await http.request.validateUsing(actionValidator)

  const service = await make('email_login')

  if (intent === 'login') {
    if (!service.isValid(email)) {
      return {
        error: 'Invalid email provider. Please use a different email.'
      }
    }
    const canTry = await service.registerAttempt(http)
    if (!canTry) {
      http.logger.warn(`IP ${http.request.ip()} has exceeded login attempts, tried with ${email}`)
      return {
        error: 'Too many attempts. Please try again later.'
      }
    }
    service.sendLoginLink(email)
    throw redirect(`/check-email?email=${email}`)
  } else {
    http.logger.error(`Invalid intent ${intent} for login route`)
  }
  return null
}

export default function Page() {
  return (
    <div className='flex flex-col items-center w-full'>
      <LoginForm />
    </div>
  )
}

// https://remix.run/docs/en/main/route/error-boundary
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}