import {useLoaderData} from 'remix'
import type {LoaderFunction} from 'remix'

const stampyQuery = (title: string) =>
  `https://stampy.ai/w/api.php?action=query&prop=revisions&rvprop=content&rvslots=*&titles=${title}&format=json&formatversion=2`

export const loader: LoaderFunction = async () => {
  const getInvolvedResponse = await fetch(stampyQuery('Get involved'))
  const getInvolvedJson = await getInvolvedResponse.json()
  const getInvolvedContent = getInvolvedJson.query.pages[0].revisions[0].slots.main.content
  return getInvolvedContent.replace(/<!--[\w\W]*?-->/g, '')
}

export default function App() {
  const content = useLoaderData()

  return (
    <div>
      <h1>Stampy UI Testing Grounds</h1>
      <p>Debug response from server-side API call:</p>
      <code>{content}</code>
    </div>
  )
}
