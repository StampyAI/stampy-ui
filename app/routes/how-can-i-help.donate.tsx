import {MetaFunction} from '@remix-run/node'
import HelpItem from '~/components/HowCanIHelp/HelpItem'
import Testimonial from '~/components/Testimonial'
import Base from '~/components/HowCanIHelp/Base'
import ArticleCarousel from '~/components/ArticleCarousel'
import {ARTICLE_COLLECTIONS} from '~/utils/article-collections'
import {createMetaTags} from '~/utils/meta'

export const meta: MetaFunction = () => {
  return createMetaTags({
    title: 'Donate - How Can I Help? - AISafety.info',
    description: 'Help advance AI safety through donations. Learn about grantmakers, direct giving, and where your contributions can make the most impact.',
  })
}

export default function Donate() {
  return (
    <Base title="Donate" current="donate">
      <div className="padding-bottom-56">
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
              The AI safety field is currently funding-limited, and there are important avenues in
              AI alignment research and AI governance that cannot currently be explored due to this
              lack of funding.
            </p>
          </div>
        </div>
      </div>

      <div className="padding-bottom-80">
        <h2 className="col-6 padding-bottom-56 teal-500">How & where to donate</h2>
        <HelpItem
          title="Donating to grantmakers"
          tag="Easiest & most common"
          className="padding-bottom-56"
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
            high-value small projects worldwide.
          </p>
        </HelpItem>

        <HelpItem
          title="Donating directly to individuals & smaller organizations"
          tag="Potential for highest impact"
          className="padding-bottom-56"
          links={[
            {
              title: 'Shallow review of technical AI safety, 2024',
              action:
                'https://www.lesswrong.com/posts/fAW6RXLKTLHC3WXkS/shallow-review-of-technical-ai-safety-2024',
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
              title: 'Map of AI Existential Safety',
              action: 'https://www.aisafety.com/map',
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
          className="col-6"
        />
        <Testimonial
          src="/assets/green.jpg"
          title="Robin Green"
          description="With a full-time job and no expertise in AI safety, I didn’t have the time or energy to figure out which projects or groups would do the most good. Then I heard about the Long-Term Future Fund, a charity which does the hard work of figuring out what to fund in AI safety. I read up about the people running it and thought they were making reasonable decisions, so I decided to donate through them. I’m very happy with my choice."
          className="col-6"
        />
      </div>

      <div>
        <ArticleCarousel title="Our articles on donating" articles={ARTICLE_COLLECTIONS.DONATING} />
      </div>
    </Base>
  )
}
