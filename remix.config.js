const routes = (defineRoutes) =>
  defineRoutes((route) => {
    route('/*', 'routes/$redirects.tsx')
  })

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  routes,
  serverConditions: ["workerd", "worker", "browser"],
  serverMainFields: ['browser', 'module', 'main'],
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  serverDependenciesToBundle: [
    // bundle everything except the virtual module for the static content manifest provided by wrangler
    /^(?!.*\b__STATIC_CONTENT_MANIFEST\b).*$/,
  ],
  server: './server.ts',
  serverNodeBuiltinsPolyfill: {
    modules: {
      url: true,
    },
  },
}
