import {LoaderArgs} from '@remix-run/cloudflare'

export const loader = ({request}: LoaderArgs) => {
  // handle "GET" request
  // set up our text content that will be returned in the response
  const origin = new URL(request.url).origin
  const robotText = `
User-agent: Googlebot
Disallow: /nogooglebot/

User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
  // return the text content, a status 200 success response, and set the content type to text/plain
  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
