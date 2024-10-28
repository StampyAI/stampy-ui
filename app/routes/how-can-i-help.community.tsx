import {MetaFunction} from '@remix-run/node'
import DropDown from '~/components/DropDown'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import CategoryCarousel from '~/components/HowCanIHelp/CatgoryCarousel'
import Base from '~/components/HowCanIHelp/Base'
import {useEffect} from 'react'
import VideoImg from '~/assets/video_thumbnail.png'
import PlayIcon from '~/components/icons-generated/Play'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

const InPerson = () => (
  <>
    <div className="padding-bottom-24">
      <div className="flexbox padding-bottom-56">
        <h2 className="teal-500 padding-bottom-40" id="new-to-aisafety">
          In person communities
        </h2>
        <p className="grey default">
          In person communities provide general purpose support, networking, and socializing for
          anyone interested in contributing to AI safety.
        </p>
        {/* TODO make this only appear in left part of page */}
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
          There are about 60 in-person AI Safety communities across the globe, mostly in major
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
          AI Safety is a major topic in Effective Altruism (EA) and Rationalism. Consider joining a
          local EA or Rationalist group if you can't find an AI Safety community near you.
        </p>
      </HelpItem>
    </div>
  </>
)

const Online = () => (
  <>
    <div className="padding-bottom-24">
      <div className="flexbox padding-bottom-56">
        <h2 className="teal-500 padding-bottom-40" id="new-to-aisafety">
          Online communities
        </h2>
        <p className="grey default">
          Online communities typically exist on Slack, Discord (an app like Slack), or website
          forums, and tend to serve more specific purposes:
        </p>
        {/* TODO make this only appear in left part of page */}
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

      <HelpItem title="Focused on one activity">
        <p className="grey default padding-bottom-24">
          Such as volunteering for a certain project or organizing and attending protests.
        </p>
        {/* TODO there seems to be lacking text or a link in the figma */}
      </HelpItem>

      <HelpItem
        title="Detailed strategic discussion"
        links={[
          {
            tag: 'Top recommendation',
            title: 'Lesswrong',
            action: 'https://www.lesswrong.com/',
          },
          // TODO: do we want to link to a specific tag here?
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
