/**
 * Replaces all of the URLs in text with iframes of the URLs
 * @param text text in which URLs should be replaced
 */
export const urlToIframe = (text: string): string => {
  const whitelistedHosts = ['aisafety.world']

  // Regex is from: https://stackoverflow.com/a/26764609
  const anchorTagRegex = new RegExp(/<a[\s]+([^>]+)>((?:.(?!<\/a>))*.)<\/a>/gi)
  const matches = text.matchAll(anchorTagRegex)
  let updatedText = text
  for (const match of matches) {
    // Example fulltag: '<a href="https://aisafety.world/">https://aisafety.world/</a>'
    const fullTag = match[0]
    // Example hrefUrl: 'https://aisafety.world/'
    const hrefUrl = match[1].replace('href=', '').replace(/"/g, '')
    // Example tagContent: 'https://aisafety.world/'
    const tagContent = match[2]
    if (whitelistedHosts.includes(new URL(hrefUrl).host) && hrefUrl === tagContent) {
      updatedText = text.replace(fullTag, `<iframe src="${hrefUrl}"></iframe>`)
    }
  }
  return updatedText
}
