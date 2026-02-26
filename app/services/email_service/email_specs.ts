import env from '#start/env'

export const emailSpecs = {
  email_login: {
    from: env.get('EMAIL_AUTOMATION'),
    dummyData: {
      url: 'https://example.com',
    },
  },
  welcome: {
    from: env.get('EMAIL_OWNER'),
    dummyData: undefined,
  },
  account_deletion: {
    from: env.get('EMAIL_SUPPORT'),
    dummyData: undefined,
  },
} satisfies Record<string, { from: string; dummyData: Record<string, any> | undefined }>

export type Email = keyof typeof emailSpecs
