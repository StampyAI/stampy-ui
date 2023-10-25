import {useEffect, useState} from 'react'
import {Header, Footer} from '~/components/layouts'

type Item = {
  items?: Item[]
  content?: string
  url?: string
}

const normalizeName = (name: string | undefined) => name?.replace(/[^A-Za-z]/g, '').toLowerCase()

const MaybeURL = ({item}: {item: Item}) => {
  if (!item || !item.content) {
    return null
  } else if (!item.url) {
    return <>{item.content}</>
  }
  return <a href={item.url}>{item.content}</a>
}

const LocalLink = ({item}: {item: Item}) => {
  return <a href={'#' + normalizeName(item.content)}>{item.content}</a>
}

const MainSectionLinks = ({main}: {main: Item}) => {
  return (
    <>
      <h2>
        <LocalLink item={main} />
      </h2>
      <ul>
        {main?.items?.map((item, i: number) => (
          <li key={i}>
            <LocalLink item={item} />
          </li>
        ))}
      </ul>
    </>
  )
}

const SideBar = ({toc}: {toc: Item[]}) => {
  return (
    <div className="toc-nav" style={{flex: '0 2 500px', marginRight: '10px'}}>
      {toc.map((main, i: number) => (
        <MainSectionLinks main={main} key={i} />
      ))}
    </div>
  )
}

const ChildList = ({items}: {items: Item[]}) => {
  if (!items) return null

  return (
    <ul>
      {items.map((child, i) => (
        <li key={i} id={normalizeName(child?.content)}>
          <MaybeURL item={child} />
          {child?.items && <ChildList items={child.items} />}
        </li>
      ))}
    </ul>
  )
}

const Section = ({item}: {item: Item}) => {
  return (
    <>
      <h2 id={normalizeName(item.content)}>
        <MaybeURL item={item} />
      </h2>
      {item?.items && <ChildList items={item.items} />}
    </>
  )
}

const Articles = ({toc}: {toc: Item[]}) => {
  return (
    <article className="toc" style={{padding: '10px'}}>
      {toc.map((main: Item, i: number) => (
        <Section key={i} item={main} />
      ))}
    </article>
  )
}

export default function App() {
  const [toc, setToc] = useState<Item[]>([])

  useEffect(() => {
    const fetcher = async () => {
      const response = await fetch('/toc.json')
      setToc(await response.json())
    }
    fetcher()
  }, [])

  return (
    <>
      <style>{`
        body { max-width: 1400px; }
            `}</style>
      <Header />
      <main className="toc-container">
        <SideBar toc={toc} />
        <Articles toc={toc} />
      </main>
      <Footer />
    </>
  )
}
