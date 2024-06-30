type LazyService<T = any> = () => Promise<{ default: T }>

// Register services that should be available in the container here
export const ServiceProviders = {
  email_login: () => import('./email_login_service.js'),
  user_service: () => import('./user_service.js'),
} satisfies Record<string, LazyService>
