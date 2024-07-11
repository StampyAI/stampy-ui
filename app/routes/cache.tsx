import {ActionFunctionArgs, LoaderFunctionArgs, json} from '@remix-run/cloudflare'
import {useLoaderData, useActionData, useNavigation, Form} from '@remix-run/react'
import {useEffect, useState} from 'react'
import {isAuthorized} from '~/routesMapper'
import {loadCacheKeys, loadCacheValue, cleanCache} from '~/server-utils/kv-cache'

enum Actions {
  delete = 'delete',
  reload = 'reload',
  loadCache = 'loadCache',
}

export const headers = () => ({
  'WWW-Authenticate': 'Basic',
})

export const loader = async ({request}: LoaderFunctionArgs) => {
  if (!isAuthorized(request)) {
    return json([] as string[], {status: 401})
  }

  return await loadCacheKeys()
}

export const action = async ({request}: ActionFunctionArgs) => {
  const data = Array.from(await request.formData()) as [Actions, string][]
  if (data.length !== 1) {
    return json(
      {error: `Expected only 1 formData key-value pair, got ${JSON.stringify(data)}`},
      {status: 400}
    )
  }
  const [actionKey, cacheKey] = data[0]
  if (actionKey === Actions.delete) {
    return cleanCache(cacheKey)
  } else if (actionKey === Actions.loadCache) {
    return json({cacheKey, cacheValue: await loadCacheValue(cacheKey)})
  } else if (actionKey === Actions.reload) {
    return null
  } else {
    return json({error: `Unknown action ${actionKey}`}, {status: 400})
  }
}

export default function Cache() {
  const keys = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const transition = useNavigation()
  // @ts-expect-error inferred type kinda looks OK, but TS is unhappy anyway
  const {error, cacheKey, cacheValue} = actionData ?? {}
  const [cacheValues, setCacheValues] = useState(() =>
    Object.fromEntries(keys.map((k) => [k, null]))
  )
  useEffect(() => {
    if (cacheKey) {
      setCacheValues((curr) => ({
        ...curr,
        [cacheKey]: cacheValue,
      }))
    }
  }, [cacheKey, cacheValue])

  return (
    <Form method="post" className="cache">
      <h1>Cached data</h1>
      <button name={Actions.delete}>Clean cache</button>
      <button name={Actions.reload}>Reload keys</button>
      {transition.state !== 'idle' && transition.state}
      {error && <div className="error">{error}</div>}
      <h2>Keys:</h2>
      <ul>
        {keys.length === 0 && <i>(the cache is empty)</i>}
        {keys.map((key) => (
          <li key={key}>
            {key}
            <button name={Actions.loadCache} value={key}>
              {cacheValues[key] ? 'Reload' : 'Show'} value
            </button>
            {cacheValues[key] && <pre>{cacheValues[key]}</pre>}
          </li>
        ))}
      </ul>
    </Form>
  )
}
