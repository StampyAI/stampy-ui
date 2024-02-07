import type {Meta, StoryObj} from '@storybook/react'
import {PageSubheaderText} from '../app/components/PageSubheaderText'

const meta = {
  title: 'Components/SubHeader',
  component: PageSubheaderText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageSubheaderText>
export default meta
type Story = StoryObj<typeof PageSubheaderText>
export const Default: Story = {
  args: {
    text: 'Introductory content',
  },
}
