import {MetaFunction} from '@remix-run/node'
import DropDown from '~/components/DropDown'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import CategoryCarousel from '~/components/HowCanIHelp/CategoryCarousel'
import Base from '~/components/HowCanIHelp/Base'
import VideoImg from '~/assets/video_thumbnail.png'
import VideoThumbnail from '~/components/VideoThumbnail/videothumbnail'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

const NewToAISafety = () => (
  <>
    <div className="padding-bottom-56">
      <div className="flexbox padding-bottom-56">
        <h2 className="teal-500 padding-bottom-4 col-8" id="new-to-aisafety">
          If you{'\u2019'}re somewhat new to AI safety, we recommend an introductory overview
        </h2>
      </div>
      <HelpItem
        title="Browse our introductory content"
        className="padding-bottom-56"
        links={[
          {
            tag: 'Top recommendation',
            title: '\u201CIntro to AI safety\u201D micro-course',
            action: 'https://aisafety.info/questions/9OGZ/',
          },
          {
            title: 'Intro to AI safety video playlist',
            action: 'https://www.youtube.com/playlist?list=PLWQikawCP4UFM_ziLf9X2rcOLCSbqisRE',
            image: <VideoThumbnail imageUrl={VideoImg} altText="video-playlist" />,
            isVideo: true,
          },
        ]}
      >
        <p className="grey default padding-bottom-16">
          Our “Intro to AI safety” micro-course is comprised of a collection of short readings that
          serve as a comprehensive introduction to the topic of AI safety.
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
            title: 'Paul Christiano—Preventing an AI Takeover',
            action: 'https://www.dwarkeshpatel.com/p/paul-christiano',
          },
        ]}
        additionalInfo={
          <>
            Browse our{' '}
            <a
              href="https://aisafety.info/questions/7619"
              target="_blank"
              rel="noopener noreferrer"
              className="small-bold teal-500"
            >
              full list of podcasts
            </a>
          </>
        }
      >
        <p className="grey default">
          We recommend Dwarkesh Patel’s interview with Paul Christiano, a leading alignment
          researcher. The interview provides an introduction to AI risk and discusses many important
          AI safety concepts.
        </p>
      </HelpItem>
    </div>
  </>
)

const Dropdowns = () => (
  <div className="padding-bottom-80">
    <DropDown title="Books are more my thing">
      <HelpItem
        links={[
          {
            tag: 'Top recommendation',
            title: '\u201CUncontrollable\u201D by Darren McKee',
            action: 'https://www.goodreads.com/book/show/202416160-uncontrollable',
          },
        ]}
        additionalInfo={
          <>
            Or, read our{' '}
            <a
              href="https://aisafety.info/questions/8159"
              target="_blank"
              rel="noopener noreferrer"
              className="small-bold teal-500"
            >
              full list of AI safety book recommendations
            </a>
          </>
        }
      >
        We recommend the book &ldquo;Uncontrollable&rdquo; by Darren McKee, which concisely examines
        the risks posed by advanced AI. The book highlights the need for effective AI governance and
        safety measures, and offers practical solutions to ensure AI benefits society while
        minimizing risks.
      </HelpItem>
    </DropDown>

    <DropDown title="I want something I can subscribe to (YouTube channels, newsletters, etc.)">
      <HelpItem
        className="padding-bottom-56"
        title="YouTube"
        links={[
          {
            tag: 'Top recommendation',
            title: 'Robert Miles AI Safety',
            action: 'https://www.youtube.com/c/robertmilesai',
          },
        ]}
      >
        We recommend the YouTube channel Robert Miles AI Safety, which presents complex AI safety
        concepts in an accessible format to foster awareness and understanding of the ethical and
        safety considerations in AI development. Note: Rob is also the founder of this site.
      </HelpItem>

      <HelpItem
        className="padding-bottom-56"
        title="Podcast series"
        links={[
          {
            tag: 'Top recommendation',
            title: '80,000 Hours Podcast',
            action: 'https://80000hours.org/podcast/',
          },
        ]}
        additionalInfo={
          <>
            Or, browse our{' '}
            <a
              href="https://aisafety.info/questions/7619"
              target="_blank"
              rel="noopener noreferrer"
              className="small-bold teal-500"
            >
              full list of podcasts
            </a>
          </>
        }
      >
        We recommend the 80,000 Hours Podcast, which explores a range of topics centered on
        existential risks and high-impact altruism. Many episodes feature high-quality and
        easy-to-understand content on AI safety.
      </HelpItem>

      <HelpItem
        className="padding-bottom-56"
        title="Newsletter"
        links={[
          {
            tag: 'Top recommendation',
            title: 'AI Safety Newsletter',
            action: 'https://newsletter.safe.ai/',
          },
        ]}
      >
        We recommend the AI Safety Newsletter by the Center for AI Safety (CAIS), which offers
        curated updates on key AI safety developments. It breaks down complex topics into simple
        segments that are accessible to both beginners and deep divers to AI safety.
      </HelpItem>

      <HelpItem
        title="Twitter/X"
        links={[
          {
            tag: 'Top recommendation',
            title: 'AGI Safety Core',
            action: 'https://x.com/i/lists/1185207859728076800',
          },
        ]}
      >
        We recommend following AGI Safety Core, a group of thinkers in AI that post about AI safety.
      </HelpItem>
    </DropDown>
  </div>
)

