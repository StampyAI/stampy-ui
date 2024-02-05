/** @type {import('@remix-run/dev').AppConfig} */
const routes = (defineRoutes) => {
  return defineRoutes((route) => {
    route('/*', 'routes/$redirects.tsx')
  })
}

module.exports = {
  serverConditions: ['worker'],
  serverMainFields: ['browser', 'module', 'main'],
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  serverDependenciesToBundle: 'all',
  server: './server.js',
  routes,
}
