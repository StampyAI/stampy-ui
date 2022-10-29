import {useLoaderData} from '@remix-run/react'
import {loadCache} from '~/server-utils/kv-cache'

export const loader = async () => await loadCache()

export default function Cache() {
  const data = useLoaderData()

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
