import {Question, QuestionState, RelatedQuestions, PageId} from '~/server-utils/stampy'

type StateEntry = [PageId, QuestionState]
type StateString = string

export const TOP = '-1'

const uniqueChecker = (): ((e: StateEntry) => boolean) => {
  const seen = new Set()
  return ([pageid]) => !seen.has(pageid) && Boolean(seen.add(pageid))
}
export const getStateEntries = (state: StateString): StateEntry[] =>
  Array.from(state.matchAll(/([^-_r]+)([-_r]*)/g) ?? [])
    .map(
      (groups) =>
        [
          groups[1], // question id
          (groups[2] as QuestionState) || QuestionState.OPEN,
        ] as StateEntry
    )
    .filter(uniqueChecker())

export const processStateEntries = (
  state: StateString,
  func = (e: StateEntry[]): StateEntry[] => e
): StateString => func(getStateEntries(state)).filter(uniqueChecker()).flat().join('')

export const moveToTop = (state: StateString, pageid: PageId): StateString => {
  const removePageRe = new RegExp(`${pageid}.`, 'g')
  return `${pageid}-${state.replace(removePageRe, '')}`
}

/*
 * Add all the provided `questions` to the state string as collapsed
 */
export const addQuestions = (state: StateString, questions: Question[]): StateString =>
  processStateEntries(state, (entries) =>
    entries.concat(questions.map((q) => [q.pageid, QuestionState.COLLAPSED]))
  )

export const insertAfter = (state: StateString, pageId: PageId, to: PageId): StateString => {
  const moveEntry = (entries: StateEntry[]) => {
    const moved = entries.find((e) => e[0] == pageId)

    if (!moved) return entries

    return entries.reduce((acc: StateEntry[], entry: StateEntry) => {
      const [currentId] = entry
      if (currentId !== pageId) {
        acc.push(entry)
      }
      if (currentId === to) {
        acc.push(moved)
      }
      return acc
    }, [])
  }
  return processStateEntries(state, moveEntry)
}

/*
 * Open the given question and add its subquestions - this will return an appropriate URL param string
 */
export const insertInto = (
  state: StateString,
  pageid: PageId,
  relatedQuestions: RelatedQuestions
): StateString =>
  processStateEntries(state, (entries: StateEntry[]) =>
    entries.reduce((acc: StateEntry[], [k, v]: StateEntry) => {
      if (k === pageid.toString()) {
        const newValue: QuestionState =
          v === QuestionState.OPEN ? QuestionState.COLLAPSED : QuestionState.OPEN
        const related = relatedQuestions
          .filter((i) => i)
          .map((r) => [r.pageid, QuestionState.RELATED] as StateEntry)
        acc.push([k, newValue])
        return acc.concat(related)
      } else {
        acc.push([k, v])
      }
      return acc
    }, [])
  )

export const removeQuestion = (state: StateString, pageid: PageId): StateString =>
  processStateEntries(state, (entries) => entries.filter((q) => q[0] != pageid))

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
