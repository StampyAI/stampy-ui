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
              looking to create major change for good can all financially contribute to advance this
              effort.
            </p>
          </div>
          <div className="col-6-alt">
            <p className="default-bold padding-bottom-16">Why this is important</p>
            <p className="grey default">
              The AI safety field is funding-limited as of mid-2023, and there are important avenues
              in AI alignment research and AI governance that cannot currently be explored due to
              this lack of funding.
            </p>
          </div>
        </div>
      </div>

      <div className="padding-bottom-24">
        <h2 className="col-6 padding-bottom-56 teal-500">How & where to donate</h2>
        <HelpItem
          title="Donating to grantmakers"
          tag="Easiest & most common"
          links={[
            {
              tag: 'Top recommendation',
              title: 'Long-Term Future Fund',
              action:
                'https://www.givingwhatwecan.org/charities/long-term-future-fund?utm_source=eafunds',
            },
          ]}
          additionalInfo={
            <>
              Or, browse our{' '}
              <a href="https://www.aisafety.com/donation-guide" className="small-bold teal-500">
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

        <HelpItem title="Donating directly" tag="Highest impact">
          <p className="padding-bottom-16">
            If you're deeply involved in the AI safety community, we encourage you to directly fund
            research, projects, or miscellaneous expenses that you think are valuable. Donating
            directly puts you in the seat of the grantmaker—if you have knowledge of an avenue that
            deserves funds, you're likely to make a better decision than a grantmaker.
          </p>
        </HelpItem>
      </div>

      <div className="flexbox padding-bottom-32">
        <Testimonial
          src="/assets/guy.jpeg"
          title="Søren Elverlin"
          description="I've directly funded several small-scale AI safety projects and found it highly rewarding. The field is often funding-constrained, and many valuable projects are overlooked by large funders. By taking time to understand individuals' goals and approaches, I've been able to make a meaningful impact with targeted, direct donations."
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
        <CategoryCarousel title="Our articles on donating" category="NM1B" />
      </div>
    </Base>
  )
}
