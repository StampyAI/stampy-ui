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
  const httpsUrlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi)
  const matches = text.matchAll(httpsUrlRegex)
  let updatedText = text
  for (const match of matches) {
    const url = match[0] 
    if (whitelistedHosts.includes(new URL(url).host))
    updatedText = text.replace(url, `<iframe src="${url}"/>`)
  }
  return updatedText
}
