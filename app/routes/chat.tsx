import {useEffect, useState} from 'react'
import {ShouldRevalidateFunction, useSearchParams} from '@remix-run/react'
import SettingsIcon from '~/components/icons-generated/Settings'
import Page from '~/components/Page'
import Chatbot from '~/components/Chatbot'
import {ChatSettings, Mode} from '~/hooks/useChat'
import Button from '~/components/Button'
import useOutsideOnClick from '~/hooks/useOnOutsideClick'

export const shouldRevalidate: ShouldRevalidateFunction = () => false

export default function App() {
  const [params] = useSearchParams()
  const [showSettings, setShowSettings] = useState(false)
  const clickDetectorRef = useOutsideOnClick(() => setShowSettings(false))
  const [chatSettings, setChatSettings] = useState({mode: 'default'} as ChatSettings)
  const question = params.get('question') || undefined

  useEffect(() => {
    setChatSettings(
      (settings) =>
        ({...settings, completions: params.get('model') || settings.completions}) as ChatSettings
    )
  }, [params])

  const ModeButton = ({name, mode}: {name: string; mode: Mode}) => (
    <Button
      className={chatSettings.mode === mode ? 'secondary-selected' : 'secondary'}
      action={() => setChatSettings({...chatSettings, mode})}
    >
      {name}
    </Button>
  )

  return (
    <Page noFooter>
      <div className="page-body full-height padding-top-32">
        <Chatbot
          question={question}
          questions={[
            {text: 'What is AI Safety?', pageid: '8486'},
            {text: 'How would the AI even get out in the world?', pageid: '8222'},
            {text: 'Do people seriously worry about existential risk from AI?', pageid: '6953'},
          ]}
          settings={chatSettings}
        />
        <div className="settings-container z-index-1" ref={clickDetectorRef}>
          {showSettings && (
            <div className="settings bordered flex-container">
              <div>Answer detail</div>
              <ModeButton mode="default" name="Default" />
              <ModeButton mode="rookie" name="Detailed" />
              <ModeButton mode="concise" name="Concise" />
            </div>
          )}
          <SettingsIcon
            width="24"
            height="24"
            className="pointer"
            onClick={() => setShowSettings((current) => !current)}
          />
        </div>
      </div>
    </Page>
  )
}
