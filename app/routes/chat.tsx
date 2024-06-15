import {useEffect, useState} from 'react'
import {ShouldRevalidateFunction, useSearchParams} from '@remix-run/react'
import SettingsIcon from '~/components/icons-generated/Settings'
import Page from '~/components/Page'
import Chatbot from '~/components/Chatbot'
import {ChatSettings, Mode} from '~/hooks/useChat'
import Button from '~/components/Button'
import useOutsideOnClick from '~/hooks/useOnOutsideClick'
import useOnSiteQuestions from '~/hooks/useOnSiteQuestions'
import '~/components/Chatbot/widgit.css'

export const shouldRevalidate: ShouldRevalidateFunction = () => false

export default function App() {
  const [params] = useSearchParams()
  const [showSettings, setShowSettings] = useState(false)
  const clickDetectorRef = useOutsideOnClick(() => setShowSettings(false))
  const [chatSettings, setChatSettings] = useState({mode: 'default'} as ChatSettings)
  const question = params.get('question') || undefined
  const {selected: questions} = useOnSiteQuestions()

  useEffect(() => {
    setChatSettings(
      (settings) =>
        ({...settings, completions: params.get('model') || settings.completions}) as ChatSettings
    )
  }, [params])

  const ModeButton = ({name, mode}: {name: string; mode: Mode}) => (
    <Button
      className={chatSettings.mode === mode ? 'secondary-selected' : 'secondary'}
      action={() => {
        setShowSettings(false)
        setChatSettings({...chatSettings, mode})
      }}
    >
      {name}
    </Button>
  )

  return (
    <Page noFooter>
      <div className="page-body full-height padding-top-32">
        <Chatbot question={question} questions={questions} settings={chatSettings} />
        <div className="settings-container z-index-1 desktop-only" ref={clickDetectorRef}>
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
            className="pointer settings-icon"
            onClick={() => setShowSettings((current) => !current)}
          />
        </div>
      </div>
    </Page>
  )
}
