import {MetaFunction} from '@remix-run/node'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import Base from '~/components/HowCanIHelp/Base'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

const InPerson = () => (
  <>
    <div className="padding-bottom-56">
      <div className="padding-bottom-40">
        <h2 className="teal-500 padding-bottom-32">In-person communities</h2>
        <p className="grey default col-6">
          In-person communities provide general support, networking, and socializing for anyone
          interested in contributing to AI safety.
        </p>
      </div>
      <HelpItem
        title="AI safety-specific communities"
        links={[
          {
            title: 'Our list of communities',
            action: 'https://www.aisafety.com/communities',
          },
        ]}
        className="padding-bottom-40"
      >
        <p className="grey default">
          There are about 150 in-person AI safety communities across the globe, mostly in major
          cities. These communities typically host weekly meetups in which members network,
          socialize, or review AI safety material in the form of talks or workshops.
        </p>
      </HelpItem>
      <HelpItem
        title="Related communities"
        links={[
          {
            title: 'Map of EA groups',
            action: 'https://forum.effectivealtruism.org/groups',
          },
          {
            title: 'Map of Rationalist groups',
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
    <div className="padding-bottom-40">
      <h2 className="teal-500 padding-bottom-32">Online communities</h2>
      <p className="grey default col-6">
        Online communities typically exist on Slack, Discord (an app like Slack), or website forums,
        and tend to serve more specific purposes:
      </p>
    </div>
    <HelpItem
      title="General resources & support"
      links={[
        {
          tag: 'Top recommendation',
          title: 'AI Alignment Slack',
          action:
            'https://ai-alignment.slack.com/join/shared_invite/zt-1vd2yu4ib-3dLG4D82H7eXF_THvTdUKg#/shared-invite/email',
        },
      ]}
      className="padding-bottom-40"
      additionalInfo={
        <>
          Or, browse our{' '}
          <a
            href="https://www.aisafety.com/communities"
            target="_blank"
            rel="noopener noreferrer"
            className="small-bold teal-500"
          >
            full list of communities
          </a>
        </>
      }
    >
      <p className="grey default">
        General hubs for support, motivation, discussion, and information-gathering.
      </p>
    </HelpItem>

    <HelpItem
      title="Focused on one activity"
      links={[
        {
          title: 'PauseAI Discord',
          action: 'https://discord.gg/pauseai-1100491867675709580',
        },
      ]}
      className="padding-bottom-40"
    >
      <p className="grey default">
        Some communities are largely dedicated to one particular activity, such as running volunteer
        projects or organizing protests.
      </p>
    </HelpItem>

    <HelpItem
      title="Detailed strategic discussion"
      links={[
        {
          tag: 'Top recommendation',
          title: 'LessWrong',
          action: 'https://www.lesswrong.com/w/ai',
        },
      ]}
    >
      <p className="grey default">
        Deep strategic and technical discussions regarding AI alignment and governance.
      </p>
    </HelpItem>
  </>
)

export default function Community() {
  return (
    <Base title="Join a community" current="community">
      <InPerson />

      <Online />
    </Base>
  )
}
