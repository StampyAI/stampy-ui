# Stampy-UI Debugging Tools

This directory contains tools for debugging and development purposes.

## Coda Markdown Viewer

`coda-markdown-viewer.html` is a standalone tool for viewing the raw markdown content from Coda before it's processed and rendered as HTML on the website.

### Features

- Makes direct API calls to Coda using the API token from wrangler.toml
- Shows the raw markdown with whitespace characters (spaces, newlines) highlighted
- Displays both the original API response and the processed markdown
- Helps debug formatting and spacing issues in the content

### Usage

1. Open the HTML file in a browser (no server needed)
2. Enter a question ID in the input field (e.g., "NM3E")
3. Click "Fetch Raw Markdown" to retrieve and display the content
4. Use the toggle buttons to view different aspects of the data:
   - Raw markdown with whitespace highlighted
   - The exact Rich Text field from the API
   - The full API response

This tool is particularly useful for diagnosing spacing and formatting issues between paragraphs, lists, and other markdown elements.

### How It Works

The tool mimics the server-side behavior by:

- Making the same API call to Coda that the server makes
- Extracting the markdown from `response.items[0].values['Rich Text']`
- Processing it with `extractText()` which handles arrays and removes code block markers

This lets you see exactly what markdown content the website receives before any HTML conversion or styling is applied.

### Maintenance Note

This tool is designed based on the codebase as of May 2025 and relies on specific implementation details:

- The Coda document ID: `fau7sl2hmG`
- The table ID: `grid-sync-1059-File`
- The data structure where markdown is stored: `values['Rich Text']`
- The `extractText()` function that processes the raw markdown

If any of these details change in the future, the tool may need to be updated to remain functional. Most changes can be made by updating the constants at the top of the JavaScript section in the HTML file.
