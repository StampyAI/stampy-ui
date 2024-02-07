import type {Meta, StoryObj} from '@storybook/react'

import {MyComponent} from './testComponent'

// More on default export: https://storybook.js.org/docs/writing-stories/#default-export
const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Example: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qqfeYAh6Z7QdyJXsQjIUfh/Stampy?type=design&node-id=947-1815&mode=design',
    },
  },
}
