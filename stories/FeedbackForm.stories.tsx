import type {Meta, StoryObj} from '@storybook/react'
import FeedbackForm from '../app/components/Article/FeedbackForm'
const meta = {
  title: 'Components/Article/FeedbackForm',
  component: FeedbackForm,
  tags: ['autodocs'],
} satisfies Meta<typeof FeedbackForm>
export default meta
type Story = StoryObj<typeof FeedbackForm>
export const Default: Story = {
  args: {
    pageid: 'NH50',
  },
}
