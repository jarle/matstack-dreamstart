import type { AdonisApplicationContext } from '@matstack/remix-adonisjs/types';

declare module 'react-router' {
  interface AppLoadContext extends AdonisApplicationContext { }

  interface LoaderFunctionArgs {
    context: unknown;
  }

  interface ActionFunctionArgs {
    context: unknown;
  }
}
