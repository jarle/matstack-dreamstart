import vine from '@vinejs/vine';
import { useEffect } from 'react';
import { Form, useFetcher, useLoaderData } from 'react-router';
import { intentValidation } from '../../utils/intent-validation.js';
import { Route } from './+types/theme.js';

export const themeCookie = 'app-theme'

const actionValidator = intentValidation({
  'change-theme': {
    theme: vine.enum(['dark', 'light', 'system'])
  },
  'set-prefer-dark-mode': {
    prefersDarkMode: vine.boolean()
  }
})

export const action = async ({ context }: Route.ActionArgs) => {
  const { http } = context
  const r = await http.request.validateUsing(actionValidator)
  if (r.intent === 'change-theme') {
    if (r.theme === 'system') {
      http.response.clearCookie(themeCookie)
    } else {
      http.response.cookie(themeCookie, r.theme)
    }
  } else if (r.intent === 'set-prefer-dark-mode') {
    context.http.response.cookie('prefers-dark-mode', r.prefersDarkMode)
  }

  return null
}

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { http } = context

  return {
    theme: http.request.cookie(themeCookie, 'system')
  }
}

export function useTheme() {
  const fetcher = useFetcher()

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!document.cookie.includes(themeCookie)) {
      fetcher.submit({
        intent: 'set-prefer-dark-mode',
        prefersDarkMode
      }, {
        action: '/resources/theme',
        method: 'POST',
      })
    }
  }, [])

}

export function ThemeSelector() {
  const fetcher = useFetcher()
  const { theme } = useLoaderData()

  return (
    <div>
      <Form method='POST'>
        <input type='hidden' name='intent' value='change-theme' />

        <select
          name='theme'
          defaultValue={theme}
          className="w-full max-w-xs"
          onChange={(e) => {
            fetcher.submit(e.target.form, {
              action: '/resources/theme'
            })
          }}
        >
          <option value={'light'}>Light theme</option>
          <option value={'dark'}>Dark theme</option>
          <option value={'system'}>Auto</option>
        </select>
      </Form>
    </div>
  )

}