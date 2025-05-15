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

  if (actionKey === Actions.delete) {
    await cleanCache(cacheKey)
    return json({message: 'Cache cleaned successfully'})
  } else if (actionKey === Actions.loadCache) {
    return json({cacheKey, cacheValue: await loadCacheValue(cacheKey)})
  } else if (actionKey === Actions.reload) {
    return null
  } else if (actionKey === Actions.clearSingleKey) {
    if (!cacheKey) {
      return json({error: 'No cache key provided for clearing'}, {status: 400})
    }

    await STAMPY_KV.delete(cacheKey)
    return json({message: `Successfully cleared cache for: ${cacheKey}`})
  } else {
    return json({error: `Unknown action ${actionKey}`}, {status: 400})
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
      {message && (
        <div className="success" style={{color: 'green', margin: '10px 0'}}>
          {message}
        </div>
      )}
      <h2>Keys:</h2>
      <ul style={{listStyleType: 'none', paddingLeft: 0}}>
        {keys.length === 0 && <i>(the cache is empty)</i>}
        {keys.map((key) => (
          <li key={key} style={{margin: '8px 0'}}>
            <div style={{display: 'flex'}}>
              <div style={{display: 'flex', marginRight: '10px'}}>
                <button name={Actions.loadCache} value={key} style={{marginRight: '4px'}}>
                  {cacheValues[key] ? 'Reload' : 'Show'} value
                </button>
                <button
                  name={Actions.clearSingleKey}
                  value={key}
                  style={{backgroundColor: '#ffcccc', color: '#333'}}
                  title="Delete this specific cache entry"
                >
                  Clear
                </button>
              </div>
              <div>
                <strong>{key}</strong>
              </div>
            </div>
            {cacheValues[key] && (
              <div
                style={{
                  marginLeft: '180px',
                  marginTop: '5px',
                  marginBottom: '15px',
                  padding: '16px',
                  backgroundColor: '#e0e0e0',
                  border: '1px solid #cccccc',
                  borderRadius: '4px',
                  overflow: 'auto',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    padding: 0,
                    color: '#333',
                    fontFamily: 'monospace',
                    backgroundColor: 'transparent',
                  }}
                >
                  {(() => {
                    // Handle different types of cache values with proper type checking
                    try {
                      const value = cacheValues[key]
                      if (value === null) {
                        return 'null'
                      }

                      if (typeof value === 'string') {
                        // Parse JSON string and format it
                        const parsedValue = JSON.parse(value)
                        return JSON.stringify(parsedValue, null, 2)
                      } else {
                        // Just format the existing value
                        return JSON.stringify(value, null, 2)
                      }
                    } catch (e) {
                      // Handle parsing errors by displaying raw value
                      return String(cacheValues[key] || '')
                    }
                  })()}
                </pre>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Form>
  )
}
