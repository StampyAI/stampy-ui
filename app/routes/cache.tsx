import {ActionFunctionArgs, LoaderFunctionArgs, json} from '@remix-run/cloudflare'
import {useLoaderData, useActionData, useNavigation, Form} from '@remix-run/react'
import React, {useEffect, useState} from 'react'
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

  const keys = await loadCacheKeys()

  // Pre-fetch titles for article-like keys (short keys with only alphanumeric chars)
  const articleKeys = keys.filter((key) => /^[A-Z0-9]{4}$/.test(key))

  // Load cached values and extract titles
  const titles: Record<string, string> = {}

  for (const key of articleKeys) {
    try {
      const value = await loadCacheValue(key)
      if (value) {
        const parsed = JSON.parse(value)
        if (parsed && parsed.data && parsed.data.title) {
          titles[key] = parsed.data.title
        }
      }
    } catch (e) {
      // Ignore errors for individual keys
    }
  }

  return json({keys, titles})
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
      await cleanCache(cacheKey)
      return json({message: 'Cache cleaned successfully'})
    } else if (actionKey === Actions.loadCache) {
      const value = await loadCacheValue(cacheKey)
      return json({cacheKey, cacheValue: value})
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
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
    return json({error: `Error processing cache action: ${errorMessage}`}, {status: 500})
  }
}

export default function Cache() {
  const loaderData = useLoaderData<typeof loader>()
  const keys = Array.isArray(loaderData) ? loaderData : loaderData.keys
  const articleTitles: Record<string, string> = Array.isArray(loaderData)
    ? {}
    : loaderData.titles || {}

  const actionData = useActionData<typeof action>()
  const transition = useNavigation()
  // @ts-expect-error inferred type kinda looks OK, but TS is unhappy anyway
  const {error, message, cacheKey, cacheValue} = actionData ?? {}
  const [cacheValues, setCacheValues] = useState(() =>
    Object.fromEntries(keys.map((k) => [k, null]))
  )
  // Article titles are pre-loaded by the server and never change during the session
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
          <React.Fragment key={`fragment-${key}`}>
            <li style={{margin: '8px 0', display: 'flex'}}>
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
                <strong>
                  {key}
                  {articleTitles[key] && (
                    <span style={{fontWeight: 'normal', fontStyle: 'italic', marginLeft: '8px'}}>
                      ({articleTitles[key]})
                    </span>
                  )}
                </strong>
              </div>
            </li>
            {cacheValues[key] && (
              <li key={`${key}-value`} style={{marginTop: '-5px', marginBottom: '15px'}}>
                <div
                  style={{
                    marginLeft: '180px',
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
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </Form>
  )
}
