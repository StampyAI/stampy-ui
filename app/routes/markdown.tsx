import React, { useState, useEffect } from 'react';

// QuestionContent component included in the same file
const QuestionContent = ({ question }) => {
  // Convert markdown-style blockquotes to HTML blockquotes
  const processMarkdown = (markdown) => {
    if (!markdown) return '';

    // Split into lines to process blockquotes
    const lines = markdown.split('\n');
    let inBlockquote = false;
    let processedLines = [];
    let currentBlockquote = [];

    for (let line of lines) {
      // Check if line starts with blockquote marker
      if (line.trim().startsWith('>')) {
        // Remove the '>' and trim
        const content = line.replace(/^>/, '').trim();
        if (!inBlockquote) {
          inBlockquote = true;
          currentBlockquote = [];
        }
        currentBlockquote.push(content);
      } else {
        // If we were in a blockquote, close it
        if (inBlockquote) {
          processedLines.push(`<blockquote class="stampy-blockquote">${currentBlockquote.join('<br/>')}</blockquote>`);
          inBlockquote = false;
          currentBlockquote = [];
        }
        // Keep non-blockquote lines as-is
        if (line.trim()) {
          processedLines.push(`<p>${line}</p>`);
        }
      }
    }

    // Close any remaining blockquote
    if (inBlockquote) {
      processedLines.push(`<blockquote class="stampy-blockquote">${currentBlockquote.join('<br/>')}</blockquote>`);
    }

    return processedLines.join('\n');
  };

  // Process the markdown and return HTML
  const processContent = () => {
    const content = question?.markdown || question?.text;
    if (!content) return '';
    return processMarkdown(content);
  };

  return processContent();
};

const defaultContent = `> I'm envisioning that in the future there will also be systems where you can input any conclusion that you want to argue (including moral conclusions) and the target audience, and the system will give you the most convincing arguments for it. At that point people won't be able to participate in any online (or offline for that matter) discussions without risking their object-level values being hijacked.

This is regular text with a [link to example](https://example.com).

> This is another blockquote to test styling.
> With multiple lines.

Regular paragraph with **bold** and *italic* text.`;

// Function to safely get question markdown from window context
const getQuestionMarkdown = () => {
  try {
    if (typeof window !== 'undefined') {
      return window?.__remixContext?.state?.loaderData?.root?.question?.markdown;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const MarkdownTest = () => {
  const [markdown, setMarkdown] = useState(defaultContent);
  const [questionMarkdown, setQuestionMarkdown] = useState(null);

  // Use useEffect to safely access window after component mounts
  useEffect(() => {
    const qMarkdown = getQuestionMarkdown();
    if (qMarkdown) {
      setQuestionMarkdown(qMarkdown);
    }
  }, []);

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
              dangerouslySetInnerHTML={{ 
                __html: QuestionContent({ question: { markdown }})
              }} 
            />
          </div>

          {questionMarkdown && (
            <div>
              <h2 className="padding-bottom-16">Raw Markdown from Question</h2>
              <pre className="p-4 border rounded bg-gray-50 overflow-auto">
                {JSON.stringify(questionMarkdown, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownTest;