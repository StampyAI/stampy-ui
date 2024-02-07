import type {Meta, StoryObj} from '@storybook/react'
import {ListTable} from '../app/components/Table/ListTable'

const meta = {
  title: 'Components/ListTable',
  component: ListTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ListTable>
export default meta
type Story = StoryObj<typeof ListTable>
export const Default: Story = {
  args: {
    elements: [
      {title: 'What is AI alignment', pageid: '1231'},
      {title: 'What is this', pageid: '1232'},
      {title: 'What is AI safety', pageid: '1233'},
      {title: 'What is that', pageid: '1234'},
      {title: 'What is the the orthogonality thesis', pageid: '1235'},
      {title: 'What is something else', pageid: '1236'},
    ],
  },
}
