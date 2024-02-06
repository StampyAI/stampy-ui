import type {Meta, StoryObj} from '@storybook/react'
import {WidgetStampy} from '../app/components/Widget/Stampy.tsx'

const meta = {
  title: 'Components/WidgetStampy',
  component: WidgetStampy,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WidgetStampy>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {},
}
