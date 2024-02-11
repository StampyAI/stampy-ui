import type {Meta, StoryObj} from '@storybook/react'
import Button from '../app/components/Button'
import SvgAisafety from '~/components/icons-generated/Aisafety'

const meta = {
    title: 'Components/Button',
    component: Button,

    tags: ['autodocs'],
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

// Primary
export const Primary: Story = {
    args: {
        children: (
            <>
                <p>Click me</p>
            </>
        ),
        action: 'https://xkcd.com/285/',
        className: 'primary'
    },
}

// Primary - alt
export const PrimaryAlt: Story = {
    args: {
        children: 'Click me',
        action: 'https://xkcd.com/285/',
        className: 'primary-alt'
    },
}

// Secondary
export const Secondary: Story = {
    args: {
        children: 'Click me',
        action: 'https://xkcd.com/285/',
        className: 'secondary'
    },
}

// Secondary - alt
export const SecondaryAlt: Story = {
    args: {
        children: 'Click me',
        action: 'https://xkcd.com/285/',
        className: 'secondary-alt'
    },
}

// Button with text but which leads nowhere. I don't think this will be relevant either
export const Basic: Story = {
    args: {
        children: 'Button'
    },
}

// Button with text only, in which something happens that is not loading a link
export const BasicOnClick: Story = {
    args: {
        children: 'Click me',
        action: () => alert('hello'),
    },
}

export const Link: Story = {
    args: {
        children: 'Click me',
        action: 'https://xkcd.com/285/',
        className: 'primary'
    },
}

export const Link1: Story = {
    args: {
        children: (
            <>
                <SvgAisafety/>
                <div className="white">New to AI Safety?</div>
                <div className="teal-200">
                Something about <br />
                reading and quick
                </div>
            </>
        ),
        action: 'https://xkcd.com/285/',
        className: 'primary'
    },
}