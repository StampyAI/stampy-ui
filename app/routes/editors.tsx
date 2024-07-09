import {useState} from 'react'
import Page from '~/components/Page'
import Button from '~/components/Button'
import '~/components/Chatbot/widgit.css'
import {Question} from '~/server-utils/stampy'
import {downloadZip} from 'client-zip'
import {fetchAllQuestionsOnSite} from './questions.allQuestionsOnSite'

const SINGLE_FILE_HTML = 'singleFileHtml'
const SINGLE_FILE_MARKDOWN = 'singleFileMarkdown'
const MULTI_FILE_HTML = 'multipleFilesMarkdown'
const MULTI_FILE_MARKDOWN = 'multipleFileHtml'

const downloadOptions = {
  [SINGLE_FILE_HTML]: 'Single HTML file',
  [MULTI_FILE_HTML]: 'Multiple HTML files',
  [SINGLE_FILE_MARKDOWN]: 'Single markdown file',
  [MULTI_FILE_MARKDOWN]: 'Multiple markdown files',
}

const makeZipFile = async (questions: Question[], extention: string) =>
  downloadZip(
    questions.map((q) => ({
      name: `${q.title}.${extention}`,
      lastModified: q.updatedAt,
      input: (extention === 'md' ? q.markdown : q.text) || '',
    }))
  ).blob()

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
    default:
      return 'questions'
  }
}

const toHtmlChunk = ({title, text}: Question) =>
  [
    '        <div>',
    `            <h2>${title}</h2>`,
    `            <div>${text}</div>`,
    '        </div>',
  ].join('\n')

const toMarkdownChunk = ({title, markdown}: Question) => `# ${title}\n\n${markdown}`

const htmlFile = (contents: string) => {
  const html = ['<!DOCTYPE html>', '<html>', '    <body>', contents, '    </body>', '/html>'].join(
    '\n'
  )
  return new Blob([html], {type: 'text/html'})
}

const getData = async (questions: Question[], selectedOption: string) => {
  switch (selectedOption) {
    case SINGLE_FILE_HTML:
      return htmlFile(questions.map(toHtmlChunk).join('\n\n\n'))
    case MULTI_FILE_HTML:
      return makeZipFile(questions, 'html')
    case SINGLE_FILE_MARKDOWN:
      return new Blob([questions.map(toMarkdownChunk).join('\n\n\n')], {type: 'text/markdown'})
    case MULTI_FILE_MARKDOWN:
      return makeZipFile(questions, 'md')
  }
}

const DownloadQuestions = () => {
  const [selectedOption, setSelectedOption] = useState(SINGLE_FILE_HTML)

  const download = async () => {
    const {data} = await fetchAllQuestionsOnSite()
    const blob = await getData(data, selectedOption)
    blob && (await downloadBlob(makeFilename(selectedOption), blob))
  }
  return (
    <div className="page-body full-height padding-top-32">
      <h4>Download all questions</h4>
      {Object.entries(downloadOptions).map(([id, label]) => (
        <div key={id}>
          <input
            type="radio"
            id={id}
            checked={id === selectedOption}
            name="download-format"
            value={id}
            onChange={(e) => setSelectedOption(e.target.id)}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
      <Button action={download}>Download</Button>
    </div>
  )
}

export default function EditorHelpers() {
  return (
    <Page noFooter>
      <DownloadQuestions />
    </Page>
  )
}
