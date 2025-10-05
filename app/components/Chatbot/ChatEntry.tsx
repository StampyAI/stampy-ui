import {ComponentType, ReactNode, useRef, useMemo, memo, Fragment} from 'react'
import {Link} from '@remix-run/react'
import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import Contents from '~/components/Article/Contents'
import Feedback, {logFeedback} from '~/components/Feedback'
import useGlossaryInjection from '~/hooks/useGlossaryInjection'
import './chat_entry.css'
import {formatCitations} from '~/hooks/useChat'
import type {
  Entry,
  AssistantEntry,
  ContentBlock,
  StampyEntry,
  Citation,
  ErrorMessage,
} from '~/hooks/useChat'

// icons
import IconBotSmall from '~/components/icons-generated/BotSmall'
import LinkIcon from '~/components/icons-generated/LinkOut'
import PersonIcon from '~/components/icons-generated/Person'
import StampyIcon from '~/components/icons-generated/Stampy'
import PersonInCircleIcon from '~/components/icons-generated/PersonInCircle'
import IconStampySmall from '~/components/icons-generated/StampySmall'
import QuestionMarkIcon from '~/components/icons-generated/QuestionMark'

const MAX_REFERENCES = 10

const AnswerInfo = ({
  answerType,
  hint,
}: {
  hint?: string
  answerType?: 'human' | 'bot' | 'error'
}) => {
  if (!answerType || !hint) return null
  return (
    <span className="info">
      {answerType === 'human' ? <PersonIcon /> : <IconBotSmall />}
      <span className="small grey">
        {answerType === 'human' ? 'Human-written' : 'Bot-generated'} response
      </span>
      <div className="icon-container leading-0">
        <QuestionMarkIcon className="hint" />
        <div className="hint-contents-container">
          <div className="hint-contents xs">{hint}</div>
        </div>
      </div>
    </span>
  )
}

type TitleProps = {
  title: string
  Icon: ({width, height}: {width: string; height: string}) => ReactNode
  answerType?: 'human' | 'bot' | 'error'
  hint?: string
}
const Title = ({title, Icon, answerType, hint}: TitleProps) => (
  <div className="title-container padding-bottom-8">
    <Icon width="40" height="40" />
    <div className="title-inner-container">
      <span className="default-bold">{title}</span>
      <AnswerInfo answerType={answerType} hint={hint} />
    </div>
  </div>
)

const UserQuery = ({content}: Entry) => (
  <div>
    <Title title="You" Icon={PersonInCircleIcon} />
    <div className="padding-left-56-rigid large-reading">{content}</div>
  </div>
)

const ReferenceSummary = ({
  title,
  authors,
  source,
  url,
  titleClass,
}: Citation & {titleClass?: string}) => {
  const referenceSources = {
    arxiv: 'Scientific paper',
    blogs: 'Blogpost',
    eaforum: 'EAForum',
    alignmentforum: 'AlignmentForum',
    lesswrong: 'LessWrong',
    arbital: 'Arbital',
    distill: 'Distill',
    'aisafety.info': 'AISafety.info',
    youtube: 'YouTube',
  }

  const Authors = ({authors}: {authors?: string[]}) => {
    if (!authors || !authors.length || authors.length === 0) return null
    return (
      <span className="authors">
        {authors.slice(0, 3).join(', ')}
        {authors.length <= 3 ? '' : ' et. al.'}
      </span>
    )
  }

  function convertAscii(str: string) {
    return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
  }

  return (
    <div>
      <div className={`black padding-bottom-8 ${titleClass}`}>{convertAscii(title)}</div>
      <div className="small">
        {source !== 'youtube' && (
          <>
            <Authors authors={authors} />
            <span>{'  ·  '}</span>
          </>
        )}
        <Link className="source-link teal-500" to={url} target="_blank" rel="noopener noreferrer">
          {referenceSources[source as keyof typeof referenceSources] || new URL(url).host}{' '}
          <LinkIcon width="16" height="16" />
        </Link>
      </div>
    </div>
  )
}

