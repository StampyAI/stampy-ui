import {useState, useEffect, useMemo} from 'react'
import type {MouseEvent} from 'react'
import {useSearchParams, useTransition} from 'remix'
import type {Question, QuestionState} from './stampy'

const getStateEntries = (state: string): [number, QuestionState][] =>
  Array.from(state.matchAll(/(\d+)(\D+)/g) ?? []).map((groups) => [
    Number(groups[1]),
    groups[2] as QuestionState,
  ])

export function useQuestionStateInUrl(initialQuestions: Question[]) {
  const [remixSearchParams] = useSearchParams()
  const transition = useTransition()

  const [stateString, setStateString] = useState(() => remixSearchParams.get('state'))
  const [questionMap, setQuestionMap] = useState(
    () => new Map(initialQuestions.map((q) => [q.pageid, q]))
  )

  useEffect(() => {
    if (transition.location) {
      const state = new URLSearchParams(transition.location.search).get('state')
      setStateString(state)
    }
  }, [transition.location])

  useEffect(() => {
    document.title = stateString ? `Stampy in Test - ${stateString}` : `Stampy in Test`
  }, [stateString])

  const initialCollapsedState = useMemo(
    () => initialQuestions.map(({pageid}) => `${pageid}-`).join(''),
    []
  )
  const questions: Question[] = useMemo(() => {
    return getStateEntries(stateString ?? initialCollapsedState).map(([pageid, questionState]) => ({
      pageid,
      title: '...',
      text: null,
      relatedQuestions: [],
      ...questionMap.get(pageid),
      questionState,
    }))
  }, [stateString, questionMap])

  const reset = (event: MouseEvent) => {
    event.preventDefault()
    history.replaceState('', '', '/')
    setStateString(null)
  }

  const toggleQuestion = (questionProps: Question) => {
    const {pageid, relatedQuestions} = questionProps
    const newRelatedQuestions = relatedQuestions.filter(
      (q) => !stateString?.includes(q.pageid.toString())
    )
    const newState = getStateEntries(stateString ?? initialCollapsedState)
      .map(([k, v]) => {
        if (k === pageid) {
          const newValue = v === '_' ? '-' : '_'
          const related = newRelatedQuestions.map((r) => `${r.pageid}r`).join('')
          return `${k}${newValue}${related}`
        }
        return `${k}${v}`
      })
      .join('')
    const newSearchParams = new URLSearchParams(remixSearchParams)
    newSearchParams.set('state', newState)
    history.replaceState(newState, '', '?' + newSearchParams.toString())
    setStateString(newState)
  }

  const onLazyLoadQuestion = (question: Question) => {
    setQuestionMap((currentMap) => {
      const newMap = new Map(currentMap)
      newMap.set(question.pageid, question)
      return newMap
    })
  }

  return {questions, reset, toggleQuestion, onLazyLoadQuestion}
}

// ---

export function useRerenderOnResize(): void {
  const [, set] = useState<{}>()

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const forceRerender = (e: unknown) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        set({})
      }, 100)
    }
    addEventListener('orientationchange', forceRerender)
    addEventListener('resize', forceRerender)

    return () => {
      removeEventListener('orientationchange', forceRerender)
      removeEventListener('resize', forceRerender)
    }
  }, [])
}
