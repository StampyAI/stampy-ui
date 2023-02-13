import {Question, QuestionState, RelatedQuestions, PageId} from '~/server-utils/stampy'

type StateEntry = [PageId, QuestionState]
type StateString = string

export const TOP = '-1'

export const getStateEntries = (state: StateString): StateEntry[] =>
  Array.from(state.matchAll(/([^-_r]+)([-_r]*)/g) ?? []).map((groups) => [
    groups[1], // question id
    (groups[2] as QuestionState) || QuestionState.OPEN,
  ])

export const moveToTop = (state: StateString, pageid: PageId): StateString => {
  const removePageRe = new RegExp(`${pageid}.`, 'g')
  return `${pageid}-${state.replace(removePageRe, '')}`
}

/*
 * Add all the provided `questions` to the state string as collapsed
 */
export const addQuestions = (state: StateString, questions: Question[]): StateString =>
    getStateEntries(state).concat(questions.map(q => [q.pageid, QuestionState.COLLAPSED])).flat().join('')

export const insertAfter = (state: StateString, pageId: PageId, to: PageId): StateString => {
  const entries = getStateEntries(state)
  const moved = entries.find((e) => e[0] == pageId)

  if (!moved) return state

  return entries
    .reduce((acc: StateEntry[], entry: StateEntry) => {
      const [currentId] = entry
      if (currentId !== pageId) {
        acc.push(entry)
      }
      if (currentId === to) {
        acc.push(moved)
      }
      return acc
    }, [])
    .flat()
    .join('')
}

/*
 * Open the given question and add its subquestions - this will return an appropriate URL param string
 */
export const insertInto = (
  state: StateString,
  pageid: PageId,
  relatedQuestions: RelatedQuestions
): StateString =>
  getStateEntries(state)
    .map(([k, v]) => {
      if (k === pageid.toString()) {
        const newValue: QuestionState =
          v === QuestionState.OPEN ? QuestionState.COLLAPSED : QuestionState.OPEN
        const related = relatedQuestions
          .filter((i) => i)
          .map((r) => `${r.pageid}${QuestionState.RELATED}`)
          .join('')
        return `${k}${newValue}${related}`
      }
      return `${k}${v}`
    })
    .join('')

export const removeQuestion = (state: StateString, pageid: PageId): StateString =>
  getStateEntries(state)
    .filter((q) => q[0] != pageid)
    .flat()
    .join('')

export const moveQuestion = (state: StateString, pageid: PageId, to: PageId): StateString => {
  switch (to) {
    case TOP:
      return moveToTop(state, pageid)
    case null:
    case undefined:
      return removeQuestion(state, pageid)
    default:
      return insertAfter(state, pageid, to)
  }
}
