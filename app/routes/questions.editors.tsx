import {Header, Footer} from '~/components/layouts'
import {fetchAllQuestionsOnSite} from '~/routes/questions.allQuestionsOnSite'
import type {Question} from '../server-utils/stampy'

const formatTwineQuestion = ({title, text, relatedQuestions, tags}: Question) => {
  const formattedTags = tags.map((t) => t.replaceAll(' ', '-')).join(' ')
  const links = relatedQuestions.map(({title}) => `[[${title}]]`).join('\n')

  return `:: ${title} [${formattedTags}] {"size":"100,100"}\n${text}\n${links}`
}

const generateTwine = (data: Question[]) => {
  const first = data.filter(({pageid}) => pageid == '9OGZ')[0]

  return (
    `:: StoryTitle
Stampy


:: StoryData
{
"ifid": "3B314495-7266-46FE-AD5E-96C9F6FD54D4",
"format": "Snowman",
"format-version": "2.0.2",
"start": "${first.title}",
"zoom": 1
}
    ` + data.map(formatTwineQuestion).join('\n\n')
  )
}

export default function App() {
  const downloadTwine = async () => {
    const {data} = await fetchAllQuestionsOnSite()

    const blob = new Blob([generateTwine(data)], {type: 'text/plain'})

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary "download" link
    const link = document.createElement('a')
    link.href = url
    link.download = 'stampy.twee'

    // Programatically triggering the download
    link.click()

    // Cleanup: removing the temporary URL object
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Header />
      <main>
        <ul className="urls">
          <li>
            <a href="/questions/cache">Cache</a>
          </li>
          <li>
            <a href="/random">Random question</a>
          </li>
          <li>
            <a href="/toc">Table of Contents</a>
          </li>
          <li>
            <button onClick={downloadTwine}>Download questions for Twine</button>
          </li>
        </ul>
      </main>

      <Footer />
    </>
  )
}
