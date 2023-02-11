/**
 * Replaces all of the URLs in text with iframes of the URLs
 * @param text text in which URLs should be replaced
 */
export const urlToIframe = (text: string): string => {
  const whitelistedHosts = [
    "coda.io",
    "airtable.com", 
    "aisafety.world"
  ]

  // Regex is from: https://stackoverflow.com/a/3809435
  // const httpsUrlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi)

  // Regex is from: https://stackoverflow.com/a/26764609
  const anchorTagRegex = new RegExp(/<a[\s]+([^>]+)>((?:.(?!<\/a>))*.)<\/a>/gi)
  const matches = text.matchAll(anchorTagRegex)
  let updatedText = text
  for (const match of matches) {
    const fullTag = match[0] 
    const hrefUrl = match[1].replace('href=','').replace(/"/g, '') 
    const tagContent = match[2] 
    if (whitelistedHosts.includes(new URL(hrefUrl).host) && hrefUrl === tagContent) {
      updatedText = text.replace(fullTag, `<iframe src="${hrefUrl}"/>`)
    }
  }
  return updatedText
}
