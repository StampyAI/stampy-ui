export const questionUrl = ({pageid, title}: {pageid: string; title?: string}) =>
  `/questions/${pageid}/${title?.replaceAll(' ', '-') || ''}`

export const tagUrl = ({tagId, name}: {tagId?: number | string; name: string}) =>
  tagId ? `/categories/${tagId}/${name}` : `/categories/${name}`
export const tagsUrl = () => `/categories/`
export const allTagsUrl = () => `/categories/all`
