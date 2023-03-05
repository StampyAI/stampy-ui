import { urlToIframe } from "./url-to-iframe"

describe('urlToIframe', () => {
  describe('should not convert an anchor tag', () => {
    it('whose href does not match tag content', () => {
      const input = `<a href="https://aisafety.world/">this map</a>`
      expect(urlToIframe(input)).toBe(input);
    });

    it('whose href matches tag content but is not whitelisted', () => {
      const url = 'https://example.com/'
      const input = `<a href="${url}">${url}</a>`
      expect(urlToIframe(input)).toBe(input);
    });
  })

  describe('should convert an anchor tag', () => {
    it('whose href matches tag content and is whitelisted', () => {
      const url = 'https://example.com/'
      const input = `<a href="${url}">${url}</a>`
      const output = `<iframe src="${url}" sandbox="allow-scripts allow-same-origin"/>`
      expect(urlToIframe(input)).toBe(output);
    });
  })
})