const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url)
  let contentType = getContentType(filePath) || 'text/html'

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404
        res.end('File not found')
      } else {
        res.statusCode = 500
        res.end('Internal Server Error')
      }
    } else {
      res.statusCode = 200
      res.setHeader('Content-Type', contentType)
      res.end(content)
    }
  })
})

server.listen(3123, '127.0.0.1', () => {
  console.log('Server listening on port 3123')
})

function getContentType(filePath) {
  let extname = path.extname(filePath)
  if (extname === '.html') {
    return 'text/html'
  } else if (extname === '.css') {
    return 'text/css'
  } else if (extname === '.js') {
    return 'text/javascript'
  } else if (extname === '.png') {
    return 'image/png'
  }
  return null
}
