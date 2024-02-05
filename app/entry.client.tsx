// hydrateRoot only worked in dev mode but complained about hydration mismatch in prod build
// eslint-disable-next-line react/no-deprecated
import {hydrate} from 'react-dom'
import {RemixBrowser} from '@remix-run/react'

hydrate(<RemixBrowser />, document)
