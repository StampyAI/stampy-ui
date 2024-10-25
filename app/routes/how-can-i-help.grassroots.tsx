import {MetaFunction} from '@remix-run/node'
import CardSmall from '~/components/CardSmall'
import DropDown from '~/components/DropDown'
import {Microscope, GovermentBuilding, PuzzlePieces} from '~/components/icons-generated'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import CategoryCarousel from '~/components/HowCanIHelp/CatgoryCarousel'
import Testimonial from '~/components/Testimonial'
import Base from '~/components/HowCanIHelp/Base'
import {useEffect} from 'react'

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
            media or professional network, or whomever.
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
    <h2 className="teal-500 padding-bottom-64">
      What you can do, right now
    </h2>
    <div>
      <HelpItem
        title="Share a video or article on social media"
        tag="2 min"
        links={[
          {
            tag: 'Top recommendation',
            title: 'A.I. - Humanity\'s Final Invention?',
            action: 'https://youtu.be/fa8k8IQ1_X0?si=b2l0Ex6KQvt6JyQD',
          },
        ]}
        additionalInfo={
          <>
            Or, choose another from our{' '}
            <a href="https://www.youtube.com/playlist?list=PLWQikawCP4UFM_ziLf9X2rcOLCSbqisRE" className="small-bold teal-500">
              Intro to AI Safety video playlist
            </a>
          </>
        }
      >
        <p className="padding-bottom-16">We recommend sharing “A.I. - Humanity’s Final Invention?”, which gives an accessible overview to the topic of AI and existential risk</p>
      </HelpItem>

      <HelpItem
        title="Send an email to a politician"
        tag="8 min"
        links={[
          {
            title: 'PauseAI\’s email-a-politician email builder',
            action: 'https://pauseai.info/email-builder',
          },
        ]}
      >
        <p className="padding-bottom-16"> Contacting politicians raises awareness among those who can shape policy and make a real difference</p>
      </HelpItem>

      <HelpItem
        title="Join a PauseAI Protest"
        tag="3–6 hours"
        links={[
          {
            title: 'Find a nearby Pause AI Protest',
            action: 'https://pauseai.info/protests',
          },
        ]}
      >
        <p className="padding-bottom-16">Protests happen in major cities globally, and need people like you!</p>
      </HelpItem>

      <HelpItem
        title="Talk to people about this topic"
        links={[
          {
            title: 'A guide to counter-arguments',
            action: 'https://pauseai.info/counterarguments',
          },
        ]}
      >
        <p className="padding-bottom-16">Take whatever chance you can to promote this topic to friends, those in your social media or professional network, or whomever</p>
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
            <a href="https://pauseai.info/action" className="small-bold teal-500">
            other major petitions
            </a>
          </>
        }
      >
        <p>Add your signature next to Elon Musk, Steve Wozniak, and Stuart Russel in the most well-known AI Safety petition, “Pause Giant AI Experiments: An Open Letter”</p>
      </HelpItem>
    </div>

    <div className="padding-bottom-80">
      <CategoryCarousel
        title={<span>Our articles on spreading the <br/> word & grassroots activism</span>}
        category="NM1A"
      />
    </div>
  </>
)

export default function Grassroots() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])
  return (
    <Base title={<span>Spread the word & <br/> grassroots activism</span>} subpage="grassroots">

      <TopText />

      <WhatYouCanDo />

    </Base>
  )
}
