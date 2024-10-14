import CardSmall from '../CardSmall'
import './career.css'

export default function Career() {
  return (
    <div>
      <h1 className="teal-500 padding-bottom-40">Start a career</h1>
      <p className="grey padding-bottom-32">There are 3 major career paths in AI safety:</p>
      <div className="paths-grid padding-bottom-80">
        <CardSmall
          title="AI alignment research"
          description="Research roles dedicated to solving the technical challenge of AI alignment, and non-technical supporting roles"
          icon="book"
        />
        <CardSmall
          title="AI governance & policy"
          description="Roles focused on developing and implementing policies that guide AI development and usage"
          icon="book"
        />
        <CardSmall
          title="AI safety field-building"
          description="Roles that direct people or funding towards AI risk, rather than working on the problem directly"
          icon="book"
        />
      </div>

      <h2 className="teal-500 padding-bottom-40">AI alignment research</h2>
      <div className="section-grid">
        <div>
          <p className="large-bold padding-bottom-16">What</p>
          <p className="grey">
            AI alignment research is the field dedicated to ensuring that advanced artificial
            intelligence systems act in ways that are beneficial to humans and aligned with human
            values and goals. It involves developing methods and principles to guide AI behavior so
            that as these systems become more capable and autonomous, they continue to operate
            safely and ethically within the intentions set by their human creators.
          </p>
        </div>
        <div>
          <p className="large-bold padding-bottom-16">Why this is important</p>
          <p className="grey">
            To ensure humanity benefits from advanced AI and mitigates risks—like unintended
            behaviors or misalignment with human values—we must first solve the technical challenge
            of AI alignment through dedicated research, and then collaborate globally to carefully
            deploy solutions. While experts believe alignment is solvable, it remains a complex
            problem that demands significant high-quality intellectual talent.
          </p>
        </div>
        <div>
          <p className="large-bold padding-bottom-16">Where AI alignment researchers work</p>
          <p className="grey">
            AI alignment researchers typically work at non-profit organizations dedicated to AI
            safety and alignment; in academia (i.e. universities and academic institutions);
            independently; or on industry safety teams*, usually at major AI companies like OpenAI.
          </p>
          <p className="grey">
            *Note: Beware of the risk of joining "safety" teams, as this work often leaks to
            non-safety parts of the organization which improves the AI technology itself—and so ends
            up causing harm.
          </p>
        </div>
        <div>
          <p className="large-bold padding-bottom-16">You might be a good fit if...</p>
          <p className="grey">
            You might be a good fit as an AI alignment researcher if you have a quantitative
            background, you enjoy programming, or you're skilled at breaking down problems
            logically, hypothesizing, and testing various solutions with high attention to detail.
          </p>
        </div>
      </div>
    </div>
  )
}
