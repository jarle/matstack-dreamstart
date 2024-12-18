import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { Form, useFetcher } from 'react-router';
import vine from '@vinejs/vine'
import { useEffect } from 'react'
import { intentValidation } from '../../utils/intent-validation.js'

const actionValidator = intentValidation({
  'change-theme': {
    theme: vine.enum(['dark', 'app', 'system'])
  },
  'set-prefer-dark-mode': {
    prefersDarkMode: vine.boolean()
  }
})

export const action = async ({ context }: ActionFunctionArgs) => {
  const { http } = context
  const r = await http.request.validateUsing(actionValidator)
  if (r.intent === 'change-theme') {
    if (r.theme === 'system') {
      http.response.clearCookie('app-theme')
    } else {
      http.response.cookie('app-theme', r.theme)
    }
  } else if (r.intent === 'set-prefer-dark-mode') {
    context.http.response.cookie('prefers-dark-mode', r.prefersDarkMode)
  }

  return null
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { http } = context

  return {
    theme: http.request.cookie('app-theme', 'system')
  }
}

export function useTheme() {
  const fetcher = useFetcher()

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!document.cookie.includes("app-theme")) {
      fetcher.submit({
        intent: 'set-prefer-dark-mode',
        prefersDarkMode
      }, {
        action: '/resources/theme',
        method: 'POST'
      })
    }
  }, [])

}

export function ThemeSelector(props: { theme: string }) {
  const fetcher = useFetcher()

  return (
    <div>
      <Form method='POST'>
        <input type='hidden' name='intent' value='change-theme' />

        <select
          name='theme'
          defaultValue={props.theme}
          className="w-full max-w-xs select select-bordered"
          onChange={(e) => {
            fetcher.submit(e.target.form, {
              action: '/resources/theme'
            })
          }}
        >
          <option value={'app'}>Light theme</option>
          <option value={'dark'}>Dark theme</option>
          <option value={'system'}>Auto</option>
        </select>
      </Form>
    </div>
  )

}