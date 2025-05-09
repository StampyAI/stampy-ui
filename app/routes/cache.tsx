import {ActionFunctionArgs, LoaderFunctionArgs, json} from '@remix-run/cloudflare'
import {useLoaderData, useActionData, useNavigation, Form} from '@remix-run/react'
import {useEffect, useState} from 'react'
import {isAuthorized} from '~/routesMapper'
import {loadCacheKeys, loadCacheValue, cleanCache} from '~/server-utils/kv-cache'

enum Actions {
  delete = 'delete',
  reload = 'reload',
  loadCache = 'loadCache',
  clearSingleKey = 'clearSingleKey',
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

  try {
    if (actionKey === Actions.delete) {
      console.log('Cleaning all cache');
      await cleanCache(cacheKey);
      return json({message: 'Cache cleaned successfully'});
    }

    else if (actionKey === Actions.loadCache) {
      console.log(`Loading cache value for: ${cacheKey}`);
      const value = await loadCacheValue(cacheKey);
      return json({cacheKey, cacheValue: value});
    }

    else if (actionKey === Actions.reload) {
      console.log('Reloading cache keys');
      return null;
    }

    else if (actionKey === Actions.clearSingleKey) {
      if (!cacheKey) {
        return json({error: 'No cache key provided for clearing'}, {status: 400});
      }

      console.log(`Clearing single cache key: ${cacheKey}`);
      await STAMPY_KV.delete(cacheKey);
      return json({message: `Successfully cleared cache for: ${cacheKey}`});
    }

    else {
      return json({error: `Unknown action ${actionKey}`}, {status: 400});
    }
  } catch (err) {
    console.error(`Error processing ${actionKey} for ${cacheKey}:`, err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return json({error: `Error processing cache action: ${errorMessage}`}, {status: 500});
  }
}

export default function Cache() {
  const keys = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const transition = useNavigation()
  // @ts-expect-error inferred type kinda looks OK, but TS is unhappy anyway
  const {error, message, cacheKey, cacheValue} = actionData ?? {}
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
      {message && <div className="success" style={{ color: 'green', margin: '10px 0' }}>{message}</div>}
      <h2>Keys:</h2>
      <ul>
        {keys.length === 0 && <i>(the cache is empty)</i>}
        {keys.map((key) => (
          <li key={key} style={{ margin: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <strong style={{ minWidth: '180px' }}>{key}</strong>
              <button name={Actions.loadCache} value={key}>
                {cacheValues[key] ? 'Reload' : 'Show'} value
              </button>
              <button
                name={Actions.clearSingleKey}
                value={key}
                style={{ backgroundColor: '#ffcccc', color: '#333' }}
                title="Delete this specific cache entry"
              >
                Clear
              </button>
            </div>
            {cacheValues[key] && <pre style={{ marginTop: '8px', marginLeft: '180px' }}>{cacheValues[key]}</pre>}
          </li>
        ))}
      </ul>
    </Form>
  )
}
