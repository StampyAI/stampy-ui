import MarkdownIt from 'markdown-it'
import MarkdownItFootnote from 'markdown-it-footnote'

/**
 * Replaces all whitelisted URLs in the text with iframes of the URLs
 * @param markdown text in which URLs should be replaced
 */
export const urlToIframe = (markdown: string): string => {
  const whitelistedHosts: Record<string, HostConfig> = {
    'aisafety.world': {sandboxValue: 'allow-scripts allow-same-origin'},
  }

  // Regex to extract known links:
  // \[               <-- start of markdown link, i.e. [name](url)
  //   (              <-- capture the url
  //     https?:\/\/  <-- check for both http and https
  //     [\.\w]+?     <-- any string of alphanumerical characters and full stops
  //     \/?[^\]]*    <-- optional query params
  //   )
  // \]
  // \(
  //     \1           <-- lookback to match whatever the first group caught
  // \)
  const matches = markdown.matchAll(/\[(https?:\/\/[.\w]+?\/?[^\]]*?)\]\(\1\)/gi)

  let updatedText = markdown
  for (const [link, url] of matches) {
    const host = new URL(url).host
    const hostConfig = whitelistedHosts[host]
    if (hostConfig) {
      updatedText = markdown.replace(
        link,
        `<iframe src="${url}" sandbox="${hostConfig.sandboxValue}"></iframe>`
      )
    }
  }
  return updatedText
}

interface HostConfig {
  sandboxValue: string
}

const md = new MarkdownIt({html: true}).use(MarkdownItFootnote)
export const convertToHtmlAndWrapInDetails = (markdown: string): string => {
  // Recursively wrap any [See more...] segments in HTML Details
  const seeMoreToken = 'SEE-MORE-BUTTON'
  const wrap = ([chunk, ...rest]: string[]): string => {
    if (!rest || rest.length == 0) return chunk
    return `<div>${chunk}<div>
           <a href="" class="see-more"></a>
           <div class="see-more-contents">${wrap(rest)}</div>`
  }
  // Add magic to handle markdown shortcomings.
  // The [See more...] button will be transformed into an empty link if processed.
  // On the other hand, if the whole text isn't rendered as one, footnotes will break.
  // To get round this, replace the [See more...] button with a magic string, render the
  // markdown, then mangle the resulting HTML to add an appropriate button link
  markdown = markdown.replaceAll(/\[[Ss]ee more\W*?\]/g, seeMoreToken)
  markdown = md.render(markdown)
  markdown = wrap(markdown.split(seeMoreToken))

  return markdown
}

export const uniqueFootnotes = (html: string, pageid: string): string => {
  // Make sure the footnotes point to unique ids. This is very ugly and would be better handled
  // with a proper parser, but should do the trick so is fine? Maybe?
  html = html.replace(
    /<a href="#(fn\d+)" id="(fnref\d+)">/g,
    `<a href="#$1-${pageid}" id="$2-${pageid}">`
  )
  html = html.replace(
    /<a href="#(fnref?\d+)" class="footnote-backref">/g,
    `<a href="#$1-${pageid}" class="footnote-backref">`
  )
  html = html.replace(
    /<li id="(fn\d+)" class="footnote-item">/g,
    `<li id="$1-${pageid}" class="footnote-item">`
  )

  return html
}

export const cleanUpDoubleBold = (html: string): string => {
  // The parser sometimes generates chunks of bolded or italicised texts next to
  // each other, e.g. `**this is bolded****, but so is this**`. The renderer doesn't
  // know what to do with this, so it results in something like `<b>this is bolded****, but so is this</b>`.
  // For lack of a better solution, just remove any '**'
  return html.replaceAll('**', '')
}

export const externalLinksOnNewTab = (html: string): string => {
  // Open external links on new tab by using target="_blank",
  // pros&cons were extensively discussed in https://github.com/StampyAI/stampy-ui/issues/222
  // internal links look like <a href="/?state=1234">, so all absolute http links are treated as external
  return html.replace(/(<a href="http[^"]+")/g, `$1 target="_blank" rel="noreferrer"`)
}
