import {ChangeEvent} from 'react'
import {ChatSettings, SearchFilters} from '~/hooks/useChat'
import {SectionHeader, NumberInput, Slider, Checkbox, Select} from './htmlControls'

type Parseable = string | number | undefined

interface Model {
  maxNumTokens: number
  topKBlocks: number
}

export const MODELS: {[key: string]: Model} = {
  'openai/gpt-3.5-turbo': {maxNumTokens: 4095, topKBlocks: 10},
  'openai/gpt-3.5-turbo-16k': {maxNumTokens: 16385, topKBlocks: 30},
  'openai/o1': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/o1-mini': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/gpt-4': {maxNumTokens: 8192, topKBlocks: 20},
  'openai/gpt-4-turbo-preview': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/gpt-4o': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/gpt-4o-mini': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/o4-mini': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/o3': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/gpt-4.1-nano': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/gpt-4.1-mini': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/gpt-4.1': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/gpt-5-chat-latest': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/gpt-5-2025-08-07': {maxNumTokens: 128000, topKBlocks: 20},
  'openai/gpt-5': {maxNumTokens: 128000, topKBlocks: 20},
  'anthropic/claude-3-opus-20240229': {maxNumTokens: 200000, topKBlocks: 20},
  'anthropic/claude-3-5-sonnet-20240620': {maxNumTokens: 200_000, topKBlocks: 20},
  'anthropic/claude-3-5-sonnet-20241022': {maxNumTokens: 200_000, topKBlocks: 20},
  'anthropic/claude-3-5-sonnet-latest': {maxNumTokens: 200_000, topKBlocks: 20},
  'anthropic/claude-opus-4-20250514': {maxNumTokens: 200_000, topKBlocks: 20},
  'anthropic/claude-opus-4-1-20250805': {maxNumTokens: 200_000, topKBlocks: 20},
  'anthropic/claude-sonnet-4-20250514': {maxNumTokens: 200_000, topKBlocks: 20},
  'anthropic/claude-3-7-sonnet-latest': {maxNumTokens: 200_000, topKBlocks: 20},
  'google/gemini-2.5-flash': {maxNumTokens: 250_000, topKBlocks: 20},
  'google/gemini-2.5-pro': {maxNumTokens: 250_000, topKBlocks: 20},
  'openrouter/openai/gpt-5': {maxNumTokens: 128000, topKBlocks: 20},
  'openrouter/openai/gpt-oss-20b': {maxNumTokens: 128000, topKBlocks: 20},
  'openrouter/moonshotai/kimi-k2': {maxNumTokens: 128000, topKBlocks: 20},
}

export const ENCODERS = ['cl100k_base']

export const DEFAULT_FILTERS: SearchFilters = {
  miri_confidence: 6,
  miri_distance: [],
  needs_tech: false,
}

type ChatSettingsUpdate = [path: string[], value: any]

type ChatSettingsParams = {
  settings: ChatSettings
  changeSettings: (...v: ChatSettingsUpdate[]) => void
}

