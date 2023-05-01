import {rest} from 'msw'
import {question2400} from './question-data/question-2400'

export const handlers = [
  rest.get(new URL(question2400.href).pathname, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(question2400))
  }),
]
