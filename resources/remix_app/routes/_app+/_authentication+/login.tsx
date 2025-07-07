import { Button } from '#web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#web/components/ui/card";
import { Input } from "#web/components/ui/input";
import { Form, isRouteErrorResponse, useActionData, useRouteError } from 'react-router';

import { Alert, AlertDescription, AlertTitle } from '#web/components/ui/alert';
import { intentValidation } from '#web/utils/intent_validation';
import vine from '@vinejs/vine';
import { AlertCircle } from 'lucide-react';
import { redirect } from 'react-router';
import { Route } from './+types/login';

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
  const actionData = useActionData<typeof action>()

  return (
    <div className='flex flex-col items-center w-full'>
    <Form method='POST'>
        <div>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to sign in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <input type="hidden" name="intent" value="login" />
            <div className="grid gap-2">
              <Input name="email" type="email" placeholder="Email" required />
            </div>
            </CardContent>
            <CardFooter className='flex flex-col items-center gap-5'>
              <Button className="w-full" type='submit'>Sign in</Button>
              {actionData?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {actionData.error}
                  </AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </Card>
        </div>
      </Form>
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