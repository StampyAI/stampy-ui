import {LoaderFunctionArgs, json} from '@remix-run/cloudflare'
import {downloadZip} from 'client-zip'
import '~/components/Chatbot/widgit.css'
import {Question, QuestionStatus, loadAllQuestions} from '~/server-utils/stampy'
import {isAuthorized} from '~/routesMapper'

export const SINGLE_FILE_HTML = 'singleFileHtml'
export const SINGLE_FILE_MARKDOWN = 'singleFileMarkdown'
export const MULTI_FILE_HTML = 'multipleFilesMarkdown'
export const MULTI_FILE_MARKDOWN = 'multipleFileHtml'
export const SINGLE_FILE_JSON = 'singleFileJson'

export const downloadOptions = {
  [SINGLE_FILE_HTML]: 'Single HTML file',
  [MULTI_FILE_HTML]: 'Multiple HTML files',
  [SINGLE_FILE_MARKDOWN]: 'Single markdown file',
  [MULTI_FILE_MARKDOWN]: 'Multiple markdown files',
  [SINGLE_FILE_JSON]: 'As JSON',
}

export const makeZipFile = async (questions: Question[], extention: string) =>
  downloadZip(
    questions.map((q) => ({
      name: `${q.title}.${extention}`,
      lastModified: q.updatedAt,
      input: (extention === 'md' ? q.markdown : q.text) || '',
    }))
  )

export const toHtmlChunk = ({title, text}: Question) =>
  [
    '        <div>',
    `            <h2>${title}</h2>`,
    `            <div>${text}</div>`,
    '        </div>',
  ].join('\n')

export const toMarkdownChunk = ({title, markdown}: Question) => `# ${title}\n\n${markdown}`

export const htmlFile = (contents: string) =>
  ['<!DOCTYPE html>', '<html>', '    <body>', contents, '    </body>', '/html>'].join('\n')

const getData = async (questions: Question[], selectedOption: string) => {
  switch (selectedOption) {
    case SINGLE_FILE_HTML:
      return new Response(htmlFile(questions.map(toHtmlChunk).join('\n\n\n')), {
        headers: {'Content-Type': 'text/html'},
      })
    case MULTI_FILE_HTML:
      return makeZipFile(questions, 'html')
    case SINGLE_FILE_MARKDOWN:
      return new Response(questions.map(toMarkdownChunk).join('\n\n\n'), {
        headers: {'Content-Type': 'text/markdown'},
      })
    case MULTI_FILE_MARKDOWN:
      return makeZipFile(questions, 'md')
    case SINGLE_FILE_JSON:
      return json(questions)
    default:
      return json(
        {
          error:
            'Invalid dataType provided. Must be one of ' + Object.keys(downloadOptions).join(', '),
        },
        400
      )
  }
}

export const headers = () => ({
  'WWW-Authenticate': 'Basic',
})

type QuestionsFilter = 'all' | 'live' | 'inProgress'
const filteredQuestions = (questions: Question[], status: QuestionsFilter) => {
  switch (status) {
    case 'all':
      return questions
    case 'live':
      return questions?.filter((q) => q.status === QuestionStatus.LIVE_ON_SITE)
    case 'inProgress':
      return questions?.filter((q) => q.status !== QuestionStatus.LIVE_ON_SITE)
    default:
      throw 'Invalid questions filter provided. Must be one of "all", "live" or "inProgress"'
  }
}

export const loader = async ({request}: LoaderFunctionArgs) => {
  try {
    if (!isAuthorized(request)) {
      return json({authorized: false, data: [] as Question[]}, {status: 401})
    }

    const url = new URL(request.url)
    const params = new URLSearchParams(url.search)
    const dataType = params.get('dataType') || SINGLE_FILE_JSON
    const {data: allQuestions} = await loadAllQuestions(request)
    return getData(
      filteredQuestions(allQuestions, (params.get('questions') || 'all') as QuestionsFilter),
      dataType
    )
  } catch (e) {
    console.error(e)
    throw new Response(`Could not fetch all articles: ${e}`, {status: 500})
  }
}
