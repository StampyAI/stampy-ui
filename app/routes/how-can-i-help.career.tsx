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

const ResearchPath = () => (
  <>
    <div className="padding-bottom-80">
      <h2 className="teal-500 padding-bottom-40" id="research">
        AI alignment research
      </h2>
      <div className="flexbox-alt">
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">What</p>
          <p className="grey default">
            AI alignment research is the field dedicated to ensuring that advanced artificial
            intelligence systems act in ways that are beneficial to humans and aligned with human
            values and goals. It involves developing methods and principles to guide AI behavior so
            that as these systems become more capable and autonomous, they continue to operate
            safely and ethically within the intentions set by their human creators.
          </p>
        </div>
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">Why this is important</p>
          <p className="grey default">
            To ensure humanity benefits from advanced AI and mitigates risks—like unintended
            behaviors or misalignment with human values—we must first solve the technical challenge
            of AI alignment through dedicated research, and then collaborate globally to carefully
            deploy solutions. While experts believe alignment is solvable, it remains a complex
            problem that demands significant high-quality intellectual talent.
          </p>
        </div>
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">Where AI alignment researchers work</p>
          <p className="grey default padding-bottom-24">
            AI alignment researchers typically work at non-profit organizations dedicated to AI
            safety and alignment; in academia (i.e. universities and academic institutions);
            independently; or on industry safety teams*.
          </p>
          <p className="grey small">
            <span className="small-bold">*Note:</span> Beware of the risk of joining industry
            "safety" teams, as this work often leaks to non-safety parts of the organization which
            improves the AI technology itself—and so ends up causing harm.
          </p>
        </div>
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">You might be a good fit if...</p>
          <p className="grey default">
            You might be a good fit as an AI alignment researcher if you have a quantitative
            background, you enjoy programming, or you're skilled at breaking down problems
            logically, hypothesizing, and testing various solutions with high attention to detail.
          </p>
        </div>
      </div>
    </div>

    <div className="padding-bottom-24">
      <div className="flexbox padding-bottom-56">
        <h2 className="col-6">Interested in pursuing this career path?</h2>
        <p className="col-6 large">
          Take the following steps to further assess your fit and learn how to make the transition:
        </p>
      </div>
      <HelpItem
        title="Read the 80,000 Hours Technical AI safety Career Review"
        links={[
          {
            tag: 'Top recommendation',
            title: 'Technical AI safety Career Review',
            action: 'https://80000hours.org/career-reviews/ai-safety-researcher/',
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
        title="Sign up for 1-on-1 career advice with AI safety Quest & 80,000 Hours (free)"
        links={[
          {
            title: 'Book your AI safety Quest call',
            action: 'https://aisafety.quest/#calls',
          },
          {
            title: 'Book your 80,000 Hours call',
            action: 'https://80000hours.org/speak-with-us/',
          },
        ]}
      >
        <p className="grey default padding-bottom-16">
          Schedule a 30-minute or 1-hour video call—we recommend booking both! These calls will
          address your specific questions about the AI alignment research field, confirm your
          interest and fit, and provide tailored recommendations to help you make the transition.
        </p>
        <p className="grey small">
          <span className="small-bold">Note:</span> 80,000 Hours does not accept all applicants.
        </p>
      </HelpItem>

      <HelpItem
        title={
          <>
            A process note: Form your <em>own</em> understanding of the AI alignment technical
            challenge
          </>
        }
        links={[
          {
            title: 'Our ‘Build your knowledge’ guide',
            action: 'https://aisafety.info/howcanihelp/knowledge',
          },
          {
            title: 'Our ‘Join a community’ guide',
            action: 'https://aisafety.info/howcanihelp/community',
          },
        ]}
      >
        AI safety is a relatively new field with diverse opinions on how best to solve the technical
        challenge of AI alignment. Many unexplored avenues and important questions likely remain
        unaddressed. Therefore, it's crucial for AI alignment researchers (or aspiring researchers)
        to think independently and develop their own models on this topic. If you pursue a career in
        this field, we recommend deeply educating yourself on the technical challenge of alignment,
        engaging with other AI safety experts, and thinking critically about the topic and current
        paradigms.
      </HelpItem>
    </div>

    <div className="padding-bottom-80">
      <DropDown title="I’m interested in non-technical or supporting roles in AI alignment">
        <HelpItem>
          There are many roles that support the work of AI alignment researchers, and having
          high-performing people in these roles is crucial. In a research organisation around half
          of the staff will be doing other tasks essential for the organisation to perform at its
          best and have an impact. Some of these roles include:
        </HelpItem>
        <HelpItem
          title="Operations management at an AI safety research organization"
          links={[
            {
              title: 'Read 80k’s guide on operations management',
              action: 'https://80000hours.org/articles/operations-management/',
            },
          ]}
        >
          This involves overseeing the day-to-day activities that enable the organization to
          function efficiently and effectively. Responsibilities may include administrative support,
          resource allocation, HR, management of facilities, IT support, project coordination, etc.
        </HelpItem>
        <HelpItem
          title="Research management at an AI safety research organization"
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

    <div className="flexbox padding-bottom-32">
      <Testimonial
        src="/assets/guy.jpeg"
        title="Lorem ipsum"
        description="Lorem ipsum dolor sit amet consectetur. Ultricies neque pellentesque sit sit diam. Magna
        enim risus netus lacinia. Metus sit quis mollis est justo posuere dui potenti blandit. Velit
        enim integer a etiam vel. Nec gravida pulvinar congue integer leo mi euismod. Nulla in sit
        molestie ut velit ultricies justo nulla. Ipsum turpis purus tempor."
        className="col-6"
      />
      <Testimonial
        src="/assets/guy.jpeg"
        title="Lorem ipsum"
        description="Lorem ipsum dolor sit amet consectetur. Ultricies neque pellentesque sit sit diam. Magna
        enim risus netus lacinia. Metus sit quis mollis est justo posuere dui potenti blandit. Velit
        enim integer a etiam vel. Nec gravida pulvinar congue integer leo mi euismod. Nulla in sit
        molestie ut velit ultricies justo nulla. Ipsum turpis purus tempor. leo mi euismod. Nulla in sit
        molestie ut velit ultricies justo nulla. Ipsum turpis purus tempor."
        className="col-6"
      />
    </div>

    <div className="padding-bottom-80">
      <CategoryCarousel
        title="Our articles on pursuing a career in alignment research"
        category="NM1D"
      />
    </div>
  </>
)

const GovernancePath = () => (
  <div className="padding-bottom-80">
    <div className="padding-bottom-80">
      <h2 className="teal-500 padding-bottom-40" id="governance">
        AI governance & policy
      </h2>
      <div className="flexbox-alt">
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">What</p>
          <p className="grey default">Lorem ipsum</p>
        </div>
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">Why this is important</p>
          <p className="grey default">Lorem ipsum</p>
        </div>
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">Where these people usually work</p>
          <p className="grey default">Lorem ipsum</p>
        </div>
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">You might be a good fit if...</p>
          <p className="grey default">Lorem ipsum</p>
        </div>
      </div>
    </div>

    <div className="padding-bottom-24">
      <div className="flexbox padding-bottom-56">
        <h2 className="col-6">Interested in pursuing this career path?</h2>
        <p className="col-6 large">
          Take the following steps to further assess your fit and learn how to make the transition:
        </p>
      </div>
      <HelpItem
        title="Read the 80,000 Hours Technical AI safety Career Review"
        links={[
          {
            tag: 'Top recommendation',
            title: 'Technical AI Safety Career Review',
            action: 'https://80000hours.org/career-reviews/ai-safety-researcher/',
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
        title="Sign up for 1-on-1 career advice with AI safety Quest & 80,000 Hours (free)"
        links={[
          {
            title: 'Book your AI Safety Quest call',
            action: 'https://aisafety.quest/#calls',
          },
          {
            title: 'Book your 80,000 Hours call',
            action: 'https://80000hours.org/speak-with-us/',
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
        title="A process note: Form your <i> own </i> understanding of the AI alignment technical challenge"
        links={[
          {
            title: 'Our ‘Build your knowledge’ guide',
            action: 'https://aisafety.info/howcanihelp/knowledge',
          },
          {
            title: 'Our ‘Join a community’ guide',
            action: 'https://aisafety.info/howcanihelp/community',
          },
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

    <div className="flexbox padding-bottom-32">
      <Testimonial
        src="/assets/guy.jpeg"
        title="Lorem ipsum"
        description="Lorem ipsum dolor sit amet consectetur. Ultricies neque pellentesque sit sit diam. Magna
        enim risus netus lacinia. Metus sit quis mollis est justo posuere dui potenti blandit. Velit
        enim integer a etiam vel. Nec gravida pulvinar congue integer leo mi euismod. Nulla in sit
        molestie ut velit ultricies justo nulla. Ipsum turpis purus tempor."
        className="col-6"
      />
      <Testimonial
        src="/assets/guy.jpeg"
        title="Lorem ipsum"
        description="Lorem ipsum dolor sit amet consectetur. Ultricies neque pellentesque sit sit diam. Magna
        enim risus netus lacinia. Metus sit quis mollis est justo posuere dui potenti blandit. Velit
        enim integer a etiam vel. Nec gravida pulvinar congue integer leo mi euismod. Nulla in sit
        molestie ut velit ultricies justo nulla. Ipsum turpis purus tempor. leo mi euismod. Nulla in sit
        molestie ut velit ultricies justo nulla. Ipsum turpis purus tempor."
        className="col-6"
      />
    </div>

    <CategoryCarousel
      title="Our articles on pursuing a career in AI governance & policy"
      category="NM2N"
    />
  </div>
)

const FieldBuildingPath = () => (
  <>
    <div className="padding-bottom-80">
      <h2 className="teal-500 padding-bottom-40" id="field-building">
        AI safety field-building
      </h2>
      <div className="flexbox-alt">
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">What</p>
          <p className="grey default">
            AI safety field-building involves attracting talent and resources to the field, raising
            awareness about AI safety issues, educating people to increase attention toward
            developing safe AI, and building the AI safety community.
          </p>
        </div>
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">Why this is important</p>
          <p className="grey default">
            The AI safety field is still in its early stages, with significant room for growth and
            maturation. It is important to capitalize on this potential because it may be the
            deciding factor between successfully solving the alignment problem and mitigating AI
            risk through global coordination, or not. This growth will largely result from
            field-building efforts specifically.
          </p>
        </div>
        <div className="col-6-alt">
          <p className="default-bold padding-bottom-16">You might be a good fit if...</p>
          <p className="grey default">
            Field-building may be the way to go if neither alignment research nor governance appeals
            to you or fits your skillset. You may be a particularly good fit if you have a strong
            sense of agency or leadership, or you are creative. That said, a large variety of roles
            exist within field-building, so it’s likely that you can adapt your skillset—whatever it
            is—to a role.
          </p>
        </div>
      </div>
    </div>

    <div className="padding-bottom-24">
      <p className="padding-bottom-40 large-bold">Most common field-building roles</p>

      <HelpItem
        titleFont="default-bold"
        title="Communications & advocacy"
        links={[
          {
            title: "Read 80k's guide on communications",
            action: 'https://80000hours.org/skills/communication/',
          },
        ]}
      >
        Communications involves educating the public or spreading the word about AI safety—most
        typically through websites or social media. People with computer skills and creative skills
        can typically find a place within communications. Roles could include independent content
        production, software engineering, project management, or design.
      </HelpItem>

      <HelpItem
        titleFont="default-bold"
        title="Being a grantmaker"
        links={[
          {
            title: "Read 80k's guide on being a grantmaker",
            action: 'https://80000hours.org/career-reviews/grantmaker',
          },
        ]}
      >
        There are many philanthropists interested in donating millions of dollars to AI safety—but
        there currently aren't enough grantmakers able to vet funding proposals. Because a randomly
        chosen proposal has little expected impact, grantmakers can have a large impact by helping
        philanthropists distinguish promising projects in AI safety from less promising ones.
      </HelpItem>

      <HelpItem
        titleFont="default-bold"
        title="Founding new projects"
        links={[
          {
            title: "Read 80k's guide on founding high-impact projects",
            action: 'https://80000hours.org/career-reviews/founder-impactful-organisations',
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
          There are many roles that support the work of AI alignment researchers or people in AI
          governance, and having high-performing people in these roles is crucial. In a research
          organisation, for example, around half of the staff will be doing other tasks essential
          for the organisation to perform at its best and have an impact. Some of the most common
          supporting roles in AI safety include:
        </HelpItem>
        <HelpItem
          titleFont="default-bold"
          title="Operations management at an AI safety research organization"
          links={[
            {
              title: "Read 80k's guide on operations work",
              action: 'https://80000hours.org/articles/operations-management',
            },
          ]}
        >
          This involves overseeing the day-to-day activities that enable the organization to
          function efficiently and effectively. Responsibilities may include administrative support,
          resource allocation, HR, management of facilities, IT support, project coordination, etc.
        </HelpItem>

        <HelpItem
          titleFont="default-bold"
          title="Research management at an AI safety research organization"
          links={[
            {
              title: "Read 80k's guide on research management",
              action: 'https://80000hours.org/career-reviews/research-management',
            },
          ]}
        >
          This involves overseeing and coordinating research activities to ensure they align with
          the mission of promoting safe AI development. Responsibilities include setting research
          priorities, managing teams, allocating resources, fostering collaboration, monitoring
          progress, and upholding ethical standards.
        </HelpItem>

        <HelpItem
          titleFont="default-bold"
          title="Being an executive assistant to someone doing important work on safety and governance"
          links={[
            {
              title: "Read 80k's guide on being an executive assistant",
              action: '#',
            },
          ]}
        >
          This involves managing administrative tasks to enhance their productivity.
          Responsibilities include scheduling meetings, handling correspondence, coordinating
          travel, organizing events, and ensuring they can focus on impactful AI safety or
          governance efforts.
        </HelpItem>

        <p className="large-bold padding-bottom-32">Other technical roles</p>

        <HelpItem
          titleFont="default-bold"
          title="Working in information security to protect AI (or the results of key experiments) from misuse, theft, or tampering"
          links={[
            {
              title: "Read 80k's guide on Information security in high-impact areas",
              action: 'https://80000hours.org/career-reviews/information-security',
            },
          ]}
        >
          {null}
        </HelpItem>

        <HelpItem
          titleFont="default-bold"
          title="Becoming an expert in AI hardware as a way of steering AI progress in safer directions"
          links={[
            {
              title: "Read 80k's guide on expertise in AI hardware",
              action: 'https://80000hours.org/career-reviews/become-an-expert-in-ai-hardware',
            },
          ]}
        >
          {null}
        </HelpItem>
      </DropDown>
    </div>

    <div className="padding-bottom-24">
      <div className="flexbox padding-bottom-56">
        <h2 className="col-6">Interested in pursuing this career path?</h2>
        <p className="col-6">
          Take the following steps to (1) learn more & further assess your fit; (2) learn how to
          make the transition
        </p>
      </div>
      <HelpItem
        title="Sign up for 1-on-1 career advice with AI safety Quest & 80,000 Hours (free)"
        links={[
          {
            title: 'Book your AI Safety Quest call',
            action: 'https://aisafety.quest/#calls',
          },
          {
            title: 'Book your 80,000 Hours call',
            action: 'https://80000hours.org/speak-with-us/',
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
        title={
          <>
            A process note: Form your <em>own</em> understanding of the AI alignment technical
            challenge
          </>
        }
        links={[
          {
            title: 'Our ‘Build your knowledge’ guide',
            action: 'https://aisafety.info/howcanihelp/knowledge',
          },
          {
            title: 'Our ‘Join a community’ guide',
            action: 'https://aisafety.info/howcanihelp/community',
          },
        ]}
      >
        AI safety is a relatively new field with diverse opinions on how best to solve the technical
        challenge of AI alignment. Many unexplored avenues and important questions likely remain
        unaddressed. Therefore, it's crucial for AI alignment researchers (or aspiring researchers)
        to think independently and develop their own models on this topic. If you pursue a career in
        this field, we recommend deeply educating yourself on the technical challenge of alignment,
        engaging with other AI safety experts, and thinking critically about the topic and current
        paradigms.
      </HelpItem>
    </div>

    <div className="padding-bottom-24">
      <Testimonial
        src="/assets/bryce.png"
        title="Bryce Robertson"
        layout="expanded"
        description="Having decided to change my career to one focused on AI safety, I began searching for field-building roles. While staying on scholarship at the EA Hotel (CEEALAR) I spent five months doing volunteer work for Alignment Ecosystem Development (AED) and when the founder stepped back to focus on other projects, he asked me to take over its operations. I applied for and received funding from the Long-Term Future Fund which has allowed me to now lead AED full-time."
      />
    </div>

    <CategoryCarousel
      title="Our articles on pursuing a career in AI safety field-building"
      category="NM2M"
    />
  </>
)

const CareerPaths = () => (
  <>
    <p className="grey default padding-bottom-32">There are three major career paths:</p>
    <div className="flexbox padding-bottom-80">
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
        description="Roles that direct talent or resources toward AI safety, educate the public, or build the AI safety community"
        icon={PuzzlePieces}
      />
    </div>
  </>
)

export default function HowCanIHelp() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])
  return (
    <Base title="Start a career in AI safety" current="career">
      <CareerPaths />

      <ResearchPath />

      <GovernancePath />

      <FieldBuildingPath />
    </Base>
  )
}
