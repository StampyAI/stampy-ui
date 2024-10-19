import {Link} from '@remix-run/react'
import Page from '~/components/Page'
import {MetaFunction} from '@remix-run/node'
import CardSmall from '~/components/CardSmall'
import DropDown from '~/components/DropDown'
import {Microscope, GovermentBuilding, PuzzlePieces} from '~/components/icons-generated'
import HelpMethods from '~/components/HowCanIHelp/HelpMethods'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import {helpUrl} from '~/routesMapper'
/* import './howcanihelp.css' */

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

const ResearchPath = () => (
  <>
    <div className="padding-bottom-80">
      <h2 className="teal-500 padding-bottom-40" id="research">
        AI alignment research
      </h2>
      <div className="section-grid">
        <div>
          <p className="default-bold padding-bottom-16">What</p>
          <p className="grey default">
            AI alignment research is the field dedicated to ensuring that advanced artificial
            intelligence systems act in ways that are beneficial to humans and aligned with human
            values and goals. It involves developing methods and principles to guide AI behavior so
            that as these systems become more capable and autonomous, they continue to operate
            safely and ethically within the intentions set by their human creators.
          </p>
        </div>
        <div>
          <p className="default-bold padding-bottom-16">Why this is important</p>
          <p className="grey default">
            To ensure humanity benefits from advanced AI and mitigates risks—like unintended
            behaviors or misalignment with human values—we must first solve the technical challenge
            of AI alignment through dedicated research, and then collaborate globally to carefully
            deploy solutions. While experts believe alignment is solvable, it remains a complex
            problem that demands significant high-quality intellectual talent.
          </p>
        </div>
        <div>
          <p className="default-bold padding-bottom-16">Where AI alignment researchers work</p>
          <p className="grey default padding-bottom-24">
            AI alignment researchers typically work at non-profit organizations dedicated to AI
            safety and alignment; in academia (i.e. universities and academic institutions);
            independently; or on industry safety teams*, usually at major AI companies like OpenAI.
          </p>
          <p className="grey default">
            *Note: Beware of the risk of joining "safety" teams, as this work often leaks to
            non-safety parts of the organization which improves the AI technology itself—and so ends
            up causing harm.
          </p>
        </div>
        <div>
          <p className="default-bold padding-bottom-16">You might be a good fit if...</p>
          <p className="grey default">
            You might be a good fit as an AI alignment researcher if you have a quantitative
            background, you enjoy programming, or you're skilled at breaking down problems
            logically, hypothesizing, and testing various solutions with high attention to detail.
          </p>
        </div>
      </div>
    </div>
    <div className="padding-bottom-80">
      <div className="section-split padding-bottom-56">
        <h2>Interested in pursuing this career path?</h2>
        <p>
          Take the following steps to (1) learn more & further assess your fit; (2) learn how to
          make the transition
        </p>
      </div>
      <HelpItem
        title="Read the 80,000 Hours Technical AI Safety Career Review"
        links={[
          {
            tag: 'Top recommendation',
            title: 'Technical AI Safety Career Review',
          },
        ]}
      >
        <p className="padding-bottom-16">The review takes about one hour and addresses:</p>
        <ul>
          <li>What this career path involves</li>
          <li>How to predict your fit</li>
          <li>The upsides and downsides of this career path</li>
          <li>Compensation</li>
          <li>How to enter or transition into this career</li>
        </ul>
      </HelpItem>
      <HelpItem
        title="Sign up for 1-on-1 career advice with AI Safety Quest & 80,000 Hours (free)"
        links={[
          {
            title: 'Book your AI Safety Quest call',
          },
          {
            title: 'Book your 80,000 Hours call',
          },
        ]}
      >
        <p className="grey default padding-bottom-16">
          Schedule a 30-minute or 1-hour video call—we recommend booking both! These calls will
          address your specific questions about the field, confirm your interest and fit, and
          provide tailored recommendations to help you make the transition.
        </p>
        <p className="grey small">
          <span className="small-bold">Note:</span> 80,000 Hours does not accept all applicants.
        </p>
      </HelpItem>

      <HelpItem
        title="A process note: Form your own understanding of the AI alignment technical challenge"
        links={[
          {title: 'Our ‘Build your knowledge’ guide'},
          {title: 'Our ‘Join a community’ guide'},
        ]}
      >
        AI safety is a relatively new field with diverse opinions on how best to solve the technical
        challenge of AI alignment. Many unexplored avenues and important questions likely remain
        unaddressed. Therefore, it's crucial for (aspiring) AI alignment researchers to think
        independently and develop their own models on this topic. If you pursue a career in this
        field, we recommend deeply educating yourself on the technical challenge of alignment,
        engaging with other AI safety experts, and thinking critically about the topic and current
        paradigms.
      </HelpItem>
    </div>

    <div className="padding-bottom-80">
      <DropDown title="I want to pursue a career in AI alignment, but not as a researcher">
        <HelpItem>
          There are many roles that support the work of AI alignment researchers, and having
          high-performing people in these roles is crucial. In a research organisation around half
          of the staff will be doing other tasks essential for the organisation to perform at its
          best and have an impact. Some of these roles include:
        </HelpItem>
        <HelpItem
          title="Operations management at an AI safety research organization"
          links={[{title: 'Read 80k’s guide on operations work'}]}
        >
          This involves overseeing the day-to-day activities that enable the organization to
          function efficiently and effectively. Responsibilities may include administrative support,
          resource allocation, HR, management of facilities, IT support, project coordination, etc.
        </HelpItem>
        <HelpItem
          title="Research management AI safety research organization"
          links={[
            {
              title: "Read 80k's guide on research management",
              action: '#',
            },
          ]}
        >
          This involves overseeing and coordinating research activities to ensure they align with
          the mission of promoting safe AI development. Responsibilities include setting research
          priorities, managing teams, allocating resources, fostering collaboration, monitoring
          progress, and upholding ethical standards.
        </HelpItem>

        <HelpItem
          title="Being an executive assistant to an AI safety researcher"
          links={[
            {
              title: "Read 80k's guide on being an executive assistant",
              action: '#',
            },
          ]}
        >
          This involves managing administrative tasks to enhance this person's productivity.
          Responsibilities include scheduling meetings, handling correspondence, coordinating
          travel, organizing events, and ensuring they can focus on impactful AI safety efforts.
        </HelpItem>
      </DropDown>
    </div>
  </>
)

