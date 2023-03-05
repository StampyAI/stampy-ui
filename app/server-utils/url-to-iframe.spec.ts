import {urlToIframe} from './url-to-iframe'

describe('urlToIframe', () => {
  describe('should not convert a markdown link', () => {
    it('whose text does not match url', () => {
      const input = `[this map](https://aisafety.world/)`
      expect(urlToIframe(input)).toBe(input)
    })

    it('whose text matches url but is not whitelisted', () => {
      const url = 'https://example.com/'
      const input = `[${url}](${url})</a>`
      expect(urlToIframe(input)).toBe(input)
    })
  })

  describe('should convert a markdown link', () => {
    it('whose text matches url and is whitelisted', () => {
      const url = 'https://aisafety.world/'
      const input = `[${url}](${url})`
      const output = `<iframe src="${url}" sandbox="allow-scripts allow-same-origin"></iframe>`
      expect(urlToIframe(input)).toBe(output)
    })
  })
})