const ReferenceLink = memo(({id, index}: Citation) => (
  <span className="ref-container">
    <a
      id={`${id}-ref`}
      href={`#${id}`}
      className={`reference-link ref-${index}`}
      onClick={(e) => {
        e.preventDefault()
        document.getElementById(id!)?.scrollIntoView({block: 'start'})
      }}
    >
      <span>{index}</span>
    </a>
  </span>
))
ReferenceLink.displayName = 'ReferenceLink'

const Reference = (citation: Citation) => {
  return (
    <div key={citation.id} id={citation.id} className="reference padding-bottom-32">
      <div className={`reference-num small ref-${citation.index}`}>{citation.index}</div>
      <ReferenceSummary {...citation} />
    </div>
  )
}

const Citations = ({citations}: {citations?: Citation[]}) => {
  if (!citations || citations.length === 0) return null
  const uniqueCitations = Object.values(
    citations.reduce(
      (acc, citation) => ({...acc, [citation.id || '']: citation}),
      {} as {[key: string]: Citation}
    )
  )
  const sortedCitations = uniqueCitations.sort((a, b) => a.index - b.index)
  return (
    <>
      <hr />
      <div className="padding-top-56">
        {sortedCitations?.slice(0, MAX_REFERENCES).map(Reference)}
      </div>
    </>
  )
}

const PhaseState = memo(
  ({phase}: {phase?: AssistantEntry['phase']}) => {
    const phaseMessageClass = 'phase-message large-reading'
    const texts = {
      started: 'Loading: Sending query',
      semantic: 'Loading: Performing semantic search',
      history: 'Loading: Processing history',
      context: 'Loading: Creating context',
      prompt: 'Loading: Creating prompt',
      llm: 'Loading: Waiting for LLM',
    }

    const text = texts[phase as keyof typeof texts]
    if (!text) return null

    return (
      <p className={phaseMessageClass}>
        {text}
        <span className="animated-ellipsis"></span>
      </p>
    )
  },
  (prev, next) => prev.phase === next.phase
)
PhaseState.displayName = 'PhaseState'

const Thinking = ({thinking, isActive}: {thinking: string; isActive?: boolean}) => (
  <details className="phase-message">
    <summary className="grey large-reading">
      {isActive ? (
        <>
          Thinking<span className="animated-ellipsis"></span>
        </>
      ) : (
        'Thoughts'
      )}
    </summary>
    <div className="xs padding-top-8" style={{whiteSpace: 'pre-wrap'}}>
      {thinking}
    </div>
  </details>
)

const TOOL_DISPLAY_NAMES: Record<string, string> = {
  lw_af_arxivsafety_search: 'Searched articles',
  lw_af_arxivsafety_recent: 'Searched recent articles',
  lw_af_arxivsafety_get_doc: 'Viewed full article',
  lw_af_posts_sorted: 'Listed article names',
  lw_af_authors: 'Listed authors',
  lw_af_tags: 'Listed tags',
}

const toolDisplayName = (name: string) => TOOL_DISPLAY_NAMES[name] || name

/** Combined tool_use + tool_result view. Shows request and response in one collapsible. */
const ToolAction = ({
  name,
  input,
  model_output,
}: {
  name: string
  input: Record<string, any>
  model_output?: string
}) => (
  <details className="phase-message">
    <summary className="grey large-reading">{toolDisplayName(name)}</summary>
    <div className="xs padding-top-8" style={{maxHeight: '300px', overflow: 'auto'}}>
      <div style={{fontWeight: 'bold', marginBottom: '4px'}}>Request</div>
      <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(input, null, 2)}</pre>
      {model_output && (
        <>
          <div style={{fontWeight: 'bold', marginTop: '8px', marginBottom: '4px'}}>Response</div>
          <pre style={{whiteSpace: 'pre-wrap'}}>{model_output}</pre>
        </>
      )}
    </div>
  </details>
)

