import {useState, useRef, useEffect, useMemo, useCallback} from 'react'
import type {MouseEvent} from 'react'
import {useSearchParams, useTransition} from '@remix-run/react'
import {
  Question,
  QuestionState,
  RelatedQuestions,
  PageId,
  QuestionStatus,
  Glossary,
} from '~/server-utils/stampy'
import {fetchAllQuestionsOnSite} from '~/routes/questions/allQuestionsOnSite'
import {fetchGlossary} from '~/routes/questions/glossary'
import {
  processStateEntries,
  getStateEntries,
  addQuestions as addQuestionsToState,
  insertInto as insertIntoState,
  moveQuestion as moveQuestionInState,
  moveToTop as moveQuestionToTop,
} from '~/hooks/stateModifiers'

function updateQuestionMap(question: Question, map: Map<PageId, Question>): Map<PageId, Question> {
  map.set(question.pageid, question)
  for (const {pageid, title} of question.relatedQuestions) {
    if (!pageid || map.has(pageid)) continue

    map.set(pageid, {
      title,
      pageid,
      text: null,
      answerEditLink: null,
      relatedQuestions: [],
      tags: [],
    })
  }
  return map
}

const emptyQuestionArray: Question[] = []

export default function useQuestionStateInUrl(minLogo: boolean, initialQuestions: Question[]) {
  const [remixSearchParams] = useSearchParams()
  const transition = useTransition()

  const [stateString, setStateString] = useState(
    () =>
      remixSearchParams.get('state') && processStateEntries(remixSearchParams.get('state') ?? '')
  )
  const [questionMap, setQuestionMap] = useState(() => {
    const initialMap: Map<PageId, Question> = new Map()
    for (const question of initialQuestions) {
      updateQuestionMap(question, initialMap)
    }
    return initialMap
  })
  const [glossary, setGlossary] = useState({} as Glossary)

  const onSiteQuestionsRef = useRef(emptyQuestionArray)

  useEffect(() => {
    // not needed for initial screen => lazy load on client
    fetchAllQuestionsOnSite().then(({data, backgroundPromiseIfReloaded}) => {
      onSiteQuestionsRef.current = data
      backgroundPromiseIfReloaded.then((x) => {
        if (x) onSiteQuestionsRef.current = x.data
      })
    })
    fetchGlossary().then(({data, backgroundPromiseIfReloaded}) => {
      setGlossary(data)
      backgroundPromiseIfReloaded.then((x) => {
        if (x) setGlossary(x.data)
      })
    })
  }, [])

  useEffect(() => {
    if (transition.location) {
      const state = new URLSearchParams(transition.location.search).get('state')
      setStateString(state)
    }
  }, [transition.location])

  const initialCollapsedState = useMemo(
    () => initialQuestions.map(({pageid}) => `${pageid}${QuestionState.COLLAPSED}`).join(''),
    [initialQuestions]
  )
  const questions: Question[] = useMemo(() => {
    return getStateEntries(stateString ?? initialCollapsedState).map(([pageid, questionState]) => ({
      pageid,
      title: '...',
      text: null,
      answerEditLink: null,
      relatedQuestions: [],
      questionState,
      tags: [],
      ...questionMap.get(pageid),
    }))
  }, [stateString, initialCollapsedState, questionMap])

  useEffect(() => {
    const mainQuestions = questions.filter(
      ({questionState}) => questionState != QuestionState.RELATED
    )
    let title
    if (minLogo) {
      title = 'AI Safety FAQ'
    } else if (mainQuestions.length == 1) {
      title = mainQuestions[0].title
    } else {
      const suffix = stateString ? ` - ${stateString}` : ''
      title = `Stampy ${suffix}`
    }
    if (title.length > 150) title = title.slice(0, 150 - 3) + '...'
    document.title = title
  }, [stateString, minLogo, questions])

  const reset = (event: MouseEvent) => {
    event.preventDefault()
    history.replaceState('', '', '/')
    setStateString(null)
  }

  const moveToTop = (currentState: string, {pageid}: Question) => {
    setTimeout(() => {
      // scroll to top after the state is updated
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    })
    return moveQuestionToTop(currentState, pageid)
  }

  /*
   * Get all related questions of the provided `question` that aren't already displayed on the site
   */
  const unshownRelatedQuestions = (
    questions: Question[],
    questionProps: Question
  ): RelatedQuestions => {
    const {relatedQuestions} = questionProps

    const onSiteQuestions = onSiteQuestionsRef.current
    const onSiteSet = new Set(onSiteQuestions.map(({pageid}) => pageid))

    return relatedQuestions.filter((question) => {
      const isOnSite = onSiteSet.has(question.pageid)
      // hide already displayed questions, detect duplicates by pageid (pageid can be different due to redirects)
      // TODO: #25 relocate already displayed to slide in as a new related one
      const isAlreadyDisplayed = questions.some(({pageid}) => pageid === question.pageid)
      return isOnSite && !isAlreadyDisplayed
    })
  }

  /*
   * Update the window.location with the new URL state
   */
  const updateStateString = useCallback(
    (newState: string) => {
      if (stateString == newState) return
      const newSearchParams = new URLSearchParams(remixSearchParams)
      newSearchParams.set('state', newState)
      history.replaceState(newState, '', '?' + newSearchParams.toString())
      setStateString(newState)
    },
    [remixSearchParams, stateString]
  )

  /*
   * Add the given `questions` to the global questions map. This will not update the URL
   */
  const mergeNewQuestions = useCallback((questions: Question[]) => {
    setQuestionMap((currentMap) =>
      questions.reduce((map, question) => updateQuestionMap(question, map), new Map(currentMap))
    )
  }, [])

  /*
   * Add the given `newQuestions` to the collection of questions. This will also update the URL
   */
  const addQuestions = useCallback(
    (newQuestions: Question[]) => {
      const questions = newQuestions.filter((q) => !questionMap.get(q.pageid))
      mergeNewQuestions(questions)

      const newState = addQuestionsToState(stateString ?? initialCollapsedState, questions)
      updateStateString(newState)
    },
    [initialCollapsedState, stateString, questionMap, updateStateString, mergeNewQuestions]
  )

  /*
   * Toggle the selected question.
   *
   * If the question is to be opened, this will also make sure all it's related questions
   * are on the page
   */
  const toggleQuestion = useCallback(
    (questionProps: Question, options?: {moveToTop?: boolean; onlyRelated?: boolean}) => {
      const {pageid, relatedQuestions} = questionProps
      let currentState = stateString ?? initialCollapsedState

      if (options?.moveToTop) {
        currentState = moveToTop(currentState, questionProps)
      }

      const onSiteQuestions = onSiteQuestionsRef.current
      if (onSiteQuestions.length === 0 && relatedQuestions.length > 0) {
        // if onSiteAnswers (needed for relatedQuestions) are not loaded yet, wait a moment to re-run
        setTimeout(() => toggleQuestion(questionProps, options), 200)
        return
      }

      const newRelatedQuestions = unshownRelatedQuestions(questions, questionProps)
      const newState = insertIntoState(currentState, pageid, newRelatedQuestions, {
        toggle: !options?.onlyRelated,
      })

      updateStateString(newState)
    },
    [initialCollapsedState, questions, stateString, updateStateString]
  )

  const onLazyLoadQuestion = useCallback(
    (question: Question) => mergeNewQuestions([question]),
    [mergeNewQuestions]
  )

  const moveQuestion = useCallback(
    (pageId: PageId, to: PageId | null) => {
      const currentState = stateString ?? initialCollapsedState
      updateStateString(moveQuestionInState(currentState, pageId, to ?? ''))
    },
    [initialCollapsedState, stateString, updateStateString]
  )

  /*
   * Moves the given question to the top of the page, opens it, and make sure all related ones are loaded
   */
  const selectQuestion = useCallback(
    (pageid: string, title: string) => {
      // if the question is already loaded, move it to top
      for (const q of questionMap.values()) {
        if (pageid === q.pageid) {
          toggleQuestion(q, {moveToTop: true})
          return
        }
      }
      // else show the new question in main view and let the Question component fetch it
      const tmpQuestion: Question = {
        pageid,
        title,
        text: null,
        answerEditLink: null,
        relatedQuestions: [],
        tags: [],
      }
      onLazyLoadQuestion(tmpQuestion)
      toggleQuestion(tmpQuestion, {moveToTop: true})
    },
    [onLazyLoadQuestion, questionMap, toggleQuestion]
  )

  // if there is only 1 question from a direct link, load related questions too
  useEffect(() => {
    if (questions.length === 1) {
      const insertAfterOnSiteStatusIsKnown = () => {
        if (onSiteQuestionsRef.current.length === 0) {
          setTimeout(insertAfterOnSiteStatusIsKnown, 200)
          return
        }
        const relatedQuestions = unshownRelatedQuestions([], questions[0])
        const newState = insertIntoState(
          stateString ?? initialCollapsedState,
          questions[0].pageid,
          relatedQuestions,
          {toggle: false}
        )

        updateStateString(newState)
      }
      insertAfterOnSiteStatusIsKnown()
    }
  }, [questions, stateString, initialCollapsedState, updateStateString])

  return {
    questions,
    onSiteQuestionsRef,
    reset,
    toggleQuestion,
    onLazyLoadQuestion,
    selectQuestion,
    addQuestions,
    moveQuestion,
    glossary,
  }
}
