import type {StorybookConfig} from '@storybook/react-vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-designs', // 👈 Addon is registered here
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config, {configType}) => {
    config.resolve.alias['~/'] = `${path.resolve(__dirname, '../app')}/`
    return config
  },
}
export default config
