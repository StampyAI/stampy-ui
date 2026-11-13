import {withRequestQuery} from './routesMapper'

describe('withRequestQuery', () => {
  const base = 'https://aisafety.info'

  test.each([
    {request: '/help', to: '/how-can-i-help', expected: '/how-can-i-help'},
    {
      request: '/help?utm_source=x',
      to: '/how-can-i-help',
      expected: '/how-can-i-help?utm_source=x',
    },
    {request: '/examples?state=1', to: '/?state=0', expected: '/?state=0'},
    {request: '/examples?state=1&a=2', to: '/?state=0', expected: '/?state=0&a=2'},
    {
      request: '/tags?utm_term=a&utm_term=b',
      to: '/categories',
      expected: '/categories?utm_term=a&utm_term=b',
    },
    {request: '/x?a=1', to: '/q#faq', expected: '/q?a=1#faq'},
    {
      request: '/event?ref=x',
      to: 'https://forms.gle/abc',
      expected: 'https://forms.gle/abc?ref=x',
    },
    {request: '/x?a=1', to: 'http://', expected: 'http://'},
  ])('$request -> $to', ({request, to, expected}) => {
    expect(withRequestQuery(base + request, to)).toBe(expected)
  })
})
