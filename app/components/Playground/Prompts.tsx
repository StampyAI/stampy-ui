import {ChangeEvent, useState} from 'react'
import {ChatSettings, Entry} from '~/hooks/useChat'

type ChatSettingsUpdate = [path: string[], value: any]

type ChatPromptParams = {
  settings: ChatSettings
  query: string
  history: Entry[]
  changeSettings: (...vals: ChatSettingsUpdate[]) => void
}

type DetailsProps = {
  children: React.ReactNode
  defaultOpen?: boolean
} & React.DetailsHTMLAttributes<HTMLDetailsElement>

function Details({children, defaultOpen = true, ...props}: DetailsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <details
      {...props}
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      {children}
    </details>
  )
}

export const PlaygroundPrompts = ({settings, query, history, changeSettings}: ChatPromptParams) => {
  const updatePrompt =
    (...path: string[]) =>
    (event: ChangeEvent) =>
      changeSettings([['prompts', ...path], (event.target as HTMLInputElement).value])

  const inlineAllTemplates = async () => {
    try {
      const response = await fetch('https://chat.stampy.ai:8443/inline-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({settings}),
      })
      if (response.ok) {
        const inlinedPrompts = await response.json()

        const updates: [string[], any][] = []

        const addUpdates = (obj: any, path: string[] = ['prompts']) => {
          Object.entries(obj).forEach(([key, value]) => {
            const currentPath = [...path, key]
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              addUpdates(value, currentPath)
            } else {
              updates.push([currentPath, value])
            }
          })
        }

        addUpdates(inlinedPrompts)
        changeSettings(...updates)
      }
    } catch (error) {
      console.error('Failed to inline templates:', error)
    }
  }

  return (
    <div style={{border: '2px solid black', padding: '20px', height: 'fit-content'}}>
      <button onClick={inlineAllTemplates} style={{marginBottom: '16px', padding: '0 16px'}}>
        Inline All Templates
      </button>
      <Details>
        <summary>History summary prompt</summary>
        <textarea
          style={{border: '1px solid gray', width: '100%', padding: '4px', minHeight: '60px'}}
          value={settings?.prompts?.history_summary}
          onChange={updatePrompt('history_summary')}
        />
      </Details>
      <Details>
        <summary>System prompt</summary>
        <textarea
          style={{border: '1px solid gray', width: '100%', padding: '4px', minHeight: '100px'}}
          value={settings?.prompts?.system}
          onChange={updatePrompt('system')}
        />
        <div>(This is where sources will be injected)</div>
      </Details>
      {history.length > 0 && (
        <>
          <Details>
            <summary>History prompt</summary>
            <textarea
              style={{border: '1px solid gray', width: '100%', padding: '4px', minHeight: '60px'}}
              value={settings?.prompts?.history}
              onChange={updatePrompt('history')}
            />
          </Details>
          <Details>
            <summary>History</summary>
            {history
              .slice(Math.max(0, history.length - (settings.maxHistory || 0)))
              .map((entry, i) => (
                <div key={i} style={{padding: '8px 0'}}>
                  {entry.content}
                </div>
              ))}
          </Details>
        </>
      )}
      <Details>
        <summary>Pre-message prompt</summary>
        <textarea
          style={{border: '1px solid gray', width: '100%', padding: '4px', minHeight: '60px'}}
          value={settings?.prompts?.pre_message}
          onChange={updatePrompt('pre_message')}
        />
      </Details>
      <Details>
        <summary>Hyde pre-message prompt</summary>
        <textarea
          style={{border: '1px solid gray', width: '100%', padding: '4px', minHeight: '60px'}}
          value={settings?.prompts?.hyde_pre_message}
          onChange={updatePrompt('hyde_pre_message')}
        />
      </Details>
      <Details>
        <summary>Hyde post-message prompt</summary>
        <textarea
          style={{border: '1px solid gray', width: '100%', padding: '4px', minHeight: '60px'}}
          value={settings?.prompts?.hyde_post_message}
          onChange={updatePrompt('hyde_post_message')}
        />
      </Details>
      <Details>
        <summary>Post-message prompt</summary>
        <textarea
          style={{border: '1px solid gray', width: '100%', padding: '4px', minHeight: '60px'}}
          value={settings?.prompts?.post_message}
          onChange={updatePrompt('post_message')}
        />
      </Details>
      <Details>
        <summary>User mode prompt</summary>
        <textarea
          style={{border: '1px solid gray', width: '100%', padding: '4px', minHeight: '60px'}}
          value={settings?.prompts?.modes?.[settings.mode || 'default']}
          onChange={updatePrompt('modes', settings.mode || 'default')}
        />
      </Details>
      <Details>
        <summary>Message format</summary>
        <textarea
          style={{border: '1px solid gray', width: '100%', padding: '4px', minHeight: '60px'}}
          value={settings?.prompts?.message_format}
          onChange={updatePrompt('message_format')}
        />
        <div>{query}</div>
      </Details>
    </div>
  )
}
