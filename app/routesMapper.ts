export const isAuthorized = (request: Request) => {
  const header = request.headers.get('Authorization')

  if (!header) return false

  const parsed = atob(header.replace('Basic ', ''))
  if (!parsed) return false

  const [username, password] = parsed.split(':')
  return username === EDITOR_USERNAME && password === EDITOR_PASSWORD
}

export const questionUrl = ({pageid, title}: {pageid: string; title?: string}) =>
  `/questions/${pageid}/${title?.replaceAll(' ', '-') || ''}`

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
