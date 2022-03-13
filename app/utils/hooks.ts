import {useState, useEffect} from 'react'
import type {MouseEvent} from 'react'
import {useSearchParams, useTransition} from 'remix'
import type {Questions} from './stampy'

type QuestionState = '_' | '-'

export function useQuestionStateInUrl(questions: Questions) {
  // setSearchParams from useSearchParams() scrolls to top, so using in local state as a workaround
  const [remixSearchParams] = useSearchParams()
  const transition = useTransition()
  const questionStatesFromString = (state: string | null): Map<number, QuestionState> => {
    if (state) {
      return new Map(
        Array.from(state.matchAll(/(\d+)(\D+)/g) ?? []).map((groups) => [
          Number(groups[1]),
          groups[2] as QuestionState,
        ])
      )
    } else {
      return new Map(questions.map(({pageid}) => [pageid, '-']))
    }
  }
  const [questionStates, setQuestionStates] = useState(() =>
    questionStatesFromString(remixSearchParams.get('state'))
  )

  useEffect(() => {
    if (transition.location) {
      const state = new URLSearchParams(transition.location.search).get('state')
      setQuestionStates(questionStatesFromString(state))
    }
  }, [transition.location])

  const isExpanded = (pageid: number) => questionStates.get(pageid) === '_'

  const toggleQuestion = (pageid: number | null, event?: MouseEvent) => {
    if (!pageid) {
      event?.preventDefault()
      history.pushState('', '', '/')
      document.title = `Stampy in Test`
      setQuestionStates(new Map(questions.map(({pageid}) => [pageid, '-'])))
      return
    }
    questionStates.set(pageid, questionStates.get(pageid) === '_' ? '-' : '_')
    const newState = Array.from(questionStates.entries())
      .map(([k, v]) => `${k}${v}`)
      .join('')
    const newSearchParams = new URLSearchParams(remixSearchParams)
    newSearchParams.set('state', newState)
    history.pushState(newState, '', '?' + newSearchParams.toString())
    document.title = `Stampy in Test - ${newState}`
    setQuestionStates(new Map(questionStates))
  }

  return {isExpanded, toggleQuestion}
}

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
