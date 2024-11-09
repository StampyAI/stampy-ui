import {MetaFunction} from '@remix-run/node'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import CategoryCarousel from '~/components/HowCanIHelp/CatgoryCarousel'
import Testimonial from '~/components/Testimonial'
import Base from '~/components/HowCanIHelp/Base'

export const meta: MetaFunction = () => {
  return [{title: 'How Can I Help? - AISafety.info'}]
}

export default function Donate() {
  return (
    <Base title="Donate" current="donate">
      <div className="padding-bottom-80">
        <div className="flexbox-alt">
          <div className="col-6-alt">
            <p className="default-bold padding-bottom-16">Who</p>
            <p className="grey default">
              All donations are helpful. A kind-hearted person with $10 extra a month, a mid-salary
              professional wishing to donate 10% of their income, or a well-off philanthropist
              looking to create major change for good can all make a useful contribution to
              advancing this effort.
            </p>
          </div>
          <div className="col-6-alt">
            <p className="default-bold padding-bottom-16">Why this is important</p>
            <p className="grey default">
              The AI safety field is funding-limited as of late 2024, and there are important
              avenues in AI alignment research and AI governance that cannot currently be explored
              due to this lack of funding.
            </p>
          </div>
        </div>
      </div>

      <div className="padding-bottom-80">
        <h2 className="col-6 padding-bottom-56 teal-500">How & where to donate</h2>
        <HelpItem
          title="Donating to grantmakers"
          tag="Easiest & most common"
          className="padding-bottom-40"
          links={[
            {
              tag: 'Top recommendation',
              title: 'Long-Term Future Fund',
              action: 'https://www.givingwhatwecan.org/charities/long-term-future-fund',
            },
          ]}
          additionalInfo={
            <>
              Or, browse our{' '}
              <a
                href="https://www.aisafety.com/donation-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="small-bold teal-500"
              >
                other grantmaker recommendations
              </a>
            </>
          }
        >
          <p className="padding-bottom-16">
            Essentially, AI safety field experts allocate your funds where they believe they will be
            the most impactful within AI alignment research, AI governance, or AI safety
            field-building.
          </p>
          <p>
            We recommend the Long-Term Future Fund, the go-to grantmaker for identifying and funding
            high-value projects worldwide.
          </p>
        </HelpItem>

        <HelpItem
          title="Donating directly to individuals & smaller organizations"
          tag="Potential for highest impact"
          className="padding-bottom-40"
          links={[
            {
              title: 'Shallow review of live agendas in alignment & safety',
              action:
                'https://www.lesswrong.com/posts/zaaGsFBeDTpCsYHef/shallow-review-of-live-agendas-in-alignment-and-safety',
            },
          ]}
        >
          <p className="padding-bottom-16">
            If you have insights into the key obstacles or opportunities that could make a big
            difference, we encourage you to directly fund research, projects, or other expenses
            (like a plane ticket to a conference) for impactful individuals or small organizations.
          </p>
          <p>
            Donating directly bypasses traditional grantmaking, providing immediate impact and
            allowing you to share valuable insights. It diversifies funding sources, reduces
            reliance on large donors, and supports those who may otherwise face a lengthy grant
            application process.
          </p>
        </HelpItem>

        <HelpItem
          title="Donating directly to larger organizations"
          links={[
            {
              title: 'AI Safety Landscape Map',
              action: 'https://www.aisafety.com/landscape-map',
            },
          ]}
        >
          <p className="padding-bottom-16">
            Direct donations to larger organizations are less common, as grantmakers typically have
            a comprehensive understanding of the major players in this space and are often
            well-positioned to make informed funding decisions.
          </p>
          <p>
            However, if there is a specific organization you believe is doing exceptional work and
            would benefit from additional funds, contributing directly can still be a great choice.
          </p>
        </HelpItem>
      </div>

      <div className="flexbox">
        <Testimonial
          src="/assets/guy.jpeg"
          title="Søren Elverlin"
          description="I've directly funded several small-scale AI safety projects and found it highly rewarding. The field is often funding-constrained, and many valuable projects are overlooked by large funders. By taking time to understand individuals' goals and approaches, I've been able to make a meaningful impact with targeted, direct donations."
          layout="expanded"
        />
        {/* TESTIMONIALS TEMPORARILY REMOVED
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
      */}
      </div>

      <div>
        <CategoryCarousel title="Our articles on donating" category="NM1B" />
      </div>
    </Base>
  )
}
