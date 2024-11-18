import MarkdownIt from 'markdown-it'
import MarkdownItFootnote from 'markdown-it-footnote'


const md = new MarkdownIt({
  html: true,
  typographer: true,
  quotes: '""\'\'',
  breaks: true,
}).use(MarkdownItFootnote)

// Force blockquotes to be preserved
md.enable('blockquote') 

// Add explicit rendering rules for blockquotes
md.renderer.rules.blockquote_open = () => '<blockquote class="stampy-blockquote">'
md.renderer.rules.blockquote_close = () => '</blockquote>\n'

// When processing text inside blockquotes, preserve line breaks
md.renderer.rules.text = (tokens, idx) => {
  if (tokens[idx].content.includes('\n')) {
    return tokens[idx].content.split('\n').join('<br/>\n')
  }
  return tokens[idx].content
}

// Update CSS to match
// Add paragraph styling within blockquotes
md.renderer.rules.paragraph_open = (tokens, idx) => {
  const token = tokens[idx]
  if (token.block && token.level > 0) { // Check if we're inside a blockquote
    return '<p class="m-0">'
  }
  return '<p>'
}

md.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString()
  if (tokens[idx].meta.subId > 0) n += `:${tokens[idx].meta.subId}`
  return n
}

export const convertMarkdownToHtml = (markdown: string, pageid?: string): string => {
  // First convert markdown to HTML
  let html = md.render(markdown)

  // Apply post-processing
  html = cleanUpDoubleBold(html)
  html = allLinksOnNewTab(html)
  
  if (pageid) {
    html = uniqueFootnotes(html, pageid)
  }

  return html
}

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

export const uniqueFootnotes = (html: string, pageid: string): string => {
  // Make sure the footnotes point to unique ids. This is very ugly and would be better handled
  // with a proper parser, but should do the trick so is fine? Maybe?
  html = html.replace(
    /<a href="#(fn\d+)" id="(fnref[\d:]+)">/g,
    `<a href="#$1-${pageid}" id="$2-${pageid}">`
  )
  html = html.replace(
    /<a href="#(fnref?[\d:]+)" class="footnote-backref">/g,
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

export const allLinksOnNewTab = (html: string): string => {
  // Open external links on new tab by using target="_blank",
  // pros&cons were extensively discussed in https://github.com/StampyAI/stampy-ui/issues/222
  // internal links look like <a href="/?state=1234">, so all absolute http links are treated as external
  return html.replace(/(<a href="[^#].*?")/g, `$1 target="_blank" rel="noreferrer"`)
}
