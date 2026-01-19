export const createMetaTags = ({
  title,
  description,
  url,
  image,
}: {
  title: string
  description: string
  url?: string
  image?: string
}) => {
  const logo = image || '/aisafety-logo.png'

  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:url', content: url},
    {property: 'og:type', content: 'article'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:image', content: logo},
    {property: 'og:image:type', content: 'image/png'},
    {property: 'og:image:width', content: '1200'},
    {property: 'og:image:height', content: '630'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: logo},
    {name: 'twitter:creator', content: '@stampyai'},
    {name: 'twitter:url', content: url},
  ]
}
