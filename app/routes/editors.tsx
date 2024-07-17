import {useState} from 'react'
import {LoaderFunctionArgs, json} from '@remix-run/cloudflare'
import Page from '~/components/Page'
import Button from '~/components/Button'
import '~/components/Chatbot/widgit.css'
import {Question, QuestionStatus, loadAllQuestions} from '~/server-utils/stampy'
import {useLoaderData} from '@remix-run/react'
import {isAuthorized} from '~/routesMapper'
import {
  MULTI_FILE_HTML,
  MULTI_FILE_MARKDOWN,
  SINGLE_FILE_HTML,
  SINGLE_FILE_JSON,
  SINGLE_FILE_MARKDOWN,
  downloadOptions,
  htmlFile,
  makeZipFile,
  toHtmlChunk,
  toMarkdownChunk,
} from './questions.allQuestions'

const downloadBlob = async (filename: string, blob: Blob) => {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  link.remove()
}

const makeFilename = (selectedOption: string) => {
  switch (selectedOption) {
    case SINGLE_FILE_HTML:
      return 'questions.html'
    case SINGLE_FILE_MARKDOWN:
      return 'questions.md'
    case MULTI_FILE_HTML:
    case MULTI_FILE_MARKDOWN:
      return 'questions.zip'
    case SINGLE_FILE_JSON:
      return 'questions.json'
    default:
      return 'questions'
  }
}

const getData = async (questions: Question[], selectedOption: string) => {
  switch (selectedOption) {
    case SINGLE_FILE_HTML:
      return new Blob([htmlFile(questions.map(toHtmlChunk).join('\n\n\n'))], {type: 'text/html'})
    case MULTI_FILE_HTML:
      return (await makeZipFile(questions, 'html')).blob()
    case SINGLE_FILE_MARKDOWN:
      return new Blob([questions.map(toMarkdownChunk).join('\n\n\n')], {type: 'text/markdown'})
    case MULTI_FILE_MARKDOWN:
      return (await makeZipFile(questions, 'md')).blob()
    case SINGLE_FILE_JSON:
      return new Blob([JSON.stringify(questions, null, 2)], {type: 'application/json'})
  }
}

type DownloadQuestionsProps = {
  title: string
  type: string
  questions: Question[]
}
const DownloadQuestions = ({title, type, questions}: DownloadQuestionsProps) => {
  const [selectedOption, setSelectedOption] = useState(SINGLE_FILE_HTML)

  const download = async () => {
    const blob = await getData(questions, selectedOption)
    blob && (await downloadBlob(makeFilename(selectedOption), blob))
  }
  return (
    questions &&
    questions.length > 0 && (
      <div className="padding-top-32">
        <h4>{title}</h4>
        {Object.entries(downloadOptions).map(([id, label]) => (
          <div key={id}>
            <input
              type="radio"
              id={id}
              checked={id === selectedOption}
              name={`download-format-${type}`}
              value={id}
              onChange={(e) => setSelectedOption(e.target.id)}
            />
            <label htmlFor={id} onClick={() => setSelectedOption(id)}>
              {label}
            </label>
          </div>
        ))}
        <Button action={download}>Download</Button>
      </div>
    )
  )
}

export const headers = () => ({
  'WWW-Authenticate': 'Basic',
})

export const loader = async ({request}: LoaderFunctionArgs) => {
  try {
    if (!isAuthorized(request)) {
      return json({authorized: false, data: [] as Question[]}, {status: 401})
    }

    return await loadAllQuestions(request)
  } catch (e) {
    console.error(e)
    throw new Response('Could not fetch all articles', {status: 500})
  }
}

export default function EditorHelpers() {
  const {data: questions} = useLoaderData<typeof loader>()

  return (
    <Page noFooter>
      <div className="page-body full-height padding-top-32">
        {(!questions || !questions.length) && <div>Fetching questions...</div>}
        <DownloadQuestions title="Download all questions" questions={questions} type="all" />
        <DownloadQuestions
          title="Download all published questions"
          type="live"
          questions={questions?.filter((q) => q.status === QuestionStatus.LIVE_ON_SITE)}
        />
        <DownloadQuestions
          title="Download all non published questions"
          type="inProgress"
          questions={questions?.filter((q) => q.status !== QuestionStatus.LIVE_ON_SITE)}
        />
      </div>
    </Page>
  )
}
