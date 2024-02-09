import type {Meta, StoryObj} from '@storybook/react'
import ContentBox from '../app/components/ContentBox'
import {ArrowRight} from '../app/components/icons-generated'
import {BottomEclipse} from '../app/components/icons-generated'
import {GroupTopEcplise} from '../app/components/icons-generated'
import {ListTable} from '../app/components/Table/ListTable'

const meta = {
  title: 'Components/ContentBox',
  component: ContentBox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    title: 'test title',
      action: '/1234',
      actionTitle: 'Click me',
      children: 'Placeholder',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContentBox>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
      className: "teal-background",
      title: (
          <>
              <div className="white">New to AI Safety?</div>
              <div className="teal-200">
                  Something about <br />
                  reading and quick
              </div>
          </>
      ),
      action: "/9OGZ",
      actionTitle: (
          <>
              Start here
              <ArrowRight className="img-2" />
          </>
      ),
      children: (
          <img
              loading="lazy"
              src="/assets/book-circle.svg"
              className="content-box-right-icon"
              alt="AI Safety Image"
          />
      )
  },
}
export const Secondary: Story = {
  args: {
      title: "Explore the arguments",
      action: "/9TDI",
      actionTitle: "Browse all arguments",
      children: (
          <ListTable elements={[
              {title: 'What are the main sources of AI existential risk?', pageid: '8503'},
          {title: 'Do people seriously worry about existential risk from AI?', pageid: '6953'},
          {title: 'Why would an AI do bad things?', pageid: '2400'},
      ]} />
      )
  },
}

export const Tertiary: Story = {
    args: {
        title: "Get involved with AI safety",
        action: "/8TJV",
        actionTitle: "Learn how",
        children: (
        <>
            <GroupTopEcplise className="eclipse-individual-top" />
            <BottomEclipse className="eclipse-team-bottom" />
            </>
        )
    }
}
