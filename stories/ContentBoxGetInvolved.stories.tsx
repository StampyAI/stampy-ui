import type {Meta, StoryObj} from '@storybook/react'
import {ContentBoxGetInvolved} from '../app/components/ContentBoxGetInvolved/Box'

const meta = {
  title: 'Components/ContentBoxGetInvolved',
  component: ContentBoxGetInvolved,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContentBoxGetInvolved>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
