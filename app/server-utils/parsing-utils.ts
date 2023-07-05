import MarkdownIt from 'markdown-it'

/**
 * Replaces all whitelisted URLs in the text with iframes of the URLs
 * @param text text in which URLs should be replaced
 */
export const urlToIframe = (text: string): string => {
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
  const matches = text.matchAll(/\[(https?:\/\/[.\w]+?\/?[^\]]*?)\]\(\1\)/gi)

  let updatedText = text
  for (const [link, url] of matches) {
    const host = new URL(url).host
    const hostConfig = whitelistedHosts[host]
    if (hostConfig) {
      updatedText = text.replace(
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

export const wrapInDetails = (contents: string, md: MarkdownIt): string => {
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
  contents = contents.replaceAll(/\[[Ss]ee more\W*?\]/g, seeMoreToken)
  contents = md.render(contents)
  contents = wrap(contents.split(seeMoreToken))

  return contents
}

export const uniqueFootnotes = (contents: string, pageid: string): string => {
  // Make sure the footnotes point to unique ids. This is very ugly and would be better handled
  // with a proper parser, but should do the trick so is fine? Maybe?
  contents = contents.replace(
    /<a href="#(fn\d+)" id="(fnref\d+)">/g,
    `<a href="#$1-${pageid}" id="$2-${pageid}">`
  )
  contents = contents.replace(
    /<a href="#(fnref?\d+)" class="footnote-backref">/g,
    `<a href="#$1-${pageid}" class="footnote-backref">`
  )
  contents = contents.replace(
    /<li id="(fn\d+)" class="footnote-item">/g,
    `<li id="$1-${pageid}" class="footnote-item">`
  )

  return contents
}

export const cleanUpDoubleBold = (contents: string): string => {
  // The parser sometimes generates chunks of bolded or italicised texts next to
  // each other, e.g. `**this is bolded****, but so is this**`. The renderer doesn't
  // know what to do with this, so it results in something like `<b>this is bolded****, but so is this</b>`.
  // For lack of a better solution, just remove any '**'
  return contents.replaceAll('**', '')
}