const DiveDeeper = () => (
  <>
    <div>
      <h2 className="teal-500 padding-bottom-56" id="dive-deeper">
        If you want to dive deeper
      </h2>
      <HelpItem
        title="Take an online course"
        className="padding-bottom-56"
        links={[
          {
            tag: 'Highlighted course',
            title: 'AISF Governance Course',
            action: 'https://aisafetyfundamentals.com/governance/',
          },
          {
            tag: 'Highlighted course',
            title: 'AISF Alignment Course',
            action: 'https://aisafetyfundamentals.com/alignment/',
          },
        ]}
        additionalInfo={
          <>
            Or, browse our{' '}
            <a
              href="https://www.aisafety.com/courses"
              target="_blank"
              rel="noopener noreferrer"
              className="small-bold teal-500"
            >
              full list of courses
            </a>
          </>
        }
      >
        <p className="grey default padding-bottom-16">
          We recommend taking an online course if your interests have narrowed to a specific subset
          of AI safety, such as AI alignment research or AI governance.
        </p>
        <p className="grey default padding-bottom-16">
          The AI Safety Fundamentals (AISF) Governance Course, for example, is especially suited for
          policymakers and similar stakeholders interested in AI governance mechanisms. It explores
          policy levers for steering the future of AI development.
        </p>
        <p className="grey default padding-bottom-24">
          The AISF Alignment Course is especially suited for people with a technical background
          interested in AI alignment research. It explores research agendas for aligning AI systems
          with human interests.
        </p>
        <p className="grey small padding-bottom-24">
          <span className="small-bold">Note:</span> If you take the AISF courses, consider exploring
          additional views on AI safety to help avoid homogeneity in the field, such as{' '}
          <a
            href="https://www.cold-takes.com/most-important-century/"
            target="_blank"
            rel="noopener noreferrer"
            className="teal-500 small-bold"
          >
            The Most Important Century blog post series
          </a>
          .
        </p>
        <p className="grey small">
          <span className="small-bold">Note:</span> AISF courses do not accept all applicants. We
          recommend taking the courses through self-study if your application is unsuccessful.
        </p>
      </HelpItem>

      <HelpItem
        title="Get into LessWrong and its subset, the Alignment Forum"
        className="padding-bottom-56"
        links={[
          {
            tag: 'Most widely-used',
            title: 'LessWrong',
            action: 'https://www.lesswrong.com/tag/ai',
          },
          {
            title: 'Alignment Forum',
            action: 'https://www.alignmentforum.org/',
          },
        ]}
      >
        <p className="grey default">
          Most people who are really into AI existential safety ultimately end up in this online,
          forum-based community which fosters high-quality discussions about AI safety research and
          governance.
        </p>
      </HelpItem>

      <HelpItem
        title="Sign up for events"
        className="padding-bottom-56"
        links={[
          {
            tag: 'Top recommendation',
            title: 'EAGx',
            action: 'https://www.effectivealtruism.org/ea-global',
          },
        ]}
        additionalInfo={
          <>
            Or, browse our{' '}
            <a
              href="https://www.aisafety.com/events-and-training"
              target="_blank"
              rel="noopener noreferrer"
              className="small-bold teal-500"
            >
              full list of upcoming events
            </a>
          </>
        }
      >
        <p className="grey default padding-bottom-24">
          Events, typically conferences and talks, are often held in person and last one to three
          days.
        </p>
        <p className="grey default">
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
        <p className="grey default">
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
    <div>
      <CategoryCarousel title="Our articles on building your knowledge" category="NM19" />
    </div>
  </>
)

export default function Knowledge() {
  return (
    <Base title="Build your knowledge" current="knowledge">
      <NewToAISafety />

      <Dropdowns />

      <DiveDeeper />

      <OurArticles />
    </Base>
  )
}
