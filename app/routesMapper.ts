export const questionUrl = ({pageid, title}: {pageid: string; title?: string}) =>
  `/questions/${pageid}/${title?.replaceAll(' ', '-') || ''}`

export const tagUrl = ({tagId, name}: {tagId?: number | string; name: string}) =>
  tagId ? `/tags/${tagId}/${name}` : `/tags/${name}`
export const tagsUrl = () => `/tags/`
export const allTagsUrl = () => `/tags/all`
