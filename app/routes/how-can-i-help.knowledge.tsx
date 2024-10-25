import {MetaFunction} from '@remix-run/node'
import DropDown from '~/components/DropDown'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import CategoryCarousel from '~/components/HowCanIHelp/CatgoryCarousel'
import Base from '~/components/HowCanIHelp/Base'
import {useEffect} from 'react'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

const NewToAISafety = () => (
  <>
    <div className="padding-bottom-24">
      <div className="flexbox padding-bottom-56">
        <h2 className="teal-500 padding-bottom-40" id="new-to-aisafety">
          If you're somewhat new to AI safety, we recommend an introductory overview
        </h2>
      </div>
      <HelpItem
        title="Browse our introductory content"
        links={[
          {
            tag: 'Top recommendation',
            title: "'Intro to AI safety' micro-course",
            action: 'https://aisafety.info/questions/9OGZ/',
          },
          {
            title: "Intro to AI safety video playlist",
            action: 'https://aisafety.info/questions/9OGZ/',
          },
        ]}
      >
        {/* TODO: add video */}
        <p className="grey default padding-bottom-24">
          Our website’s “Intro to AI safety” micro-course includes several short readings that act
          as a comprehensive introduction the topic of AI safety.
        </p>
        <p className="grey default">
          Our Intro to AI safety video playlist illustrates many of the most important points about
          AI safety in a way that is entertaining and easy to understand.
        </p>
      </HelpItem>
      <HelpItem
        title="Listen to an introductory podcast episode (or a few)"
        links={[
          {
            tag: 'Top recommendation',
            title: "'Paul Christiano - Preventing an AI Takeover'",
            action: 'https://www.dwarkeshpatel.com/p/paul-christiano',
          },
        ]}
      >
        {/* TODO: add Browse full list */}
        <p className="grey default padding-bottom-24">
          We recommend Dwarkesh Patel’s interview with Paul Christiano, a leading researcher in AI
          alignment and safety. The interview provides an introduction to AI risk and discusses many
          important AI safety concepts.
        </p>
      </HelpItem>
    </div>
  </>
)

const Dropdowns = () => (
  <div className="padding-bottom-80">
    <DropDown title="Books are more my thing">
      <p>TODO fill this</p>
    </DropDown>
    {/* TODO: fix the double line */}
    <DropDown title="I want something I can subscribe to, so I can learn more about AI safety consistently">
      <p>TODO fill this</p>
    </DropDown>
  </div>
)

const DiveDeeper = () => (
  <>
    <div className="padding-bottom-24">
      <div className="flexbox padding-bottom-56">
        <h2 className="teal-500 padding-bottom-40" id="dive-deeper">
          If you want to dive deeper
        </h2>
      </div>
      <HelpItem
        title="Take an online course"
        links={[
          {
            tag: 'Highlight course',
            title: 'AISF Governance Course',
            action: 'https://aisafetyfundamentals.com/governance/',
          },
          {
            tag: 'Highlight course',
            title: 'AISF Alignment Course',
            action: 'https://aisafetyfundamentals.com/alignment/',
          },
        ]}
        // TODO: add "full list of courses"
      >
        <p className="grey default padding-bottom-24">
          We recommend taking an online course if your interests have narrowed to a specific subset
          of AI safety, such as AI alignment research or AI governance.
        </p>
        <p className="grey default padding-bottom-24">
          The AI Safety Fundamentals (AISF) Governance Course, for example, is especially suited for
          policymakers and similar stakeholders interested in AI governance mechanisms. It explores
          policy levers for steering the future of AI development.
        </p>
        <p className="grey default padding-bottom-24">
          The AISF Alignment Course is especially suited for people with a technical background
          interested in AI alignment research. It explores research agendas for aligning AI systems
          with human interests.
        </p>
        <p className="grey default padding-bottom-24">
          <b>Note:</b> If you take the AISF courses, consider exploring additional views on AI
          safety to help avoid homogeneity in the field, such as{' '}
          <a href="https://www.cold-takes.com/most-important-century/" className="teal-500">
            The Most Important Century blog post series
          </a>
          .{/* TODO: fix bold on link */}
        </p>
        <p className="grey default padding-bottom-24">
          <b>Note:</b> AISF courses do not accept all applicants, but we still recommend taking the
          courses through self-study if your application is unsuccessful.
        </p>
      </HelpItem>

      <HelpItem
        title="Get into Lesswrong and its subset, the Alignment Forum"
        links={[
          {
            tag: 'Most widely-used',
            title: 'Lesswrong',
            action: 'https://www.lesswrong.com/',
          },
          {
            title: 'Alignment Forum',
            action: 'https://www.alignmentforum.org/',
          },
        ]}
      >
        <p className="grey default padding-bottom-24">
          Most people who are really into AI existential safety ultimately end up in this online,
          forum-based community which fosters high-quality discussions about AI safety research and
          governance.
        </p>
      </HelpItem>

      <HelpItem
        title="Sign up for events"
        links={[
          {
            tag: 'Top recommendation',
            title: 'EAGx',
            action: 'https://www.effectivealtruism.org/ea-global',
          },
          // TODO: add "browse full list"
        ]}
      >
        <p className="grey default padding-bottom-24">
          Events, typically conferences and talks, are often held in person and last one to three
          days.
        </p>
        <p className="grey default padding-bottom-24">
          We've highlighted EAGx, an Effective Altruism conference dedicated to networking and
          learning about important global issues, with a strong focus on AI safety. Several EAGx's
          are held annually in various major cities across the world.
        </p>
      </HelpItem>

      <HelpItem
        title="Sign up for fellowships"
        links={[
          {
            title: 'Browse our full list of fellowships',
            action: 'https://aisafety.info/questions/8264',
          },
        ]}
      >
        <p className="grey default padding-bottom-24">
          AI safety fellowships typically last one to three weeks and are offered both online and in
          person. They focus on developing safe and ethical AI practices through research,
          mentorship, and collaboration on innovative solutions.
        </p>
      </HelpItem>
    </div>
  </>
)
const OurArticles = () => (
  <>
    <div className="padding-bottom-80">
      <CategoryCarousel title="Our articles on building your knowledge" category="NM19" />
    </div>
  </>
)

export default function Knowledge() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])
  return (
    <Base title="Share knowledge about AI safety" subpage="knowledge">
      <NewToAISafety />

      <Dropdowns />

      <DiveDeeper />

      <OurArticles />

      {/* TODO: Boost your learning efforts */}
    </Base>
  )
}
