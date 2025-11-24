import {useState} from 'react'
import {ShouldRevalidateFunction} from '@remix-run/react'
import Page from '~/components/Page'
import {Entry, Mode} from '~/hooks/useChat'
import {PlaygroundSettings, DEFAULT_FILTERS} from '~/components/Playground/Settings'
import {PlaygroundPrompts} from '~/components/Playground/Prompts'
import {PlaygroundChat} from '~/components/Playground/PlaygroundChat'
import {usePlaygroundSettings} from '~/hooks/usePlaygroundSettings'

export const shouldRevalidate: ShouldRevalidateFunction = () => false

const DEFAULT_PROMPTS = {
  system: `
<miri-core-points>
<entire-source id="LL">
{yudkowsky-list-of-lethalities-2507132226-e11d43}
</entire-source>

<entire-source id="TP">
{miri-the-problem-2507121135-b502d1}
</entire-source>

<entire-source id="TB">
{miri-the-briefing-2507132220-44fbe5}
</entire-source>

<main-points>
{miri-the-problem-main-points-2507132222-1916a0}
</main-points>
</miri-core-points>
`,
  history: '{stampy-history-2507211352-060b74}',
  history_summary: '{stampy-history_summary-2507231056-b048af}',
  pre_message: '',
  post_message: `
{post_message_new_noconfabwarn-2509230637-b187dc}

{mode}`,
  hyde_pre_message: '',
  hyde_post_message: '{post_message_new_noconfabwarn_hyde-2509230634-645a9b}',
  message_format: '<from-public-user id="{message_id}">\n{message}\n</from-public-user>',
  modes: {
    default: '',
    concise: '{mode-concise-2507231147-db01d9}',
    rookie: '{mode-rookie-2507231143-f32d39}',
  },
}

const MODE_DESCRIPTIONS = {
  rookie:
    'For people who are new to the field of AI alignment. The answer might be longer, since technical terms will be explained in more detail and less background will be assumed.',
  concise:
    "Quick and to the point. Followup questions may need to be asked to get the full picture of what's going on.",
  default: 'A balanced default mode.',
}

export default function Playground() {
  const [sessionId] = useState(crypto.randomUUID())
  const [query, setQuery] = useState<string>('')
  const [history, setHistory] = useState<Entry[]>([])

  const {settings, changeSetting, changeSettings} = usePlaygroundSettings({
    mode: 'default',
    modelID: 'anthropic/claude-sonnet-4-20250514',
    encoder: 'cl100k_base',
    topKBlocks: 20,
    maxNumTokens: 200_000,
    tokensBuffer: 50,
    maxHistory: 10,
    maxHistorySummaryTokens: 200,
    historyFraction: 0.25,
    contextFraction: 0.5,
    enable_hyde: false,
    thinking_budget: 0,
    filters: DEFAULT_FILTERS,
    prompts: DEFAULT_PROMPTS,
  })

  const setMode = (mode: Mode) => {
    changeSetting(['mode'], mode)
  }

  return (
    <Page noFooter>
      <div className="full-height padding-top-32">
        <div
          style={{marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px'}}
        >
          {(['default', 'rookie', 'concise'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              title={MODE_DESCRIPTIONS[m]}
              style={{
                padding: '4px 8px',
                backgroundColor: settings.mode === m ? '#d3f2f0' : 'white',
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <div style={{display: 'flex', gap: '20px', maxWidth: 'none', width: '100%'}}>
          {/* Prompts panel - left */}
          <div style={{width: '400px', flexShrink: 0}}>
            <PlaygroundPrompts
              settings={settings}
              query={query}
              history={history}
              changeSettings={changeSettings}
            />
          </div>

          {/* Chat - center */}
          <div style={{flex: 1, minWidth: 0}}>
            <PlaygroundChat
              sessionId={sessionId}
              settings={settings}
              onQuery={setQuery}
              onNewEntry={setHistory}
            />
          </div>

          {/* Settings panel - right */}
          <div style={{width: '400px', flexShrink: 0}}>
            <PlaygroundSettings settings={settings} changeSettings={changeSettings} />
          </div>
        </div>
      </div>
    </Page>
  )
}
