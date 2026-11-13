export const isAuthorized = (request: Request) => {
  // In development environment, allow access without authentication
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  const header = request.headers.get('Authorization')

  if (!header) return false

  const parsed = atob(header.replace('Basic ', ''))
  if (!parsed) return false

  const [username, password] = parsed.split(':')
  return username === EDITOR_USERNAME && password === EDITOR_PASSWORD
}

// Spaces become hyphens, everything except ASCII letters, digits and hyphens is dropped
// (incl. curly quotes, dots and slashes), so each question has exactly one URL
export const canonicalizeQuestionSlug = (slug: string) =>
  slug
    .replaceAll(' ', '-')
    .replace(/[^A-Za-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const questionUrl = ({pageid, title}: {pageid: string; title?: string}) => {
  const slug = title ? canonicalizeQuestionSlug(title) : ''
  return slug ? `/questions/${pageid}/${slug}` : `/questions/${pageid}`
}

// The site's canonical URLs have no trailing slash (except the homepage)
export const CANONICAL_ORIGIN = 'https://aisafety.info'

// 301, but only cached by browsers for an hour, so a wrong rule can be fixed quickly
export const permanentRedirect = (url: URL | string) => {
  if (url instanceof URL) url.searchParams.delete('_data')
  return new Response(null, {
    status: 301,
    headers: {Location: url.toString(), 'Cache-Control': 'max-age=3600'},
  })
}

// The redirect target with the request's query string (e.g. utm_*) carried over.
// Keys already in the target win, relative targets stay relative, unparseable ones are returned as is
export const withRequestQuery = (requestUrl: string, to: string) => {
  const requestParams = new URL(requestUrl).searchParams
  let url: URL
  try {
    url = new URL(to, requestUrl)
  } catch {
    return to
  }
  const targetKeys = new Set(url.searchParams.keys())
  requestParams.forEach((value, key) => {
    if (!targetKeys.has(key)) url.searchParams.append(key, value)
  })
  const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(to) || to.startsWith('//')
  return isAbsolute ? url.toString() : url.pathname + url.search + url.hash
}

export const tagUrl = ({tagId, name}: {tagId?: number | string; name: string}) =>
  tagId ? `/categories/${tagId}/${name}` : `/categories/${name}`
export const articlesUrl = () => `/articles`
export const tagsUrl = () => `/categories`
export const allTagsUrl = () => `/categories/all`

const helpPages = {
  career: 'career',
  grassroots: 'grassroots',
  donate: 'donate',
  volunteer: 'volunteer',
  knowledge: 'knowledge',
  community: 'community',
}
export type HelpPage = keyof typeof helpPages
export const helpUrl = (name?: HelpPage) => `/how-can-i-help/${name ? helpPages[name] || name : ''}`
