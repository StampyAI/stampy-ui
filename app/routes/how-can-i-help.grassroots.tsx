import {MetaFunction} from '@remix-run/node'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import ArticleCarousel from '~/components/ArticleCarousel'
import Base from '~/components/HowCanIHelp/Base'
import VideoImg from '~/assets/video_thumbnail.png'
import VideoThumbnail from '~/components/VideoThumbnail/videothumbnail'
import {ARTICLE_COLLECTIONS} from '~/utils/article-collections'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

const TopText = () => (
  <>
    <div className="padding-bottom-80">
      <div className="flexbox-alt">
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">Who</p>
          <p className="grey default">
            For anyone—help us spread the word about this issue to friends, those in your social
            media or professional network, or whomever
          </p>
        </div>
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">Why this is important</p>
          <p className="grey default">
            AI poses a serious risk of human extinction—potentially soon. Raising global awareness
            is important to help us unite and take the best step forward.
          </p>
        </div>
      </div>
    </div>
  </>
)
const WhatYouCanDo = () => (
  <>
    <h2 className="teal-500 padding-bottom-64">What you can do, right now</h2>
    <div>
      <HelpItem
        className="padding-bottom-64"
        title="Share a video or article on social media"
        tag="2 min"
        links={[
          {
            tag: 'Top recommendation',
            title: "A.I. - Humanity's Final Invention?",
            action: 'https://youtu.be/fa8k8IQ1_X0?si=b2l0Ex6KQvt6JyQD',
            image: <VideoThumbnail imageUrl={VideoImg} altText="video-playlist" />,
            isVideo: true,
          },
        ]}
        additionalInfo={
          <>
            Or, choose another from our{' '}
            <a
              href="https://www.youtube.com/playlist?list=PLWQikawCP4UFM_ziLf9X2rcOLCSbqisRE"
              target="_blank"
              rel="noopener noreferrer"
              className="small-bold teal-500"
            >
              AI safety intro video playlist
            </a>
          </>
        }
      >
        <p>
          We recommend sharing &ldquo;A.I. - Humanity's Final Invention?&rdquo;, which gives an
          accessible overview of the topic of AI and existential risk
        </p>
      </HelpItem>

      <HelpItem
        className="padding-bottom-64"
        title="Send an email to a politician"
        tag="4 min"
        links={[
          {
            title: 'ControlAI’s email template',
            action: 'https://controlai.com/take-action/',
          },
        ]}
      >
        <p>
          {' '}
          Contacting politicians raises awareness among those who can shape policy and make a real
          difference
        </p>
      </HelpItem>

      <HelpItem
        className="padding-bottom-64"
        title="Join a PauseAI protest"
        tag="3–6 hours"
        links={[
          {
            title: 'Find a nearby Pause AI protest',
            action: 'https://pauseai.info/protests',
          },
        ]}
      >
        <p>Protests happen in major cities globally, and need people like you!</p>
      </HelpItem>

      <HelpItem
        className="padding-bottom-64"
        title="Talk to people about this topic"
        links={[
          {
            title: 'A guide to counterarguments',
            action: 'https://pauseai.info/counterarguments',
          },
        ]}
      >
        <p>
          Take whatever chance you can to promote this topic to friends, those in your social media
          or professional network, or whomever
        </p>
      </HelpItem>

      <HelpItem
        title="Sign a petition"
        tag="5 min"
        links={[
          {
            title: 'Sign “Pause Giant AI Experiments: An Open Letter”',
            action: 'https://futureoflife.org/open-letter/pause-giant-ai-experiments/',
          },
        ]}
        additionalInfo={
          <>
            You could also look into{' '}
            <a
              href="https://pauseai.info/action"
              target="_blank"
              rel="noopener noreferrer"
              className="small-bold teal-500"
            >
              other major petitions
            </a>
          </>
        }
      >
        <p>
          Add your signature next to that of Elon Musk, Steve Wozniak, and “godfather of AI” Yoshua
          Bengio in the most well-known AI safety petition, “Pause Giant AI Experiments: An Open
          Letter”
        </p>
      </HelpItem>
    </div>

    <ArticleCarousel
      title={
        <span>
          Our articles on spreading the <br /> word & grassroots activism
        </span>
      }
      articles={ARTICLE_COLLECTIONS.GRASSROOTS_ACTIVISM}
    />
  </>
)

export default function Grassroots() {
  return (
    <Base
      title={
        <span>
          Spread the word & <br className="desktop-only" />
          grassroots activism
        </span>
      }
      current="grassroots"
    >
      <TopText />

      <WhatYouCanDo />
    </Base>
  )
}
