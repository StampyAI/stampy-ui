import {useState, useRef, useEffect, useMemo, useCallback} from 'react'
import type {MouseEvent} from 'react'
import {useSearchParams, useTransition} from '@remix-run/react'
import {Question, QuestionState} from '~/server-utils/stampy'
import {fetchOnSiteAnswers} from '~/routes/questions/allOnSite'

const getStateEntries = (state: string): [string, QuestionState][] =>
  Array.from(state.matchAll(/([^-_r]+)([-_r]*)/g) ?? []).map((groups) => [
    groups[1],
    (groups[2] || '_') as QuestionState,
  ])

function updateQuestionMap(question: Question, map: Map<Question['pageid'], Question>): void {
  map.set(question.pageid, question)
  for (const {pageid, title} of question.relatedQuestions) {
    if (!pageid || map.has(pageid)) continue

    map.set(pageid, {title, pageid, text: null, answerEditLink: null, relatedQuestions: []})
  }
}

const emptyQuestionArray: Question[] = []
const emptyQuestionMap: Record<string, Question> = {}

export default function useQuestionStateInUrl(minLogo: boolean, initialQuestions: Question[]) {
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

  const onSiteAnswersRef = useRef(emptyQuestionArray)
  const onSiteGDocLinkMapRef = useRef(emptyQuestionMap)

  useEffect(() => {
    // not needed for initial screen => lazy load on client
    fetchOnSiteAnswers().then((data) => {
      onSiteAnswersRef.current = data
      onSiteGDocLinkMapRef.current = data.reduce((acc, q) => {
        if (q.answerEditLink) acc[q.answerEditLink] = q
        return acc
      }, emptyQuestionMap)
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
        const removePageRe = new RegExp(`${pageid}.`, 'g')
        currentState = `${pageid}-${currentState.replace(removePageRe, '')}`
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }

      const onSiteAnswers = onSiteAnswersRef.current
      if (onSiteAnswers.length === 0 && relatedQuestions.length > 0) {
        // if onSiteAnswers (needed for relatedQuestions) are not loaded yet, wait a moment to re-run
        setTimeout(() => toggleQuestion(questionProps, options), 500)
        return
      }
      const onSiteSet = new Set(onSiteAnswers.map(({pageid}) => pageid))

      const newRelatedQuestions = relatedQuestions.filter((question) => {
        const isOnSite = onSiteSet.has(question.pageid)
        // hide already displayed questions, detect duplicates by pageid (pageid can be different due to redirects)
        // TODO: #25 relocate already displayed to slide in as a new related one
        const isAlreadyDisplayed = questions.some(({pageid}) => pageid === question.pageid)
        return isOnSite && !isAlreadyDisplayed
      })

      const newState = getStateEntries(currentState)
        .map(([k, v]) => {
          if (k === pageid.toString()) {
            const newValue: QuestionState = v === '_' ? '-' : '_'
            const related = newRelatedQuestions
              .map((r) => (r.pageid ? `${r.pageid}r` : ''))
              .join('')
            return `${k}${newValue}${related}`
          }
          return `${k}${v}`
        })
        .join('')
      console.log(pageid, currentState, newState)
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
      updateQuestionMap(question, newMap)
      return newMap
    })
  }, [])

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
      const tmpQuestion = {
        pageid,
        title,
        text: null,
        answerEditLink: null,
        relatedQuestions: [],
      }
      onLazyLoadQuestion(tmpQuestion)
      toggleQuestion(tmpQuestion, {moveToTop: true})
    },
    [onLazyLoadQuestion, questionMap, toggleQuestion]
  )

  return {
    questions,
    onSiteAnswersRef,
    onSiteGDocLinkMapRef,
    reset,
    toggleQuestion,
    onLazyLoadQuestion,
    selectQuestion,
  }
}
