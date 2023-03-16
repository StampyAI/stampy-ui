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