// Helper to process text nodes and replace citations with ReferenceLink components
const processCitationsInText = (
  text: string,
  citationsMap: Map<string, Citation> | undefined,
  no: number
): ReactNode[] => {
  const parts = text.split(/(\[\d+\])/)
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (match) {
      const refId = match[1]
      const ref = citationsMap?.get(refId)
      return ref ? (
        <ReferenceLink key={i} {...ref} id={`${ref.id}-${no}`} />
      ) : (
        <Fragment key={i}>{part}</Fragment>
      )
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

/** Render markdown text with citation references resolved to ReferenceLink components. */
const CitationMarkdown = memo(
  ({
    text,
    citationsMap,
    no,
  }: {
    text: string
    citationsMap: Map<string, Citation> | undefined
    no: number
  }) => {
    const processChildren = (Component: string) =>
      function CitationWrapper({node: _node, children, ...props}: any) {
        const childArray = Array.isArray(children) ? children : children != null ? [children] : []
        const processedChildren = childArray.flatMap((child: any, idx: number) => {
          if (typeof child === 'string') {
            return processCitationsInText(child, citationsMap, no)
          }
          return <Fragment key={idx}>{child}</Fragment>
        })
        return <Component {...props}>{processedChildren}</Component>
      }

    /* eslint-disable react-hooks/exhaustive-deps -- processChildren closes over citationsMap+no, which are the real deps */
    const components = useMemo(
      () => ({
        p: processChildren('p'),
        li: processChildren('li'),
        h1: processChildren('h1'),
        h2: processChildren('h2'),
        h3: processChildren('h3'),
        h4: processChildren('h4'),
        h5: processChildren('h5'),
        h6: processChildren('h6'),
        td: processChildren('td'),
        th: processChildren('th'),
        blockquote: processChildren('blockquote'),
      }),
      [citationsMap, no]
    )
    /* eslint-enable react-hooks/exhaustive-deps */

    return (
      <div className="padding-left-56-rigid large-reading">
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={components}
        >
          {formatCitations(text)}
        </Markdown>
      </div>
    )
  }
)
CitationMarkdown.displayName = 'CitationMarkdown'

/** Merge tool_use + following tool_result into paired ToolAction renders.
 * Returns a flat array of ReactNodes. tool_result blocks that follow a tool_use
 * are consumed into the preceding ToolAction; standalone blocks render normally.
 */
const renderBlocks = (
  blocks: ContentBlock[],
  citationsMap: Map<string, Citation> | undefined,
  no: number,
  isActive: boolean
) => {
  // Build tool_use_id -> tool_result map for correct pairing (handles parallel tool calls)
  const resultsByUseId = new Map<string, ContentBlock>()
  const pairedResultIndices = new Set<number>()
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.type === 'tool_result' && block.tool_use_id) {
      resultsByUseId.set(block.tool_use_id, block)
      pairedResultIndices.add(i)
    }
  }

  const elements: ReactNode[] = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.type === 'thinking') {
      elements.push(
        <Thinking
          key={i}
          thinking={block.thinking}
          isActive={isActive && i === blocks.length - 1}
        />
      )
    } else if (block.type === 'tool_use') {
      const result = block.id ? resultsByUseId.get(block.id) : undefined
      const model_output = result?.type === 'tool_result' ? result.model_output : undefined
      elements.push(
        <ToolAction key={i} name={block.name} input={block.input} model_output={model_output} />
      )
    } else if (block.type === 'tool_result') {
      if (!pairedResultIndices.has(i)) {
        // Standalone tool_result with no matching tool_use
        elements.push(
          <ToolAction key={i} name={block.tool} input={{}} model_output={block.model_output} />
        )
      }
      // Paired results are already shown via their tool_use -- skip
    } else if (block.type === 'text') {
      elements.push(
        <CitationMarkdown key={i} text={block.text} citationsMap={citationsMap} no={no} />
      )
    }
  }
  return elements
}

