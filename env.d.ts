import type { AdonisApplicationContext } from '@matstack/react-adonisjs/types';

declare module 'react-router' {
  interface RouterContextProvider extends AdonisApplicationContext { }

  interface LoaderFunctionArgs {
    context: AdonisApplicationContext;
  }

  interface ActionFunctionArgs {
    context: AdonisApplicationContext;
  }
}
