import Card from '../Card'
import CardSmall from '../CardSmall'
import DropDown from '../DropDown'
import {Microscope, GovermentBuilding, PuzzlePieces} from '../icons-generated'
import LinkCard from '../LinkCard'
import './knowledge.css'

export default function Knowledge() {
  return (
    <div>
      <h1 className="teal-500 padding-bottom-40">Build your knowledge</h1>
      <h2 className="teal-500 padding-bottom-40">If you're somewhat new to AI safety, we recommend an introductory overview</h2>

      <div className="padding-bottom-80">
        <div className="section-grid">
          <div>
          <p className="large-bold padding-bottom-16">Browse our introductory content</p>
          <p className="grey default padding-bottom-24">
            Our website’s “Intro to AI Safety” micro-course includes several short readings that act as a 
            comprehensive introduction the topic of AI safety.
          </p>
          <p className="grey default">
            Our Intro to AI Safety video playlist illustrates many of the most important points about AI safety 
            in a way that is entertaining and easy to understand.
          </p>
          </div>
          <div>
            <LinkCard tag="Top recommendation" title="'Intro to AI Safety' micro-course" />

            <p className="grey default">
              TODO Intro to AI Safety video playlist
            </p>
          </div>
        </div>

      </div>
      <div className="padding-bottom-80">
        <div className="section-grid">
          <div>
          <p className="large-bold padding-bottom-16">Listen to an introductory podcast episode (or a few)</p>
          <p className="grey default padding-bottom-24">
            We recommend Dwarkesh Patel’s interview with Paul Christiano, a leading researcher in AI alignment and safety. 
            The interview provides an introduction to AI risk and discusses many important AI safety concepts.
          </p>
          </div>
          <div>
            <LinkCard tag="Top recommendation" title="Paul Christiano - Preventing an AI Takeover" />

            <p className="grey default">
              Browse our full list of podcasts (TODO link)
            </p>
          </div>
        </div>  
      </div>
      <div className="padding-bottom-80">
        <DropDown
          title="Books are more my thing"
          content={
            <div>
              <div className="padding-bottom-40 padding-top-8">
                <p className="large-bold padding-bottom-32">I love books!</p>
                <div className="padding-bottom-40 section-split">
                  <p className="grey default">
                    TODO I love books I'm a nerd
                    Melissa, what do we want to put in the modal, why not just link to this?
                    https://aisafety.info/questions/8159/What-are-some-good-books-about-AI-safety
                  </p>
                </div>
               
                <div className="section-split">
                  <div>
                    <p className="default-bold padding-bottom-16">
                      Lorem ipsum
                    </p>
                    <p className="grey default">
                      Lorem ipsum
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
        />
        {/* TODO How do I avoid the double dividor line? */}
        <DropDown
          title="I want something I can subscribe to, so I can learn more about AI Safety consistently"
          content={
            <div>
              <div className="padding-bottom-40 padding-top-8">
                <p className="large-bold padding-bottom-32">I love books!</p>
                <div className="padding-bottom-40 section-split">
                  <p className="grey default">
                    TODO idk what goes here
                  </p>
                </div>
               
                <div className="section-split">
                  <div>
                    <p className="default-bold padding-bottom-16">
                      Lorem ipsum
                    </p>
                    <p className="grey default">
                      Lorem ipsum
                    </p>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </div>

      <h2 className="teal-500 padding-bottom-40">If you want to dive deeper</h2>
      <div className="padding-bottom-80">
        <div className="section-grid">
          <div>
          <p className="large-bold padding-bottom-16">Take an online course</p>
          <p className="grey default padding-bottom-24">
            We recommend taking an online course if your interests have narrowed to a specific subset of 
            AI safety, such as AI alignment research or AI governance.
          </p>
          <p className="grey default padding-bottom-24">
            The AI Safety Fundamentals (AISF) Governance Course, for example, is especially suited 
            for policymakers and similar stakeholders interested in AI governance mechanisms. 
            It explores policy levers for steering the future of AI development.
          </p>
          <p className="grey default padding-bottom-24">
            The AISF Alignment Course is especially suited for people with a technical background 
            interested in AI alignment research. It explores research agendas for aligning AI systems with human interests.
          </p>
          <p className="grey default padding-bottom-24">
            Note: If you take the AISF courses, consider exploring additional views on AI safety to help avoid homogeneity 
            in the field, such as The Most Important Century blog post series.
          </p>
          <p className="grey default padding-bottom-24">
            Note: AISF courses do not accept all applicants, but we still recommend taking 
            the courses through self-study if your application is unsuccessful.
          </p>
          </div>
          <div>
            <LinkCard tag="Highlighted course" title="AISF Governance Course" />

            <LinkCard tag="Highlighted course" title="AISF Alignment Course" />

            <p className="grey default">
              Browse our <a href="https://aisafety.info/questions/8264/What-training-programs-and-courses-are-available-for-AI-safety" className="text-teal-500 hover:underline">full list of courses (TODO fix link)</a>
            </p>
          </div>
        </div>

        <div className="padding-bottom-80">
          <div className="section-grid">
            <div>
            <p className="large-bold padding-bottom-16">Get into Lesswrong and its subset, the Alignment Forum</p>
            <p className="grey default padding-bottom-24">
              Most people who are really into AI existential safety ultimately end up in this online, 
              forum-based community which fosters high-quality discussions about AI safety research and governance.
            </p>
            </div>
            <div>
              <LinkCard tag="Most widely-used" title="Lesswrong" />

              <LinkCard  title="Alignment Forum" />
            </div>
          </div>
        </div>
        
        <div className="padding-bottom-80">
          <div className="section-grid">
            <div>
            <p className="large-bold padding-bottom-16">Sign up for events</p>
            <p className="grey default padding-bottom-24">
              Events, typically conferences and talks, are often held in person and last one to three days.
            </p>
            <p className="grey default padding-bottom-24">
              We've highlighted EAGx, an Effective Altruism conference dedicated to networking and learning 
              about important global issues, with a strong focus on AI safety. Several EAGx's are held 
              annually in various major cities across the world.
            </p>
            </div>
            <div>
              <LinkCard tag="Top recommendation" title="EAGx" />
              <p className="grey default">
              Or browse our <a href="https://aisafety.info/questions/8264/What-training-programs-and-courses-are-available-for-AI-safety" className="text-teal-500 hover:underline">full list of events (TODO fix link)</a>
              </p>
            </div>

          </div>
        </div>

        <div className="padding-bottom-80">
          <div className="section-grid">
            <div>
            <p className="large-bold padding-bottom-16">Sign up for fellowships</p>
            <p className="grey default padding-bottom-24">
              AI safety fellowships typically last one to three weeks and are offered both online and in person. 
              They focus on developing safe and ethical AI practices through research, 
              mentorship, and collaboration on innovative solutions.
            </p>
            </div>
            <p className="grey default-bold">
              Browse our <a href="https://aisafety.info/questions/8264/What-training-programs-and-courses-are-available-for-AI-safety" className="text-teal-500 hover:underline">Full list of fellowships (TODO fix link)</a>
            </p>
          </div>
        </div>
      </div>

      <h2 className="padding-bottom-40">Our articles on building your knowledge</h2>
      <p> TODO</p>

      <h2 className="padding-bottom-40 teal-500">Boost your learning efforts: Join a community</h2>
      <p> TODO</p>

      <p className="large-bold padding-bottom-16">Once you’re educated, here are some ways to help directly</p>

      <div className="paths-grid">
        <div>
        <Card
            title="Start a career in AI Safety"
            description="Help us build important AI safety infrastructure—all skill sets and levels of time—commitment are wanted"
            icon={PuzzlePieces}
            route="/howcanihelppage/career" impact={'TODO'}  />      
          <Card
            title="Spread the word & grassroots activism"
            description="For anyone—help us spread the word about this issue"
            icon={PuzzlePieces}
            route="/howcanihelppage/spread-the-word" impact={'TODO'}        />  
        </div>
        <div>
          <Card
            title="Donate"
            description="The AI safety field is constrained by funding—financial help is critical at this moment"
            icon={PuzzlePieces}
            route="/howcanihelppage/donate" impact={'TODO'}        />
          <Card
            title="Volunteer"
            description="Help us build important AI safety infrastructure—all skill sets and levels of time—commitment are wanted"
            icon={PuzzlePieces}
            route="/howcanihelppage/volunteer" impact={'TODO'}        />
        </div>
      </div>
      <p>TODO: Fix the grid</p>
    </div>
  )
}
