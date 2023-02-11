import { urlToIframe } from "./url-to-iframe"

describe('urlToIframe', () => {
  it('should handle anchor tags', () => {
    const input = `
      <p>There is a Cambrian explosion of approaches to solving alignment. 
        Click through to the follow-up questions to explore the research directions of groups and individuals in the field, 
        or browse <a href="https://aisafety.world/">this map</a>:</p>\n
      <p><a href="https://aisafety.world/">https://aisafety.world/</a></p>\n
      <p>See also: <a href="https://www.alignmentforum.org/posts/QBAjndPuFbhEXKcCr/my-understanding-of-what-everyone-in-technical-alignment-is">https://www.alignmentforum.org/posts/QBAjndPuFbhEXKcCr/my-understanding-of-what-everyone-in-technical-alignment-is</a></p>\n`;

    const output = `
      <p>There is a Cambrian explosion of approaches to solving alignment. 
        Click through to the follow-up questions to explore the research directions of groups and individuals in the field, 
        or browse <a href="https://aisafety.world/">this map</a>:</p>\n
      <p><a href="https://aisafety.world/">https://aisafety.world/</a></p>\n
      <p>See also: <a href="https://www.alignmentforum.org/posts/QBAjndPuFbhEXKcCr/my-understanding-of-what-everyone-in-technical-alignment-is">https://www.alignmentforum.org/posts/QBAjndPuFbhEXKcCr/my-understanding-of-what-everyone-in-technical-alignment-is</a></p>\n`;

    expect(urlToIframe(input)).toBe(output);
  });
})