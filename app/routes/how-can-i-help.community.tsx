import {MetaFunction} from '@remix-run/node'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import Base from '~/components/HowCanIHelp/Base'
import {useEffect} from 'react'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

const InPerson = () => (
  <>
    <div className="padding-bottom-24">
      <div className="padding-bottom-56">
        <h2 className="teal-500 padding-bottom-40" id="in-person-communities">
          In-person communities
        </h2>
        <p className="grey default col-6">
          In-person communities provide general purpose support, networking, and socializing for
          anyone interested in contributing to AI safety.
        </p>
      </div>
      <HelpItem
        title="AI safety-specific coommunities"
        links={[
          {
            title: 'Our list of in-person communities',
            action: 'https://www.aisafety.com/communities',
          },
        ]}
      >
        <p className="grey default padding-bottom-24">
          There are about 60 in-person AI safety communities across the globe, mostly in major
          cities. These communities typically host weekly meetups in which members network,
          socialize, or review AI safety material in the form of talks or workshops.
        </p>
      </HelpItem>
      <HelpItem
        title="Related communities"
        links={[
          {
            title: 'EA groups map',
            action: 'https://forum.effectivealtruism.org/groups',
          },
          {
            title: 'Rationalist groups map',
            action: 'https://www.lesswrong.com/community',
          },
        ]}
      >
        <p className="grey default padding-bottom-24">
          AI safety is a major topic in Effective Altruism (EA) and Rationalism. Consider joining a
          local EA or Rationalist group if you can't find an AI safety community near you.
        </p>
      </HelpItem>
    </div>
  </>
)

const Online = () => (
  <>
    <div className="padding-bottom-24">
      <div className="padding-bottom-56">
        <h2 className="teal-500 padding-bottom-40" id="online-communities">
          Online communities
        </h2>
        <p className="grey default col-6">
          Online communities typically exist on Slack, Discord (an app like Slack), or website
          forums, and tend to serve more specific purposes:
        </p>
      </div>
      <HelpItem
        title="General resources & support"
        links={[
          {
            tag: 'Top recommendation',
            title: 'AI alignment slack',
            action:
              'https://ai-alignment.slack.com/join/shared_invite/zt-1vd2yu4ib-3dLG4D82H7eXF_THvTdUKg#/shared-invite/email',
          },
        ]}
        additionalInfo={
          <>
            Or, browse our{' '}
            <a href="https://www.aisafety.com/communities" className="small-bold teal-500">
              full list of communities
            </a>
          </>
        }
      >
        <p className="grey default padding-bottom-24">
          General hubs for support, motivation, discussion, and information-gathering.
        </p>
      </HelpItem>

      <HelpItem
        title="Focused on one activity"
        links={[
          {
            title: 'Join a PauseAI event',
            action: 'https://pauseai.info/events',
          },
        ]}
      >
        <p className="grey default padding-bottom-24">
          You can volunteering for projects and attend protests. People are divided regarding
          whether protests or a pause in AI development are a good idea, but if it's something you
          want to do, PauseAI is a reliable organization in that space.
        </p>
      </HelpItem>

      <HelpItem
        title="Detailed strategic discussion"
        links={[
          {
            tag: 'Top recommendation',
            title: 'Lesswrong',
            action: 'https://www.lesswrong.com/tag/ai',
          },
        ]}
      >
        <p className="grey default padding-bottom-24">
          Deep strategic and technical discussions regarding AI alignment and AI governance.
        </p>
      </HelpItem>
    </div>
  </>
)

export default function Community() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])
  return (
    <Base title="Join the community" current="community">
      <InPerson />

      <Online />
    </Base>
  )
}
