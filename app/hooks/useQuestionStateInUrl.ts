import {useState, useRef, useEffect, useMemo, useCallback} from 'react'
import type {MouseEvent} from 'react'
import {useSearchParams, useTransition} from '@remix-run/react'
import type {Question, QuestionState} from '~/server-utils/stampy'
import {fetchAllCanonicallyAnsweredQuestions} from '~/routes/questions/allCanonicallyAnswered'
import {fetchQuestion} from '~/routes/questions/$question'
import {RawSearchableItem} from '~/components/search'

export const tmpPageId = 999999

const getStateEntries = (state: string): [number, QuestionState][] =>
  Array.from(state.matchAll(/(\d+)(\D*)/g) ?? []).map((groups) => [
    Number(groups[1]),
    (groups[2] || '_') as QuestionState,
  ])

function updateQuestionMap(question: Question, map: Map<Question['shortId'], Question>): void {
  map.set(question.shortId, question)
  for (const {shortId, gdocId, title} of question.relatedQuestions) {
    if (!shortId || map.has(shortId)) continue

    map.set(shortId, {gdocId, question: title, shortId, relatedQuestions: []})
  }
}

export default function useQuestionStateInUrl(minLogo: boolean, initialQuestions: Question[]) {
  const [remixSearchParams] = useSearchParams()
  const transition = useTransition()

  const [stateString, setStateString] = useState(() => remixSearchParams.get('state'))
  const [questionMap, setQuestionMap] = useState(() => {
    const initialMap: Map<Question['shortId'], Question> = new Map()
    for (const question of initialQuestions) {
      updateQuestionMap(question, initialMap)
    }
    return initialMap
  })

  const canonicallyAnsweredQuestionsRef = useRef<RawSearchableItem[]>([])

  useEffect(() => {
    // not needed for initial screen => lazy load on client
    fetchAllCanonicallyAnsweredQuestions().then((data) => {
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
    document.title = minLogo ? 'AI Safety FAQ' : `Stampy (alpha)${suffix}`
  }, [stateString, minLogo])

  const initialCollapsedState = useMemo(
    () => initialQuestions.map(({shortId}) => `${shortId}-`).join(''),
    [initialQuestions]
  )
  const questions: Question[] = useMemo(() => {
    return getStateEntries(stateString ?? initialCollapsedState).map(
      ([shortId, questionState]) => ({
        shortId,
        gdocId: '...',
        question: '...',
        relatedQuestions: [],
        ...questionMap.get(shortId),
        questionState,
      })
    )
  }, [stateString, initialCollapsedState, questionMap])

  const reset = (event: MouseEvent) => {
    event.preventDefault()
    history.replaceState('', '', '/')
    setStateString(null)
  }

  const toggleQuestion = useCallback(
    (questionProps: Question, options?: {moveToTop?: boolean}) => {
      const {shortId, relatedQuestions} = questionProps
      let currentState = stateString ?? initialCollapsedState
      if (options?.moveToTop) {
        const removePageRe = new RegExp(`${shortId}.|${tmpPageId}.`, 'g')
        currentState = `${shortId}-${currentState.replace(removePageRe, '')}`
      }

      const canonicallyAnsweredQuestions = canonicallyAnsweredQuestionsRef.current.map(
        ({title}) => title
      )
      if (canonicallyAnsweredQuestions.length === 0 && relatedQuestions.length > 0) {
        // if canonicallyAnsweredQuestions (needed for relatedQuestions) are not loaded yet, wait a moment to re-run
        setTimeout(() => toggleQuestion(questionProps, options), 500)
        return
      }
      const canonicalQuestionTitleSet = new Set(canonicallyAnsweredQuestions)

      const newRelatedQuestions = relatedQuestions.filter((rq) => {
        const hasCanonicalAnswer = canonicalQuestionTitleSet.has(rq.title)
        // hide already displayed questions, detect duplicates by title (shortId can be different due to redirects)
        // TODO: #25 relocate already displayed to slide in as a new related one
        const isAlreadyDisplayed = questions.some(({question}) => question === rq.title)
        return hasCanonicalAnswer && !isAlreadyDisplayed
      })

      const newState = getStateEntries(currentState)
        .map(([k, v]) => {
          if (k === shortId) {
            const newValue: QuestionState = v === '_' ? '-' : '_'
            const related = newRelatedQuestions
              .map((r) => (r.shortId ? `${r.shortId}r` : ''))
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

  const onLazyLoadQuestion = useCallback((q: Question) => {
    setQuestionMap((currentMap) => {
      const newMap = new Map(currentMap)
      if (q.shortId !== tmpPageId && q.question === newMap.get(tmpPageId)?.question) {
        newMap.delete(tmpPageId)
      }
      updateQuestionMap(q, newMap)
      return newMap
    })
  }, [])

  const selectQuestionByGdocId = useCallback(
    (gdocId: string) => {
      // if the question is already loaded, move it to top
      for (const q of questionMap.values()) {
        if (gdocId === q.question) {
          if (q.shortId !== tmpPageId) {
            toggleQuestion(q, {moveToTop: true})
          }
          return
        }
      }
      // else load new question
      const tmpQuestion: Question = {
        shortId: tmpPageId,
        gdocId,
        question: '...',
        relatedQuestions: [],
      }
      onLazyLoadQuestion(tmpQuestion)
      toggleQuestion(tmpQuestion, {moveToTop: true})

      fetchQuestion(encodeURIComponent(gdocId)).then((newQuestion) => {
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
    selectQuestionByGdocId,
  }
}
