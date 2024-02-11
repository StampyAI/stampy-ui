import {BrowserRouter} from 'react-router-dom'
import type {Preview} from '@storybook/react'
import {CachedObjectsProvider} from '../app//hooks/useCachedObjects'

import '../app/newRoot.css'

export const decorators = [
  (Story) => (
    <CachedObjectsProvider>
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    </CachedObjectsProvider>
  ),
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
