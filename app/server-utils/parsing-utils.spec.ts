import {urlToIframe, uniqueFootnotes, externalLinksOnNewTab} from './parsing-utils'

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

describe('uniqueFootnotes', () => {
  test('no link', () => {
    expect(uniqueFootnotes('gg', '7757')).toBe('gg')
  })

  test('multiple footnotes, one of them repeated', () => {
    expect(
      uniqueFootnotes(
        `x<a href="#fn1" id="fnref1">[1]</a>
        y<a href="#fn1" id="fnref1:1">[1:1]</a>
        z<a href="#fn2" id="fnref2">[2]</a>
        ---
        <ol>
          <li id="fn1" class="footnote-item">
            gg <a href="#fnref1" class="footnote-backref">x</a> <a href="#fnref1:1" class="footnote-backref">y</a>
          </li>
          <li id="fn2" class="footnote-item">
            gg <a href="#fnref2" class="footnote-backref">x</a>
          </li>
        </ol>`,
        '7757'
      )
    ).toBe(
      `x<a href="#fn1-7757" id="fnref1-7757">[1]</a>
        y<a href="#fn1-7757" id="fnref1:1-7757">[1:1]</a>
        z<a href="#fn2-7757" id="fnref2-7757">[2]</a>
        ---
        <ol>
          <li id="fn1-7757" class="footnote-item">
            gg <a href="#fnref1-7757" class="footnote-backref">x</a> <a href="#fnref1:1-7757" class="footnote-backref">y</a>
          </li>
          <li id="fn2-7757" class="footnote-item">
            gg <a href="#fnref2-7757" class="footnote-backref">x</a>
          </li>
        </ol>`
    )
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
