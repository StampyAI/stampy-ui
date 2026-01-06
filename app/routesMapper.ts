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

export const canonicalizeQuestionSlug = (slug: string) => {
  // Replace spaces with hyphens
  let canonical = slug.replaceAll(' ', '-')

  // Remove special characters that shouldn't be in URLs
  // Keep alphanumeric, hyphens, and allow some safe characters
  canonical = canonical.replace(/[?!,;:()[\]{}'"]/g, '')

  return canonical
}

export const questionUrl = ({pageid, title}: {pageid: string; title?: string}) =>
  `/questions/${pageid}/${title ? canonicalizeQuestionSlug(title) : ''}`

export const tagUrl = ({tagId, name}: {tagId?: number | string; name: string}) =>
  tagId ? `/categories/${tagId}/${name}` : `/categories/${name}`
export const tagsUrl = () => `/categories/`
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
