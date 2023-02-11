import { urlToIframe } from "./url-to-iframe"

describe('urlToIframe', () => {
  it('should handle anchor tags', () => {
    const text = '';
    expect(urlToIframe(text)).toBe('result');
  });
})