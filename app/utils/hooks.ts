import {useState, useEffect} from 'react'
import type {MouseEvent} from 'react'
import {useSearchParams, useTransition} from 'remix'
import type {Questions} from './stampy'

type QuestionState = '_' | '-'

export function useQuestionStateInUrl(questions: Questions) {
  // setSearchParams from useSearchParams() scrolls to top, duplicate in local state as a workaround
  const [searchParams] = useSearchParams()
  const transition = useTransition()
  const questionStatesFromSearchParams = (): Map<number, QuestionState> => {
    const state = searchParams.get('state')
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
  const [questionStates, setQuestionStates] = useState(questionStatesFromSearchParams)

  useEffect(() => {
    setQuestionStates(questionStatesFromSearchParams())
  }, [searchParams, transition.state])

  const isExpanded = (pageid: number) => questionStates.get(pageid) === '_'

  const toggleQuestion = (pageid: number | null, event?: MouseEvent) => {
    if (!pageid) {
      event?.preventDefault()
      history.pushState('', '', '/')
      document.title = `Stampy UI`
      setQuestionStates(new Map(questions.map(({pageid}) => [pageid, '-'])))
      return
    }
    questionStates.set(pageid, questionStates.get(pageid) === '_' ? '-' : '_')
    const newState = Array.from(questionStates.entries())
      .map(([k, v]) => `${k}${v}`)
      .join('')
    searchParams.set('state', newState)
    history.pushState(newState, '', '?' + searchParams.toString())
    document.title = `Stampy UI - ${newState}`
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
