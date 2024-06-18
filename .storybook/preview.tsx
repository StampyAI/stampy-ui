import {createRemixStub} from '@remix-run/testing'
import type {Preview} from '@storybook/react'
import {CachedObjectsProvider} from '../app//hooks/useCachedObjects'

import '../app/newRoot.css'

export const decorators = [
  (Story) => {
    const RemixStub = createRemixStub([
      {
        path: '*',
        Component: () => <Story />,
      },
    ])
    return (
      <CachedObjectsProvider>
        <RemixStub />
      </CachedObjectsProvider>
    )
  },
]

const preview: Preview = {
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
