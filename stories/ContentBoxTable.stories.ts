import type {Meta, StoryObj} from '@storybook/react'
import {ContentBoxTable} from '../app/components/ContentBoxTable/BoxWithTable'

const meta = {
  title: 'Components/ContentBoxTable',
  component: ContentBoxTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContentBoxTable>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    elements: [
        {title: 'What are the main sources of AI existential risk?', pageid: '123'},
        {title: 'Do people seriously worry about existential risk from AI?', pageid: '123'},
        {title: 'Why would an AI do bad things?', pageid: '123'},
    ],
  },
}
