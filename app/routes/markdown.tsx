// app/routes/markdown.tsx
import { useState } from 'react'
import type { MetaFunction } from '@remix-run/react'
import { convertMarkdownToHtml } from '~/server-utils/parsing-utils'

export const meta: MetaFunction = () => {
  return [
    { title: "Markdown Test - AISafety.info" },
    { name: "description", content: "Test page for markdown rendering" },
  ]
}

const defaultContent = `> I'm envisioning that in the future there will also be systems where you can input any conclusion that you want to argue (including moral conclusions) and the target audience, and the system will give you the most convincing arguments for it. At that point people won't be able to participate in any online (or offline for that matter) discussions without risking their object-level values being hijacked.

This is regular text with a [link to example](https://example.com).

> This is another blockquote to test styling.
> With multiple lines.

Regular paragraph with **bold** and *italic* text.`

export default function MarkdownTest() {
  const [markdown, setMarkdown] = useState(defaultContent);
  
  return (
    <div className="page">
      <div className="page-body padding-top-80">
        <h1 className="padding-bottom-40">Markdown Test Page</h1>
        
        <div className="section-grid">
          <div>
            <h2 className="padding-bottom-16">Input Markdown</h2>
            <textarea 
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-64 p-4 border rounded font-mono text-sm"
            />
          </div>
          
          <div>
            <h2 className="padding-bottom-16">Rendered Output</h2>
            <div 
              className="prose max-w-none p-4 border rounded"
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(markdown) }}
            />
          </div>

          <div>
            <h2 className="padding-bottom-16">Raw Markdown from Question</h2>
            <pre className="p-4 border rounded bg-gray-50 overflow-auto">
              {JSON.stringify(
                // @ts-ignore - We know this exists in the window object
                window.__remixContext?.state?.loaderData?.root?.question?.markdown,
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}