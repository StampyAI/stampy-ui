import {useState, useEffect, MouseEvent, useCallback} from 'react'
import type {ActionArgs} from '@remix-run/cloudflare'
import {Form, useSearchParams} from '@remix-run/react'
import {redirect, json} from '@remix-run/cloudflare'
import {likeQuestion} from '~/server-utils/stampy'
import {DarkLight, Edit, Flag, Followup, Hide, Like, Search} from '~/components/icons-generated'

export enum ActionType {
  DARKLIGHT = 'darkLight',
  EDIT = 'edit',
  FLAG = 'flag',
  FOLLOWUP = 'followup',
  HELPFUL = 'helpful',
  HIDE = 'hide',
  SEARCH = 'search',
}
export type ActionProps = {
  Icon: React.FC
  title: string
  handler?: (pageid: string) => Promise<string>
}
type ActionsDict = {
  [k: string]: ActionProps
}
const actions = {
  darkLight: {
    Icon: DarkLight,
    title: 'Dark/Light',
  },
  edit: {
    Icon: Edit,
    title: 'Edit',
  },
  flag: {
    Icon: Flag,
    title: 'Flag',
  },
  followup: {
    Icon: Followup,
    title: 'Followup',
  },
  helpful: {
    Icon: Like,
    title: 'Helpful',
    handler: likeQuestion,
  },
  hide: {
    Icon: Hide,
    title: 'Hide',
  },
  search: {
    Icon: Search,
    title: 'Search',
  },
} as ActionsDict

export const action = async ({request}: ActionArgs) => {
  const formData = await request.formData()
  const pageid = formData.get('pageid') as string
  const actionType = formData.get('action') as ActionType

  const handler = actions[actionType]?.handler
  if (handler) {
    const result = await handler(pageid)
    if (result != 'ok') return json({error: result}, {status: 400})
  } else {
    console.log(`Got unhandled action: ${actionType} for page ${pageid}`)
  }

  const state = formData.get('stateString')
  if (state) return redirect(`/?state=${state}`)
  return redirect('/')
}

export const Action = ({pageid, actionType}: {pageid: string; actionType: ActionType}) => {
  const [remixSearchParams] = useSearchParams()
  const [stateString] = useState(() => remixSearchParams.get('state') ?? '')
  const {Icon, title} = actions[actionType]

  // Get the state of this action for the given `pageid` from localstorage. This
  // will result in each action only being allowed once per browser
  const actionId = `${pageid}-${actionType}`
  const [actionTaken, setActionTaken] = useState(false)
  const loadActionTaken = useCallback(() => localStorage.getItem(actionId) === 'true', [actionId])
  useEffect(() => setActionTaken(loadActionTaken()), [loadActionTaken])
  useEffect(() => {
    if (loadActionTaken() || actionTaken) {
      localStorage.setItem(actionId, actionTaken.toString())
    }
  }, [actionTaken, loadActionTaken, actionId])

  const handleAction = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    setActionTaken(true)
    const searchParams = new URLSearchParams({pageid, action: actionType})
    const response = await fetch('/questions/actions', {method: 'POST', body: searchParams})
    setActionTaken(response.ok === true)
  }

  if (actionTaken) {
    return <></>
  }

  return (
    <Form replace action="/questions/actions" method="post" className="icon-link" title={title}>
      <input type="hidden" name="action" value={actionType} />
      <input type="hidden" name="pageid" value={pageid} />
      <input type="hidden" name="stateString" value={stateString} />
      <button className="icon-link" title={title} type="submit" onClick={handleAction}>
        <Icon />
        {title}
      </button>
    </Form>
  )
}