const GovernancePath = () => (
  <>
    <div className="padding-bottom-80">
      <h2 className="teal-500 padding-bottom-40" id="governance">
        AI governance & policy
      </h2>
      <div className="section-grid">
        <div>
          <p className="default-bold padding-bottom-16">What</p>
          <p className="grey default">
            AI alignment research is the field dedicated to ensuring that advanced artificial
            intelligence systems act in ways that are beneficial to humans and aligned with human
            values and goals. It involves developing methods and principles to guide AI behavior so
            that as these systems become more capable and autonomous, they continue to operate
            safely and ethically within the intentions set by their human creators.
          </p>
        </div>
        <div>
          <p className="default-bold padding-bottom-16">Why this is important</p>
          <p className="grey default">
            To ensure humanity benefits from advanced AI and mitigates risks—like unintended
            behaviors or misalignment with human values—we must first solve the technical challenge
            of AI alignment through dedicated research, and then collaborate globally to carefully
            deploy solutions. While experts believe alignment is solvable, it remains a complex
            problem that demands significant high-quality intellectual talent.
          </p>
        </div>
        <div>
          <p className="default-bold padding-bottom-16">Where AI alignment researchers work</p>
          <p className="grey default">
            AI alignment researchers typically work at non-profit organizations dedicated to AI
            safety and alignment; in academia (i.e. universities and academic institutions);
            independently; or on industry safety teams*, usually at major AI companies like OpenAI.
          </p>
        </div>
        <div>
          <p className="default-bold padding-bottom-16">You might be a good fit if...</p>
          <p className="grey default">
            You might be a good fit as an AI alignment researcher if you have a quantitative
            background, you enjoy programming, or you're skilled at breaking down problems
            logically, hypothesizing, and testing various solutions with high attention to detail.
          </p>
        </div>
      </div>
    </div>
  </>
)

