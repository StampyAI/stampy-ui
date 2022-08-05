import {useState, useRef, useEffect, useMemo, useCallback} from 'react'
import type {MouseEvent} from 'react'
import {useSearchParams, useTransition} from '@remix-run/react'
import type {Question, QuestionState} from '~/stampy'

export const tmpPageId = 999999

const getStateEntries = (state: string): [number, QuestionState][] =>
  Array.from(state.matchAll(/(\d+)(\D+)/g) ?? []).map((groups) => [
    Number(groups[1]),
    groups[2] as QuestionState,
  ])

function updateQuestionMap(question: Question, map: Map<Question['pageid'], Question>): void {
  map.set(question.pageid, question)
  for (const {pageid, title} of question.relatedQuestions) {
    if (!pageid || map.has(pageid)) continue

    map.set(pageid, {title, pageid, text: null, answerEditLink: null, relatedQuestions: []})
  }
}

export default function useQuestionStateInUrl(initialQuestions: Question[]) {
  const [remixSearchParams] = useSearchParams()
  const transition = useTransition()

  const [stateString, setStateString] = useState(() => remixSearchParams.get('state'))
  const [questionMap, setQuestionMap] = useState(() => {
    const initialMap: Map<Question['pageid'], Question> = new Map()
    for (const question of initialQuestions) {
      updateQuestionMap(question, initialMap)
    }
    return initialMap
  })

  const canonicallyAnsweredQuestionsRef = useRef<string[]>([])

  useEffect(() => {
    // not needed for initial screen => lazy load on client
    fetch('/questions/allCanonicallyAnswered')
      .then((r) => r.json())
      .then((data: string[]) => {
        canonicallyAnsweredQuestionsRef.current = data
      })
  }, [])

  useEffect(() => {
    if (transition.location) {
      const state = new URLSearchParams(transition.location.search).get('state')
      setStateString(state)
    }
  }, [transition.location])

  useEffect(() => {
    const suffix = stateString ? ` - ${stateString}` : ''
    document.title = `Stampy (alpha)${suffix}`
  }, [stateString])

  const initialCollapsedState = useMemo(
    () => initialQuestions.map(({pageid}) => `${pageid}-`).join(''),
    [initialQuestions]
  )
  const questions: Question[] = useMemo(() => {
    return getStateEntries(stateString ?? initialCollapsedState).map(([pageid, questionState]) => ({
      pageid,
      title: '...',
      text: null,
      answerEditLink: null,
      relatedQuestions: [],
      ...questionMap.get(pageid),
      questionState,
    }))
  }, [stateString, initialCollapsedState, questionMap])

  const reset = (event: MouseEvent) => {
    event.preventDefault()
    history.replaceState('', '', '/')
    setStateString(null)
  }

  const toggleQuestion = useCallback(
    (questionProps: Question, options?: {moveToTop?: boolean}) => {
      const {pageid, relatedQuestions} = questionProps
      let currentState = stateString ?? initialCollapsedState
      if (options?.moveToTop) {
        const removePageRe = new RegExp(`${pageid}.|${tmpPageId}.`, 'g')
        currentState = `${pageid}-${currentState.replace(removePageRe, '')}`
      }

      const canonicallyAnsweredQuestions = canonicallyAnsweredQuestionsRef.current
      if (canonicallyAnsweredQuestions.length === 0 && relatedQuestions.length > 0) {
        // if canonicallyAnsweredQuestions (needed for relatedQuestions) are not loaded yet, wait a moment to re-run
        setTimeout(() => toggleQuestion(questionProps, options), 500)
        return
      }
      const canonicalQuestionTitleSet = new Set(canonicallyAnsweredQuestions)

      const newRelatedQuestions = relatedQuestions.filter((q) => {
        const hasCanonicalAnswer = canonicalQuestionTitleSet.has(q.title)
        // hide already displayed questions, detect duplicates by title (pageid can be different due to redirects)
        // TODO: #25 relocate already displayed to slide in as a new related one
        const isAlreadyDisplayed = questions.some(({title}) => title === q.title)
        return hasCanonicalAnswer && !isAlreadyDisplayed
      })

      const newState = getStateEntries(currentState)
        .map(([k, v]) => {
          if (k === pageid) {
            const newValue: QuestionState = v === '_' ? '-' : '_'
            const related = newRelatedQuestions
              .map((r) => (r.pageid ? `${r.pageid}r` : ''))
              .join('')
            return `${k}${newValue}${related}`
          }
          return `${k}${v}`
        })
        .join('')
      const newSearchParams = new URLSearchParams(remixSearchParams)
      newSearchParams.set('state', newState)
      history.replaceState(newState, '', '?' + newSearchParams.toString())
      setStateString(newState)
    },
    [initialCollapsedState, questions, remixSearchParams, stateString]
  )

  const onLazyLoadQuestion = useCallback((question: Question) => {
    setQuestionMap((currentMap) => {
      const newMap = new Map(currentMap)
      if (question.pageid !== tmpPageId && question.title === newMap.get(tmpPageId)?.title) {
        newMap.delete(tmpPageId)
      }
      updateQuestionMap(question, newMap)
      return newMap
    })
  }, [])

  const selectQuestionByTitle = useCallback(
    (title: string) => {
      // if the question is already loaded, move it to top
      for (const q of questionMap.values()) {
        if (title === q.title) {
          if (q.pageid !== tmpPageId) {
            toggleQuestion(q, {moveToTop: true})
          }
          return
        }
      }
      // else load new question
      const tmpQuestion = {
        pageid: tmpPageId,
        title,
        text: null,
        answerEditLink: null,
        relatedQuestions: [],
      }
      onLazyLoadQuestion(tmpQuestion)
      toggleQuestion(tmpQuestion, {moveToTop: true})

      fetch(`/questions/${encodeURIComponent(title)}`)
        .then((response) => response.json())
        .then((newQuestion: Question) => {
          onLazyLoadQuestion(newQuestion)
          toggleQuestion(newQuestion, {moveToTop: true})
        })
    },
    [onLazyLoadQuestion, questionMap, toggleQuestion]
  )

  return {
    questions,
    canonicallyAnsweredQuestionsRef,
    reset,
    toggleQuestion,
    onLazyLoadQuestion,
    selectQuestionByTitle,
  }
}
