import {urlToIframe} from '~/server-utils/md-to-html/url-to-iframe'
import MarkdownIt from 'markdown-it'
import MarkdownItFootnote from 'markdown-it-footnote'

// Sometimes string fields are returned as lists. This can happen when there are duplicate entries in Coda
const head = (item: any) => {
  if (Array.isArray(item)) return item[0]
  return item
}

export const extractText = (markdown: string) => head(markdown)?.replace(/^```|```$/g, '')

const md = new MarkdownIt({html: true}).use(MarkdownItFootnote)

/*
 * Transform the Coda markdown into HTML
 */
export class MdRenderer {
  static renderText(text: string | null): string | null {
    if (text === null) return null

    let contents = extractText(text)

    // Recursively wrap any [See more...] segments in HTML Details
    const wrapInDetails = ([chunk, ...rest]: string[]): string => {
      if (!rest || rest.length == 0) return chunk
      return `${chunk}
            <a href="" class="see-more">See more...</a>
            <div class="see-more-contents">${wrapInDetails(rest)}</div>`
    }
    contents = contents.split(/\[[Ss]ee more\W*?\]/).map((i: string) => md.render(i))
    return urlToIframe(wrapInDetails(contents))
  }
}