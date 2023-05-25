import {Question, QuestionState, RelatedQuestions, PageId} from '~/server-utils/stampy'

type StateEntry = [PageId, QuestionState]
type StateString = string

export const TOP = '-1'

const makeUniqueChecker = (): ((e: StateEntry) => boolean) => {
  const seen = new Set()
  return ([pageid]) => !seen.has(pageid) && Boolean(seen.add(pageid))
}
export const getStateEntries = (
  state: StateString,
  func = (e: StateEntry[]): StateEntry[] => e
): StateEntry[] =>
  func(
    Array.from(state.matchAll(/([^-_r]+)([-_r]*)/g) ?? []).map(
      (groups) =>
        [
          groups[1], // question id
          (groups[2] as QuestionState) || QuestionState.OPEN,
        ] as StateEntry
    )
  ).filter(makeUniqueChecker())

export const entryState = (state: StateString, pageid: PageId): QuestionState =>
  getStateEntries(state)
    .filter(([entryPageid]) => entryPageid === pageid.toString())
    .map(([pageid, state]) => state)[0]

export const removeRelated = (questions: StateEntry[]): StateEntry[] =>
  questions.filter((i) => i[1] != QuestionState.RELATED)

export const processStateEntries = (
  state: StateString,
  func?: (e: StateEntry[]) => StateEntry[]
): StateString => getStateEntries(state, func).flat().join('')

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

const pushToEndOfRelated = (pageId: PageId, entries: StateEntry[]) => {
  const pageIds = entries.map((entry: StateEntry) => entry[0])
  const states = entries.map((entry: StateEntry) => entry[1])

  const index = pageIds.indexOf(pageId)
  if (index < 0 || entries[index][1] != QuestionState.RELATED) {
    return entries
  }

  const nextParent = states.map((state) => state != QuestionState.RELATED).indexOf(true, index)
  if (nextParent < 0) {
    entries.push(entries[index])
  } else {
    entries.splice(nextParent, 0, entries[index])
  }
  entries.splice(index, 1)
  return entries
}
/*
 * Open the given question and add its subquestions - this will return an appropriate URL param string
 */
export const insertInto = (
  state: StateString,
  pageid: PageId,
  relatedQuestions: RelatedQuestions,
  options = {toggle: true}
): StateString => {
  return processStateEntries(state, (entries: StateEntry[]) =>
    // If the question is a related one, move all other related questions above it
    pushToEndOfRelated(pageid, entries)
      // If the question's related questions are already displayed, remove them, so they are shown as this
      // ones related questions
      .filter(
        ([statePageid]: StateEntry) => !relatedQuestions.some(({pageid}) => pageid == statePageid)
      )
      // Toggle the selected question and append all its related questions
      .reduce((acc: StateEntry[], [statePageid, stateStatus]: StateEntry) => {
        if (statePageid === pageid.toString()) {
          const newValue: QuestionState = options.toggle
            ? stateStatus === QuestionState.OPEN
              ? QuestionState.COLLAPSED
              : QuestionState.OPEN
            : stateStatus
          const related = relatedQuestions
            .filter((i) => i)
            .map((r) => [r.pageid, QuestionState.RELATED] as StateEntry)
          acc.push([statePageid, newValue])
          return acc.concat(related)
        } else {
          acc.push([statePageid, stateStatus])
        }
        return acc
      }, [])
  )
}

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

export const questionsOnPage = (state: StateString): StateEntry[] =>
  removeRelated(getStateEntries(state))