export const PlaygroundSettings = ({settings, changeSettings}: ChatSettingsParams) => {
  const changeVal = (field: string, value: any) => changeSettings([[field], value])
  const update = (field: string) => (event: ChangeEvent) =>
    changeVal(field, (event.target as HTMLInputElement).value)
  const updateNum = (field: string) => (num: Parseable) => changeVal(field, num)

  const updateTokenFraction = (field: string) => (num: Parseable) => {
    const bufferFraction =
      settings.tokensBuffer && settings.maxNumTokens
        ? settings.tokensBuffer / settings.maxNumTokens
        : 0
    const val = Math.min(parseFloat((num || 0).toString()), 1 - bufferFraction)

    let context = settings.contextFraction || 0
    let history = settings.historyFraction || 0

    if (field == 'contextFraction') {
      history = Math.min(history, Math.max(0, 1 - val - bufferFraction))
      context = val
    } else {
      context = Math.min(context, Math.max(0, 1 - val - bufferFraction))
      history = val
    }
    changeSettings([['contextFraction'], context], [['historyFraction'], history])
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        height: 'fit-content',
      }}
    >
      <SectionHeader text="Models" />
      <label htmlFor="model-id" style={{gridColumn: 'span 2'}}>
        Model:
      </label>
      <Select
        name="model-id"
        value={settings.modelID || ''}
        updater={(event: ChangeEvent) => {
          const value = (event.target as HTMLInputElement).value
          const {maxNumTokens, topKBlocks} = MODELS[value as keyof typeof MODELS] || {}
          const prevNumTokens = MODELS[settings.modelID as keyof typeof MODELS]?.maxNumTokens
          const prevTopKBlocks = MODELS[settings.modelID as keyof typeof MODELS]?.topKBlocks

          if (settings.maxNumTokens === prevNumTokens) {
            changeVal('maxNumTokens', maxNumTokens)
          } else {
            changeVal('maxNumTokens', Math.min(settings.maxNumTokens || 0, maxNumTokens || 0))
          }
          if (settings.topKBlocks === prevTopKBlocks) {
            changeVal('topKBlocks', topKBlocks)
          }
          changeVal('modelID', value)
        }}
        options={Object.keys(MODELS)}
      />

      <label htmlFor="encoder" style={{gridColumn: 'span 2'}}>
        Encoder:
      </label>
      <Select
        name="encoder"
        value={settings.encoder || ''}
        updater={update('encoder')}
        options={ENCODERS}
      />

      <SectionHeader text="Token options" />
      <NumberInput
        value={settings.maxNumTokens}
        field="maxNumTokens"
        label="Tokens"
        min="1"
        max={MODELS[settings.modelID as keyof typeof MODELS]?.maxNumTokens}
        updater={updateNum('maxNumTokens')}
      />
      <NumberInput
        field="tokensBuffer"
        value={settings.tokensBuffer}
        label="Number of tokens to leave as a buffer when calculating remaining tokens"
        min="0"
        max={settings.maxNumTokens}
        updater={updateNum('tokensBuffer')}
      />
      <NumberInput
        field="maxHistorySummaryTokens"
        value={settings.maxHistorySummaryTokens}
        label="The max number of tokens to use for the history summary"
        min="0"
        max={settings.maxNumTokens}
        updater={updateNum('maxHistorySummaryTokens')}
      />
      <Checkbox
        checked={settings?.enable_hyde || false}
        field="enable_hyde"
        label="Enable Hyde"
        updater={(checked: boolean) => changeSettings([['enable_hyde'], checked])}
      />
      <NumberInput
        field="thinking_budget"
        value={settings.thinking_budget}
        label="Max tokens for thinking. 0 or >=1024"
        min="0"
        max={settings.maxNumTokens}
        updater={updateNum('thinking_budget')}
      />
      <Checkbox
        checked={(settings?.thinking_budget && settings.thinking_budget >= 1024) || false}
        field="enable_thinking"
        label="Enable Thinking"
        updater={(checked: boolean) => changeSettings([['thinking_budget'], checked ? 1024 : 0])}
      />

      <SectionHeader text="Prompt options" />
      <NumberInput
        value={settings.topKBlocks}
        field="topKBlocks"
        label="Number of blocks to use as citations"
        min="1"
        updater={updateNum('topKBlocks')}
      />
      <NumberInput
        value={settings.maxHistory}
        field="maxHistory"
        label="The max number of previous interactions to use"
        min="0"
        updater={updateNum('maxHistory')}
      />

      <Slider
        value={settings.contextFraction}
        field="contextFraction"
        label="Approximate fraction of num_tokens to use for citations text before truncating"
        updater={updateTokenFraction('contextFraction')}
      />
      <Slider
        value={settings.historyFraction}
        field="historyFraction"
        label="Approximate fraction of num_tokens to use for history text before truncating"
        updater={updateTokenFraction('historyFraction')}
      />
      <SectionHeader text="Search filters" />
      <NumberInput
        value={settings.filters?.miri_confidence || 0}
        field="filters.miri_confidence"
        label="MIRI confidence"
        min="0"
        max="10"
        updater={updateNum('filters.miri_confidence')}
      />
    </div>
  )
}