const FieldBuildingPath = () => (
  <>
    <div className="padding-bottom-80">
      <h2 className="teal-500 padding-bottom-40" id="field-building">
        AI safety field-building
      </h2>
      <div className="section-grid">
        <div>
          <p className="default-bold padding-bottom-16">What</p>
          <p className="grey default">
            AI alignment research is the field dedicated to ensuring that advanced artificial
            intelligence systems act in ways that are beneficial to humans and aligned with human
            values and goals. It involves developing methods and principles to guide AI behavior so
            that as these systems become more capable and autonomous, they continue to operate
            safely and ethically within the intentions set by their human creators.
          </p>
        </div>
        <div>
          <p className="default-bold padding-bottom-16">Why this is important</p>
          <p className="grey default">
            To ensure humanity benefits from advanced AI and mitigates risks—like unintended
            behaviors or misalignment with human values—we must first solve the technical challenge
            of AI alignment through dedicated research, and then collaborate globally to carefully
            deploy solutions. While experts believe alignment is solvable, it remains a complex
            problem that demands significant high-quality intellectual talent.
          </p>
        </div>
        <div>
          <p className="default-bold padding-bottom-16">You might be a good fit if...</p>
          <p className="grey default">
            You might be a good fit as an AI alignment researcher if you have a quantitative
            background, you enjoy programming, or you're skilled at breaking down problems
            logically, hypothesizing, and testing various solutions with high attention to detail.
          </p>
        </div>
      </div>
    </div>
    <div className="padding-bottom-80">
      <p className="padding-bottom-40 large-bold">Most common field-building roles</p>

      <HelpItem
        title="Communications & advocacy"
        links={[
          {
            title: "Read 80k's guide on communications",
            action: '#',
          },
        ]}
      >
        Communications involves educating the public or spreading the word about AI safety—most
        typically through websites or social media. People with computer skills and creative skills
        can typically find a place within communications. More specifically, roles could include
        being an independent content producer, software engineering, project management, or design.
      </HelpItem>

      <HelpItem
        title="Being a grantmaker"
        links={[
          {
            title: "Read 80k's guide on being a grantmaker",
            action: '#',
          },
        ]}
      >
        There are many philanthropists interested in donating millions of dollars to AI safety—but
        there currently aren't enough grantmakers able to vet funding proposals. Because a randomly
        chosen proposal has little expected impact, grantmakers can have a large impact by helping
        philanthropists distinguish promising projects in AI safety from less promising ones.
      </HelpItem>

      <HelpItem
        title="Founding new projects"
        links={[
          {
            title: "Read 80k's guide on founding high-impact projects",
            action: '#',
          },
        ]}
      >
        Founding a new project in AI safety involves identifying a gap in a pressing problem area,
        formulating a solution, investigating it, and then helping to build an organisation by
        investing in strategy, hiring, management, culture, and so on—ideally building something
        that can continue without you.
      </HelpItem>
    </div>
    <div className="padding-bottom-80">
      <DropDown title="What are some other miscellaneous roles?">
        <HelpItem title="Supporting roles">
          There are many roles that support the work of AI alignment researchers, and having
          high-performing people in these roles is crucial. In a research organisation around half
          of the staff will be doing other tasks essential for the organisation to perform at its
          best and have an impact. Some of these roles include:
        </HelpItem>
        <HelpItem
          title="Operations management at an AI safety research organization"
          links={[
            {
              title: "Read 80k's guide on operations work",
              action: '#',
            },
          ]}
        >
          This involves overseeing the day-to-day activities that enable the organization to
          function efficiently and effectively. Responsibilities may include administrative support,
          resource allocation, HR, management of facilities, IT support, project coordination, etc.
        </HelpItem>

        <HelpItem
          title="Research management AI safety research organization"
          links={[
            {
              title: "Read 80k's guide on research management",
              action: '#',
            },
          ]}
        >
          This involves overseeing and coordinating research activities to ensure they align with
          the mission of promoting safe AI development. Responsibilities include setting research
          priorities, managing teams, allocating resources, fostering collaboration, monitoring
          progress, and upholding ethical standards.
        </HelpItem>

        <HelpItem
          title="Being an executive assistant to an AI safety researcher"
          links={[
            {
              title: "Read 80k's guide on being an executive assistant",
              action: '#',
            },
          ]}
        >
          This involves managing administrative tasks to enhance this person's productivity.
          Responsibilities include scheduling meetings, handling correspondence, coordinating
          travel, organizing events, and ensuring they can focus on impactful AI safety efforts.
        </HelpItem>

        <p className="large-bold padding-bottom-32">Other technical roles</p>

        <HelpItem
          title="Working in information security to protect AI (or the results of key experiments) from misuse, theft, or tampering"
          links={[
            {
              title: "Read 80k's guide on Information security in high-impact areas",
              action: '#',
            },
          ]}
        >
          Lorem ipsum dolor sit amet consectetur. Sapien ullamcorper morbi habitasse justo magna.
          Suspendisse nunc id lacus sit interdum sit.
        </HelpItem>

        <HelpItem
          title="Becoming an expert in AI hardware as a way of steering AI progress in safer directions"
          links={[
            {
              title: "Read 80k's guide on expertise in AI hardware",
              action: '#',
            },
          ]}
        >
          Lorem ipsum dolor sit amet consectetur. Sapien ullamcorper morbi habitasse justo magna.
          Suspendisse nunc id lacus sit interdum sit.
        </HelpItem>
      </DropDown>
    </div>
  </>
)

const CareerPaths = () => (
  <>
    <p className="grey default padding-bottom-32">There are 3 major career paths in AI safety:</p>
    <div className="paths-grid padding-bottom-80">
      <CardSmall
        action="#research"
        iconColor="var(--colors-teal-700)"
        title="AI alignment research"
        description="Research roles dedicated to solving the technical challenge of AI alignment, and non—technical supporting roles"
        icon={Microscope}
      />
      <CardSmall
        action="#governance"
        iconColor="var(--colors-teal-700)"
        title="AI governance & policy"
        description="Roles focused on developing and implementing policies that guide AI development and usage"
        icon={GovermentBuilding}
      />
      <CardSmall
        action="#field-building"
        iconColor="var(--colors-teal-700)"
        title="AI safety field-building"
        description="Roles that direct people or funding towards AI risk, rather than working on the problem directly"
        icon={PuzzlePieces}
      />
    </div>
  </>
)

export default function HowCanIHelp() {
  return (
    <Page>
      <div className="page-body">
        <div className="padding-bottom-16">
          <Link to={helpUrl()}>How can I help with AI Safety?</Link>
        </div>

        <div>
          <h1 className="teal-500 padding-bottom-40">Start a career</h1>
          <CareerPaths />

          <ResearchPath />

          <GovernancePath />

          <FieldBuildingPath />

          <HelpMethods current="career" />
        </div>
      </div>
    </Page>
  )
}
