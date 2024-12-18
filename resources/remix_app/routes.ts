import { flatRoutes } from "@matstack/remix-flat-routes";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";

export const routes = remixRoutesOptionAdapter((defineRoutes) => {
  return flatRoutes("routes", defineRoutes, {
    appDir: 'resources/remix_app',
  });
});

export default routes;