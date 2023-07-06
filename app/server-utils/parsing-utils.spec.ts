import {urlToIframe, externalLinksOnNewTab} from './parsing-utils'

describe('urlToIframe', () => {
  describe('should not convert a markdown link', () => {
    test.each([
      {text: 'this map', url: 'https://aisafety.world/'},
      {text: 'https://aisafety.world/', url: 'https://aisafety.world/?bla=bla'},
      {text: 'https://aisafety.world/?bla=bla', url: 'https://aisafety.world/'},
      {text: 'aisafety.world/', url: 'http://aisafety.world/'},
    ])('whose text does not match url', ({text, url}) => {
      const input = `[${text}](${url})`
      expect(urlToIframe(input)).toBe(input)
    })

    test('whose text matches url but is not whitelisted', () => {
      const url = 'https://example.com/'
      const input = `[${url}](${url})`
      expect(urlToIframe(input)).toBe(input)
    })

    test('whose text matches url but url is not valid', () => {
      const url = 'aisafety.world/'
      const input = `[${url}](${url})`
      expect(urlToIframe(input)).toBe(input)
    })
  })

  describe('should convert a markdown link', () => {
    test.each([
      {url: 'https://aisafety.world/'},
      {url: 'http://aisafety.world/'},
      {url: 'https://aisafety.world/?bla=bla'},
    ])('whose text matches url and host is whitelisted', ({url}) => {
      const input = `[${url}](${url})`
      const output = `<iframe src="${url}" sandbox="allow-scripts allow-same-origin"></iframe>`
      expect(urlToIframe(input)).toBe(output)
    })
  })
})

describe('externalLinksOnNewTab', () => {
  test('no link', () => {
    expect(externalLinksOnNewTab('gg')).toBe('gg')
  })

  test('text with internal and external links', () => {
    expect(
      externalLinksOnNewTab(
        'x <a href="/?state=3">gg</a> and <a href="https://example.com">hh</a> y'
      )
    ).toBe(
      'x <a href="/?state=3">gg</a> and <a href="https://example.com" target="_blank" rel="noreferrer">hh</a> y'
    )
  })
})
