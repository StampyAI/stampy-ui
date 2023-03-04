import { urlToIframe } from "./url-to-iframe"

describe('urlToIframe', () => {
  it('should not convert an anchor tag whose href does not match tag content', () => {
    const input = `<a href="https://aisafety.world/">this map</a>`
    expect(urlToIframe(input)).toBe(input);
  });

  it('should convert an anchor tag whose href matches tag content', () => {
    const input = `<a href="https://aisafety.world/">https://aisafety.world/</a>`
    const output = `<iframe src="https://aisafety.world/" sandbox="allow-scripts allow-same-origin"/>`
    expect(urlToIframe(input)).toBe(output);
  });
})