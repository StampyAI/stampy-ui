import type {Meta, StoryObj} from '@storybook/react'
import Grid from '../app/components/Grid'

const toc = [
  {
    title: 'Technical alignment research categories',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    icon: 'https://cataas.com/cat/says/section1',
    pageid: 'https://google.com',
    hasText: true,
    ttr: 1,
    order: 0,
  },
  {
    title: 'Governance',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    icon: 'https://cataas.com/cat/says/section2',
    pageid: 'https://google.com',
    hasText: true,
    ttr: 1,
    order: 0,
  },
  {
    title: 'Existential risk concepts',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    icon: 'https://cataas.com/cat/says/section3',
    pageid: 'https://google.com',
    hasText: true,
    ttr: 1,
    order: 0,
  },
  {
    title: 'Predictions on advanced AI',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    icon: 'https://cataas.com/cat/says/section4',
    pageid: 'https://google.com',
    hasText: true,
    ttr: 1,
    order: 0,
  },
  {
    title: 'Prominent research organizations',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    icon: 'https://cataas.com/cat/says/section5',
    pageid: 'https://google.com',
    hasText: true,
    ttr: 1,
    order: 0,
  },
  {
    title: '6th item',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    icon: 'https://cataas.com/cat/says/section6',
    pageid: 'https://google.com',
    hasText: true,
    ttr: 1,
    order: 10,
  },
  {
    title: '7th item',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    icon: 'https://cataas.com/cat/says/section7',
    pageid: 'https://google.com',
    hasText: true,
    ttr: 1,
    order: 20,
  },
  {
    title: '8th item',
    subtitle: 'Lorem ipsum dolor sit amet consectetur',
    icon: 'https://cataas.com/cat/says/section8',
    pageid: 'https://google.com',
    hasText: true,
    ttr: 1,
    order: 30,
  },
]

const meta = {
  title: 'Components/Grid',
  component: Grid,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Grid>
export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    gridBoxes: toc,
  },
}

export const SingleItem: Story = {
  args: {
    gridBoxes: toc.slice(0, 1),
  },
}

export const ThreeItems: Story = {
  args: {
    gridBoxes: toc.slice(0, 3),
  },
}

export const FourItems: Story = {
  args: {
    gridBoxes: toc.slice(0, 4),
  },
}
