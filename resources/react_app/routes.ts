import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";
import { flatRoutes } from "remix-flat-routes";

export const routes = remixRoutesOptionAdapter((defineRoutes) => {
  return flatRoutes("routes", defineRoutes, {
    appDir: 'resources/react_app',
  });
});

export default routes;