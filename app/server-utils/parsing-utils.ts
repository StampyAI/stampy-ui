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
md.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString()
  if (tokens[idx].meta.subId > 0) n += `:${tokens[idx].meta.subId}`
  return n
}

export const convertMarkdownToHtml = (markdown: string): string => {
  return md.render(markdown)
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

// Helper function to convert YouTube URLs to embed URLs
const resolveYoutubeEmbedUrl = (url: string): string => {
  // Pattern to get youtube ID found from https://regex101.com/library/OY96XI
  const pattern =
    /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gim
  const match = pattern.exec(url)

  if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`

  return url
}

export type MediaItem = {
  type: 'image' | 'youtube' | 'iframe'
  url: string
  title?: string
}

export type Carousel = {
  items: MediaItem[]
  id: string
}

export const convertCarousels = (markdown: string | null) => {
  if (!markdown) return null

  const carousels: Carousel[] = []

  const carouselRegex = /:::\s*carousel\n([\s\S]*?)\n:::/g
  markdown = markdown.replace(carouselRegex, (_, content: string) => {
    const items = content
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.trim().substring(1).trim())
      .map((item) => {
        const match = item.match(/\[(.*?)\]\((.*?)\)/)
        if (match) {
          const url = resolveYoutubeEmbedUrl(match[2])
          let type = 'image'
          if (url.includes('youtube.com')) type = 'youtube'
          return {
            type,
            url,
            title: match[1],
          }
        }

        return null
      })
      .filter(Boolean) as MediaItem[]
    const carousel = {
      items: items,
      id: `CAROUSEL-${crypto.randomUUID()}`,
    }
    carousels.push(carousel)
    // This is replacing all carousels with a unique id to be parsed after html translation
    return `<div id="${carousel.id}"></div>`
  })

  return {
    markdown,
    carousels,
  }
}
