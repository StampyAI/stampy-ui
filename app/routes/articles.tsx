import {useLoaderData} from '@remix-run/react'
import {Link} from '@remix-run/react'
import {MetaFunction, LoaderFunctionArgs} from '@remix-run/cloudflare'
import Page from '~/components/Page'
import {loadToC, TOCItem, BASIC, ADVANCED, Category} from '~/routes/questions.toc'
import {questionUrl, articlesUrl} from '~/routesMapper'
import {createMetaTags} from '~/utils/meta'
import ChevronRight from '~/components/icons-generated/ChevronRight'

export const loader = async ({request}: LoaderFunctionArgs) => {
  try {
    return await loadToC(request)
  } catch (e) {
    console.error(e)
    throw new Response('Could not fetch articles', {status: 500})
  }
}

export const meta: MetaFunction = () =>
  createMetaTags({
    title: 'All Articles - AISafety.info',
    description: 'Browse all published AI safety articles on AISafety.info',
    url: articlesUrl(),
  })

const collectPageIds = (items: TOCItem[], set = new Set<string>()): Set<string> => {
  items.forEach((item) => {
    set.add(item.pageid)
    if (item.children) collectPageIds(item.children, set)
  })
  return set
}

const Chevron = () => <ChevronRight width={12} height={12} className="dropdown-icon" />

const ArticleTree = ({item, depth = 0}: {item: TOCItem; depth?: number}) => {
  const hasChildren = item.children && item.children.length > 0

  if (!hasChildren) {
    return (
      <div style={{paddingLeft: depth * 24 + 20, padding: '8px 0 8px ' + (depth * 24 + 20) + 'px'}}>
        {item.hasText ? (
          <Link to={questionUrl(item)} className="teal-500">
            {item.title}
          </Link>
        ) : (
          <span>{item.title}</span>
        )}
      </div>
    )
  }

  return (
    <details open style={{paddingLeft: depth * 24}}>
      <summary
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          padding: '8px 0',
          listStyle: 'none',
        }}
      >
        <Chevron />
        {item.hasText ? (
          <Link to={questionUrl(item)} className="teal-500" onClick={(e) => e.stopPropagation()}>
            {item.title}
          </Link>
        ) : (
          <span>{item.title}</span>
        )}
      </summary>
      {item.children!.map((child) => (
        <ArticleTree key={child.pageid} item={child} depth={depth + 1} />
      ))}
    </details>
  )
}

const Section = ({category, toc}: {category: Category; toc: TOCItem[]}) => {
  const items = toc.filter((item) => item.category === category)
  if (items.length === 0) return null
  return (
    <details open style={{marginBottom: 24}}>
      <summary
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          padding: '8px 0',
          listStyle: 'none',
        }}
      >
        <Chevron />
        <h2 style={{margin: 0}}>{category} sections</h2>
      </summary>
      {items.map((item) => (
        <ArticleTree key={item.pageid} item={item} depth={1} />
      ))}
    </details>
  )
}

export default function AllArticles() {
  const {data} = useLoaderData<ReturnType<typeof loader>>()
  const {toc, visible} = data

  const tocPageIds = collectPageIds(toc)
  const otherArticles = visible
    .filter((item) => !tocPageIds.has(item.pageid))
    .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))

  return (
    <Page>
      <main>
        <div className="article-container" style={{flexDirection: 'column', maxWidth: 800}}>
          <h1 className="padding-bottom-8">All Articles</h1>
          <div className="padding-bottom-32 grey">{visible.length} articles</div>

          <Section category={BASIC} toc={toc} />
          <Section category={ADVANCED} toc={toc} />

          {otherArticles.length > 0 && (
            <details open style={{marginBottom: 24}}>
              <summary
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '8px 0',
                  listStyle: 'none',
                }}
              >
                <Chevron />
                <h2 style={{margin: 0}}>Other articles</h2>
              </summary>
              {otherArticles.map((item) => (
                <ArticleTree key={item.pageid} item={item} depth={1} />
              ))}
            </details>
          )}
        </div>
      </main>
    </Page>
  )
}