const ChatbotReply = ({
  question,
  phase,
  blocks,
  content,
  citationsMap,
  no,
}: AssistantEntry & {no: number}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const citations = [] as Citation[]
  citationsMap?.forEach((v) => {
    citations.push({...v, id: `${v.id}-${no}`})
  })
  citations.sort((a, b) => a.index - b.index)

  // Only inject glossary links when streaming is complete
  const isStreamingComplete = phase === 'followups' || phase === 'done'
  useGlossaryInjection({
    elementRef: contentRef,
    enabled: isStreamingComplete,
  })

  return (
    <div>
      <Title
        title="Stampy"
        Icon={IconStampySmall}
        answerType="bot"
        hint="Generated by an AI model"
      />
      <PhaseState phase={phase} />
      <article ref={contentRef} className="contents">
        {renderBlocks(blocks || [], citationsMap, no, phase !== 'done')}
      </article>
      <Citations citations={citations} />
      {['followups', 'done'].includes(phase || '') ? (
        <Feedback
          showForm
          className={citations && citations.length > 0 ? '' : 'padding-left-56-rigid'}
          pageid="chatbot"
          upHint="This response was helpful"
          downHint="This response was unhelpful"
          onSubmit={async (message: string, option?: string) =>
            logFeedback({message, option, type: 'bot', question, answer: content, citations})
          }
          options={[
            'Making things up',
            'Wrong subject',
            'Confusing',
            'Issues with sources',
            'Other',
          ]}
        />
      ) : undefined}
      {phase === 'followups' ? (
        <p className="followups">
          Checking for followups<span className="animated-ellipsis"></span>
        </p>
      ) : undefined}
    </div>
  )
}

const StampyArticle = ({pageid, content, title, no}: StampyEntry & {no: number}) => {
  const seenGlossaryTermsRef = useRef(new Set<string>())
  const hint = `This response is pulled from our article "${title}" which was written by members of AISafety.info`

  const uniqueReferences = (content: string, idFinder: string) =>
    content
      .replaceAll(new RegExp(`id="(${idFinder})"`, 'g'), `id="$1-${no}"`)
      .replaceAll(new RegExp(`href="#(${idFinder})"`, 'g'), `href="#$1-${no}"`)

  return (
    <div>
      <Title title="Stampy" Icon={StampyIcon} answerType="human" hint={hint} />
      <div className="answer">
        <article className="stampy">
          <Contents
            pageid={pageid || ''}
            html={uniqueReferences(content || 'Loading...', 'fn\\d+-.*?')}
            seenGlossaryTermsRef={seenGlossaryTermsRef}
          />
        </article>
        <Feedback
          className="padding-left-56-rigid"
          showForm
          pageid={pageid}
          upHint="This response was helpful"
          downHint="This response was unhelpful"
          onSubmit={async (message: string, option?: string) =>
            logFeedback({message, option, type: 'human', question: title, answer: content, pageid})
          }
          options={[
            'Making things up',
            'Wrong subject',
            'Confusing',
            'Issues with sources',
            'Other',
          ]}
        />
      </div>
    </div>
  )
}

const ErrorReply = ({content}: ErrorMessage) => {
  console.error(content)
  return (
    <div>
      <Title title="Error" Icon={StampyIcon} answerType="error" />
      <div>Sorry, something has gone wrong. Please ask your question again!</div>
    </div>
  )
}

const ChatEntry = (props: Entry) => {
  const roles = {
    user: UserQuery,
    stampy: StampyArticle,
    assistant: ChatbotReply,
    error: ErrorReply,
  } as {[k: string]: ComponentType<Entry>}
  const Role = roles[props.role] as ComponentType<Entry>
  if (!Role) return null
  return (
    <div className="chat-entry padding-bottom-56">
      <Role {...props} />
    </div>
  )
}

export default ChatEntry
