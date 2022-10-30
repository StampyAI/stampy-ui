import {useLoaderData, Form} from '@remix-run/react'
import {loadCache, cleanCache} from '~/server-utils/kv-cache'

export const loader = async () => await loadCache()

export const action = async () => await cleanCache()

export default function Cache() {
  const data = useLoaderData()

  return (
    <Form method="post">
      <button>Clean cache</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Form>
  )
}
