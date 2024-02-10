import {PlaneSend} from '~/components/icons-generated'
import {StampyChat} from '~/components/icons-generated'

export const WidgetStampy = () => {
  return (
    <div className={'widget-group'}>
      <div className={'widget-header'}>
        <p className={'widget-title'}>Questions?</p>
        <p className={'widget-subtitle'}>Ask Stampy any question about AI Safety</p>
      </div>

      <div className={'widget-chat-group'}>
        <div className={'chat-message'}>
          <StampyChat className={'stampyIcon'} />
          <div className={'chat-incoming-message'}>
            <div className={'widget-conversation-start-header'}>Try asking me...</div>
            {/*<img className={"rectangleIcon"} alt="" src="Rectangle.svg" />*/}
            <div className={'widget-start-conversation'}>
              <div className={'input-label'}>Why couldn’t we just turn the AI off?</div>
            </div>
            <div className={'widget-start-conversation'}>
              <div className={'input-label'}>How would the AI even get out in the world?</div>
            </div>
            <div className={'widget-start-conversation'}>
              <div className={'input-label'}>
                Do people seriously worry about existential risk from AI?
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={'widget-ask'}>
        <div className={'widget-textbox'}>
          <input
            type={'text'}
            className={'widget-input'}
            placeholder={'Ask Stampy a question...'}
          />
        </div>
        <div className={'send-button-group'}>
          <div className={'send-button'} />
          <PlaneSend className={'send-button-icon'} />
        </div>
      </div>
    </div>
  )
}
